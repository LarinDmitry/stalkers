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
import {useAppSelector} from 'services/hooks';
import {selectUserConfiguration} from 'store/userSlice';
import {calculateTopPlayersData} from 'services/GlobalUtils';
import {localization} from '../DashboardUtils';
import {BlockStyles} from 'pages/Dashboard/DashboardStyled';
import ArrowLink from 'assets/icons/arrow_link.svg';
import {font_body_1_bold} from 'theme/fonts';
import {selectDataConfiguration} from 'store/dataSlice';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const Tops = () => {
  const navigate = useNavigate();
  const {language} = useAppSelector(selectUserConfiguration);
  const {latestZveks} = useAppSelector(selectDataConfiguration);

  const {NAME, TOTAL, DAMAGE, IMPACT, TOP_PLAYERS, OTHERS} = localization(language);

  const tableData = useMemo(
    () =>
      latestZveks.map(({name, info}) => ({
        name,
        damage: info[info.length - 1].damage,
        guildTotal: info[info.length - 1].guildTotal,
      })),
    []
  );

  const total = calculateTopPlayersData(5)[2].guildTotal;
  const top5Percentage = calculateTopPlayersData(5)[2].topDamagePercentage;

  const data = {
    labels: [TOP_PLAYERS, OTHERS],
    datasets: [
      {
        data: [top5Percentage * total, (100 - top5Percentage) * total],
        backgroundColor: ['rgba(72, 99, 235, 0.7)', 'rgba(68, 217, 38, 0.7)'],
        hoverOffset: 4,
      },
    ],
  };

  const headerValues = [NAME, DAMAGE, IMPACT, ''];

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
          {TOTAL}: {(calculateTopPlayersData(5)[2].guildTotal / 1e12).toFixed(2)} T
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
            {calculateTopPlayersData(5)[2].topPlayers.map((name, idx) => {
              const player = tableData.find((p) => p.name === name) || {damage: 0, guildTotal: 1};
              const arrValues = [
                name,
                (player.damage / 1e12).toFixed(2),
                `${((player.damage / player.guildTotal) * 100).toFixed(2)}%`,
                <ArrowLink />,
              ];

              return (
                <Row key={idx} onClick={() => navigate(`/details/${name}`)}>
                  {arrValues.map((item, idx) => (
                    <TableCell key={idx} align="center">
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
