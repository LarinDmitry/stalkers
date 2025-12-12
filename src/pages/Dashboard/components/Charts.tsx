import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';
import {Line} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  ChartData,
} from 'chart.js';
import {useAppSelector} from 'services/hooks';
import {selectUserConfiguration} from 'store/userSlice';
import {selectDataConfiguration} from 'store/dataSlice';
import {localization} from '../DashboardUtils';
import {BlockStyles} from 'pages/Dashboard/DashboardStyled';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

type StatKey = 'total' | 'rate' | 'newbies';

const Charts = () => {
  const {language} = useAppSelector(selectUserConfiguration);
  const {guildStatistic} = useAppSelector(selectDataConfiguration);

  const extractedData = useMemo(
    () =>
      guildStatistic.reduce<{labels: string[], total: number[], rate: number[], newbies: number[]}>(
        (acc, {date, total, rate, newbies}) => {
          acc.labels.push(date);
          acc.total.push(total);
          acc.rate.push(rate);
          acc.newbies.push(newbies);
          return acc;
        },
        {labels: [], total: [], rate: [], newbies: []}
      ),
    []
  );

  const createGradient = useCallback((ctx: CanvasRenderingContext2D | null, color: string) => {
    if (!ctx) return color;
    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(255, 255, 255, .4)');

    return gradient;
  }, []);

  const createChartData = useCallback(
    (ctx: CanvasRenderingContext2D | null, data: number[], color: string): ChartData<'line'> => ({
      labels: extractedData.labels,
      datasets: [
        {
          label: 'value',
          data,
          borderColor: color,
          backgroundColor: createGradient(ctx, color),
          tension: 0.3,
          fill: true,
          pointBackgroundColor: color,
        },
      ],
    }),
    [extractedData.labels, createGradient]
  );

  const createOptions = (text: string) => {
    const color = 'rgb(238 238 238)';
    return {
      scales: {
        x: {
          display: true,
          grid: {color},
          border: {color},
        },
        y: {
          display: true,
          grid: {color},
          border: {color},
        },
      },
      animation: {
        duration: 2500,
        easing: 'easeInOutQuart' as const,
      },
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text,
        },
        datalabels: {display: false},
      },
    };
  };

  const {TOTAL, RATE, NEW} = localization(language);

  const chartsConfig: {key: StatKey; color: string; title: string}[] = [
    {key: 'total', color: 'rgba(72, 99, 235, 0.7)', title: TOTAL},
    {key: 'rate', color: 'rgba(68, 217, 38, 0.7)', title: RATE},
    {key: 'newbies', color: 'rgba(235, 72, 99, 0.7)', title: NEW},
  ];

  return (
    <Wrapper>
      {chartsConfig.map(({key, color, title}) => (
        <Chart key={key}>
          <Line
            data={createChartData(
              (document.createElement('canvas') as HTMLCanvasElement).getContext('2d'),
              extractedData[key] as number[],
              color
            )}
            options={createOptions(title)}
          />
        </Chart>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, calc(33% - 0.5rem));
  grid-column-gap: 1rem;

  @media ${({theme}) => theme.breakpoints.maxTb} {
    grid-template-columns: 1fr;
    grid-row-gap: 1rem;
  }
`;

const Chart = styled.div`
  ${BlockStyles};
  background: ${({theme}) => theme.colors.gray000};
  border-radius: 12px;
  padding-left: 0.5rem;
  align-items: center;
  display: flex;
`;

export default Charts;
