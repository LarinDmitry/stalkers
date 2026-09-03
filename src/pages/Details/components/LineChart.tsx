import React, {FC, useMemo, useState} from 'react';
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
  Legend,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import SvgIcon from '@mui/material/SvgIcon';
import {useAppSelector} from 'services/hooks';
import {selectUserConfiguration} from 'store/userSlice';
import {localization} from '../DetailsUtils';
import {globalLocalization} from 'services/GlobalUtils';
import Average from 'assets/icons/average.svg';
import {font_body_4_reg} from 'theme/fonts';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

interface Props {
  data: {damage: number; date: string; guildTotal?: number}[];
  title: string;
  averageTitle: string;
  average: number;
  stepped: boolean;
  withCheckbox: boolean;
}

const LineChart: FC<Props> = ({data, title, averageTitle, average, stepped, withCheckbox}) => {
  const [isAverage, setIsAverage] = useState<boolean>(false);
  const {language} = useAppSelector(selectUserConfiguration);

  const {DAMAGE_ZVEK} = localization(language);
  const {DAMAGE, BILLION} = globalLocalization(language);

  const chartData = useMemo(
    () => ({
      labels: data?.map((item) => item.date) || [],
      datasets: [
        {
          label: DAMAGE_ZVEK,
          data: data?.map((item) => item.damage / 1e9) || [],
          borderColor: 'rgb(72, 99, 235)',
          backgroundColor: 'rgb(68, 217, 38)',
          fill: false,
          stepped,
          tension: 0.4,
        },
      ],
    }),
    [data, stepped, DAMAGE_ZVEK]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        datalabels: {
          display: false,
        },
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: title,
        },
        annotation: {
          annotations:
            isAverage && average
              ? {
                  line1: {
                    type: 'line',
                    yMin: average / 1e9,
                    yMax: average / 1e9,
                    borderColor: 'rgb(235, 72, 99)',
                    borderDash: [10],
                    borderWidth: 2,
                  },
                }
              : {},
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: DAMAGE,
          },
        },
      },
    }),
    [title, isAverage, average, DAMAGE]
  ) as any;

  return (
    <Wrapper>
      {withCheckbox && (
        <CheckboxContainer>
          <Icon isaverage={+isAverage} onClick={() => setIsAverage((prev) => !prev)}>
            <Average />
          </Icon>
        </CheckboxContainer>
      )}
      <Line data={chartData} options={options} />
      <SubInfo>
        {averageTitle}{' '}
        <b>
          {((average || 0) / 1e9).toFixed(2)} {BILLION}
        </b>
      </SubInfo>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 1rem;
  top: 0.5rem;
`;

const Icon = styled(SvgIcon)<{isaverage: number}>`
  &.MuiSvgIcon-root {
    cursor: pointer;
    fill: ${({
      isaverage,
      theme: {
        colors: {blue100, gray090},
      },
    }) => (isaverage ? blue100 : gray090)};
  }
`;

const SubInfo = styled.div`
  ${font_body_4_reg};
  padding-top: 0.5rem;
  text-align: center;
`;

export default LineChart;
