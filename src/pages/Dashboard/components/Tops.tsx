import React, {useMemo} from 'react';
import styled from 'styled-components';
import {useNavigate} from 'react-router';
import {Chart as ChartJS, ArcElement, Tooltip, Legend, Title} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import SvgIcon from '@mui/material/SvgIcon';
import BaseLoader from 'components/GeneralComponents/BaseLoader';
import {useAppSelector} from 'services/hooks';
import {selectUserConfiguration} from 'store/userSlice';
import {globalLocalization, useTopPlayersData} from 'services/GlobalUtils';
import {localization} from '../DashboardUtils';
import {BlockStyles} from 'pages/Dashboard/DashboardStyled';
import ArrowLink from 'assets/icons/arrow_link.svg';
import {font_body_1_bold} from 'theme/fonts';
import {useQuery} from '@tanstack/react-query';
import {getAllUsersDamage} from 'api/user-damage';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const Tops = () => {
  const navigate = useNavigate();
  const {language} = useAppSelector(selectUserConfiguration);
  const {data: latestZveks = [], isPending} = useQuery({
    queryKey: ['allUsersDamage'],
    queryFn: getAllUsersDamage,
  });

  const topDataList = useTopPlayersData(5);

  const {DAMAGE, IMPACT, TOP_PLAYERS, OTHERS} = localization(language);
  const {NICKNAME, TOTAL} = globalLocalization(language);

  const tableData = useMemo(
    () =>
      latestZveks.map(({name, info}) => {
        const lastRecord = info[info.length - 1];
        return {
          name,
          damage: lastRecord?.damage ?? 0,
          guildTotal: Number(lastRecord?.guildTotal) || 1,
        };
      }),
    [latestZveks]
  );

  const currentTopData = topDataList[topDataList.length - 1] ?? {
    guildTotal: 0,
    topDamagePercentage: 0,
    topPlayers: [],
  };

  const {guildTotal: total, topDamagePercentage: top5Percentage, topPlayers} = currentTopData;

  const data = useMemo(
    () => ({
      labels: [TOP_PLAYERS, OTHERS],
      datasets: [
        {
          data: [(top5Percentage / 100) * total, (1 - top5Percentage / 100) * total],
          backgroundColor: ['rgba(72, 99, 235, 0.7)', 'rgba(68, 217, 38, 0.7)'],
          hoverOffset: 4,
        },
      ],
    }),
    [TOP_PLAYERS, OTHERS, top5Percentage, total]
  );

  const headerValues = [NICKNAME, DAMAGE, IMPACT, ''];

  if (isPending) return <BaseLoader />;

  return (
    <Wrapper>
      <ChartBlock>
        <DoughnutWrapper>
          <Doughnut
            data={data}
            options={{
              responsive: true,
              plugins: {
                datalabels: {display: false},
              },
            }}
          />
        </DoughnutWrapper>
        <Text>
          {TOTAL}: {(total / 1e12).toFixed(2)} T
        </Text>
        <Icon onClick={() => navigate('/main')}>
          <ArrowLink />
        </Icon>
      </ChartBlock>

      <TopsTable>
        <Table>
          <TableRow>
            {headerValues.map((value) => (
              <TableCell align="center" key={value}>
                <b>{value}</b>
              </TableCell>
            ))}
          </TableRow>
          <TableBody>
            {topPlayers.map((name, idx) => {
              const player = tableData.find((p) => p.name === name) || {damage: 0, guildTotal: 1};
              const arrValues = [
                name,
                (player.damage / 1e12).toFixed(2),
                `${((player.damage / player.guildTotal) * 100).toFixed(2)}%`,
                <ArrowLink />,
              ];

              return (
                <Row key={idx} onClick={() => navigate(`/details/${name}`)}>
                  {arrValues.map((item, cellIdx) => (
                    <TableCell key={cellIdx} align="center">
                      {item}
                    </TableCell>
                  ))}
                </Row>
              );
            })}
          </TableBody>
        </Table>
      </TopsTable>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: calc(35% - 0.5rem) calc(65% - 0.5rem);

  @media ${({theme}) => theme.breakpoints.maxTb} {
    grid-template-columns: 1fr;
    grid-row-gap: 1rem;
  }
`;

const ChartBlock = styled.div`
  ${BlockStyles};
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TopsTable = styled.div`
  ${BlockStyles};
  height: 100%;
  display: flex;
`;

const DoughnutWrapper = styled.div`
  width: 300px;
  display: flex;
  justify-content: center;
`;

const Text = styled.div`
  ${font_body_1_bold};
  margin-top: 0.5rem;
  text-align: center;
`;

const Icon = styled(SvgIcon)`
  &.MuiSvgIcon-root {
    cursor: pointer;
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
`;

const Row = styled(TableRow)`
  &.MuiTableRow-root {
    position: relative;
    cursor: pointer;

    &:hover {
      background-color: rgba(83, 158, 236, 0.6);
    }
  }
`;

export default Tops;
