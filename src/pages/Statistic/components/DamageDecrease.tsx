import React, {useMemo, ElementType} from 'react';
import styled from 'styled-components';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {PlugCellStyles} from 'services/GlobalStyled';
import {useAppSelector} from 'services/hooks';
import {selectUserConfiguration} from 'store/userSlice';
import {globalLocalization} from 'services/GlobalUtils';
import {localization} from '../StatisticUtils';
import {boldWeight} from 'theme/fonts';
import {selectDataConfiguration} from 'store/dataSlice';

interface PlayerData {
  name: string;
  damageLastZvek: number;
  damagePreviousZvek: number;
  percentageChange: number | null;
}

const DamageDecrease = () => {
  const {language} = useAppSelector(selectUserConfiguration);
  const {latestZveks} = useAppSelector(selectDataConfiguration);
  const {LAST_ZVEK, DECREASE} = localization(language);
  const {NICKNAME, LATEST_ZVEK} = globalLocalization(language);

  const playerData: PlayerData[] = useMemo(
    () =>
      latestZveks.reduce<PlayerData[]>((acc, {name, info}) => {
        const [previousZvek, lastZvek] = info.slice(-2);
        const percentageChange = ((lastZvek.damage - previousZvek.damage) / previousZvek.damage) * 100;

        percentageChange < 0 &&
          acc.push({
            name,
            damageLastZvek: lastZvek.damage,
            damagePreviousZvek: previousZvek.damage,
            percentageChange,
          });

        return acc;
      }, []),
    []
  );

  const headerValues = useMemo(
    () => [NICKNAME, LAST_ZVEK, LATEST_ZVEK, DECREASE],
    [NICKNAME, LAST_ZVEK, LATEST_ZVEK, DECREASE]
  );

  return (
    <Container component={Paper}>
      {!playerData.length ? (
        <Plug>У всех игроков урон вырос</Plug>
      ) : (
        <Table>
          <TableHead>
            <Row>
              {headerValues.map((value) => (
                <HCell align="center" key={value}>
                  {value}
                </HCell>
              ))}
            </Row>
          </TableHead>
          <TableBody>
            {playerData.map(({name, damagePreviousZvek, damageLastZvek, percentageChange}) => {
              const changeText = `< на ${Math.abs(percentageChange!).toFixed(2)}%`;

              return (
                <Row key={name}>
                  <TableCell align="center">{name}</TableCell>
                  <TableCell align="center">{(damagePreviousZvek / 1e9).toFixed(2)}</TableCell>
                  <TableCell align="center">{(damageLastZvek / 1e9).toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <ChangeText percentage={percentageChange}>{changeText}</ChangeText>
                  </TableCell>
                </Row>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

const Container = styled(TableContainer)<{component: ElementType}>`
  &.MuiPaper-root {
    margin: 0 1rem;
    width: calc(100% - 2rem);
  }
`;

const Row = styled(TableRow)`
  &.MuiTableRow-root {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
`;

const HCell = styled(TableCell)`
  &.MuiTableCell-root {
    ${boldWeight};
    text-align: center;
  }
`;

const ChangeText = styled.span<{percentage: number | null}>`
  color: ${({
    percentage,
    theme: {
      colors: {red100, green100, gray100},
    },
  }) => {
    if (percentage === null || percentage === 0) return gray100;
    return percentage > 0 ? green100 : red100;
    return gray100;
  }};
`;

const Plug = styled.div`
  ${PlugCellStyles};
  color: ${({theme}) => theme.colors.green100};
  text-align: center;
`;

export default DamageDecrease;
