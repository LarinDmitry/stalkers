import React, {useCallback, useEffect, useMemo} from 'react';
import {useLocation, useParams} from 'react-router';
import ReactGA from 'react-ga4';
import styled from 'styled-components';
import {Bar} from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import BackBtn from 'components/GeneralComponents/BackBtn';
import {useAppSelector} from 'services/hooks';
import {selectUserConfiguration} from 'store/userSlice';
import {backgroundColor, hoverBackgroundColor} from 'pages/Main/MainUtils';
import {globalLocalization} from 'services/GlobalUtils';
import {localization} from './CompareUtils';
import {selectDataConfiguration} from 'store/dataSlice';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const CompareView = () => {
  const {id} = useParams<{id: string}>();
  const location = useLocation();
  const {language} = useAppSelector(selectUserConfiguration);
  const {latestZveks} = useAppSelector(selectDataConfiguration);

  useEffect(() => {
    ReactGA.send({hitType: 'compare', page: location.pathname});
  }, []);

  const dataLastThreeEvents = useMemo(() => {
    if (!id) return null;

    const parsedData = id.split('^').map((item) => {
      const entry = latestZveks.find(({name}) => name === item);
      return {
        name: entry?.name,
        damageByDay: entry?.info?.map(({damage, date}) => ({damage, date})).slice(-3),
      };
    });

    const labels = parsedData[0]?.damageByDay?.map(({date}) => date) || [];

    const maxValuesByDate = labels.map((_, index) =>
      Math.max(...parsedData.map((data) => data.damageByDay?.[index]?.damage || 0))
    );

    return {
      labels,
      datasets: parsedData.map((item, index) => ({
        label: item.name || `Data ${index + 1}`,
        data: item.damageByDay?.map(({damage}) => damage) || [],
        backgroundColor: backgroundColor[index % backgroundColor.length],
        hoverBackgroundColor: hoverBackgroundColor[index % hoverBackgroundColor.length],
        borderWidth: 1,
        borderRadius: 4,
        maxValues: maxValuesByDate,
      })),
    };
  }, [id]) as any;

  const getOptions = useCallback(
    (text: string, maxValuesByDate?: number[]) => ({
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {stacked: false},
        y: {
          stacked: false,
          ticks: {
            callback: (value: number) => `${(value / 1e9).toFixed(2)}`,
          },
        },
      },
      plugins: {
        legend: {position: 'top'},
        title: {display: true, text},
        datalabels: {
          display: true,
          color: 'rgb(0, 0, 0)',
          align: 'end',
          anchor: 'end',
          formatter: (value: number, context: any) => {
            if (maxValuesByDate) {
              const dayIndex = context.dataIndex;
              const maxValue = maxValuesByDate[dayIndex];

              if (!maxValue || maxValue === 0) return '';

              const percentage = (value / maxValue) * 100;
              return `${Math.round(percentage)}%`;
            }

            return `${(value / 1e9).toFixed(2)}`;
          },
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (context: any) => {
              const value = context.raw || 0;
              return `${context.dataset.label}: ${(value / 1e9).toFixed(2)}`;
            },
          },
        },
      },
    }),
    []
  ) as any;

  const {COMPARE_ZVEK, COMPARE_DAYS} = localization(language);
  const {TUE, WED, THU, FRI, SAT, SUN} = globalLocalization(language);

  const zvekDaysOptions = useMemo(() => [TUE, WED, THU, FRI, SAT, SUN], [FRI, SAT, SUN, THU, TUE, WED]);

  const prepareChartData = useCallback(
    (extractor: (entry: any) => number[] | undefined, labelPrefix: string, days: number, useZvekDays = false) => {
      if (!id) return null;

      const parsedData = id.split('^').map((item) => {
        const entry = latestZveks.find(({name}) => name === item);
        return {
          name: entry?.name,
          value: extractor(entry)?.slice(-days),
        };
      });

      const labels = useZvekDays ? zvekDaysOptions.slice(-days) : Array.from({length: days}, (_, i) => `Day ${i + 1}`);

      return {
        labels,
        datasets: parsedData.map((item, index) => ({
          label: item.name || `${labelPrefix} ${index + 1}`,
          data: item.value || [],
          backgroundColor: backgroundColor[index % backgroundColor.length],
          hoverBackgroundColor: hoverBackgroundColor[index % hoverBackgroundColor.length],
          borderWidth: 1,
          borderRadius: 4,
        })),
      };
    },
    [id, zvekDaysOptions]
  );

  const dataLastEventByDays = useMemo(
    () => prepareChartData((entry) => entry?.info?.[entry.info.length - 1]?.damageByDay || [], 'Day', 6, true),
    [prepareChartData]
  ) as any;

  const maxValuesByDayForSecondGraph = useMemo(() => {
    if (!dataLastEventByDays) return [];
    return dataLastEventByDays.labels.map((_: any, idx: number) =>
      Math.max(...dataLastEventByDays.datasets.map((dataset: any) => dataset.data[idx] || 0))
    );
  }, [dataLastEventByDays]);

  return (
    <Wrapper>
      <BackBtn to='/main' />
      <Charts>
        <div>
          <Bar
            options={getOptions(COMPARE_ZVEK, dataLastThreeEvents?.datasets[0]?.maxValues)}
            data={dataLastThreeEvents}
          />
        </div>
        <div>
          <Bar options={getOptions(COMPARE_DAYS, maxValuesByDayForSecondGraph)} data={dataLastEventByDays} />
        </div>
      </Charts>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  padding: 1rem 1rem 1.5rem;
`;

const Charts = styled.div`
  display: grid;
  grid-template-columns: calc(50% - 0.5rem) calc(50% - 0.5rem);
  grid-column-gap: 1rem;

  @media ${({theme}) => theme.breakpoints.maxLtg} {
    grid-template-columns: 100%;
    grid-template-rows: inherit;
  }
`;

export default CompareView;
