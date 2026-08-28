import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';
import {useQuery} from '@tanstack/react-query';
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
import {getGuildStatistic, StatisticItem} from 'api/statistic';
import BaseLoader from 'components/GeneralComponents/BaseLoader';
import {BlockStyles} from 'pages/Dashboard/DashboardStyled';
import {globalLocalization} from 'services/GlobalUtils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

type StatKey = 'total' | 'rate' | 'newbies';

const Charts = () => {
  const {language} = useAppSelector(selectUserConfiguration);

  const {
    data: guildStatistic = [],
    isPending,
    isError,
  } = useQuery<StatisticItem[]>({
    queryKey: ['guildStatistic'],
    queryFn: () => getGuildStatistic(),
  });

  const extractedData = useMemo(
    () =>
      guildStatistic.reduce<{labels: string[]; total: number[]; rate: number[]; newbies: number[]}>(
        (acc, {date, total, rate, newbies}) => {
          acc.labels.push(date);
          acc.total.push(Number(total) || 0);
          acc.rate.push(rate);
          acc.newbies.push(newbies);
          return acc;
        },
        {labels: [], total: [], rate: [], newbies: []}
      ),
    [guildStatistic]
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

  const {TOTAL, RATE, NEW} = globalLocalization(language);

  const chartsConfig: {key: StatKey; color: string; title: string}[] = [
    {key: 'total', color: 'rgba(72, 99, 235, 0.7)', title: TOTAL},
    {key: 'rate', color: 'rgba(68, 217, 38, 0.7)', title: RATE},
    {key: 'newbies', color: 'rgba(235, 72, 99, 0.7)', title: NEW},
  ];

  if (isError) return <Wrapper>Failed to load guild statistics.</Wrapper>;

  return (
    <Wrapper>
      {chartsConfig.map(({key, color, title}) =>
        isPending ? (
          <BaseLoader key={key} />
        ) : (
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
        )
      )}
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
