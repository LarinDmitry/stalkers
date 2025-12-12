import React, {ElementType} from 'react';
import styled from 'styled-components';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useAppSelector} from 'services/hooks';
import {selectUserConfiguration} from 'store/userSlice';
import {localization} from '../StatisticUtils';
import {globalLocalization} from 'services/GlobalUtils';
import {useGuildData} from 'services/GlobalUtils';
import {boldWeight} from 'theme/fonts';
import {selectDataConfiguration} from 'store/dataSlice';

const DamageGrow = () => {
  const {language} = useAppSelector(selectUserConfiguration);
  const {guildStatistic} = useAppSelector(selectDataConfiguration);
  const {DATE, DAMAGE_GUILD, CHANGES} = localization(language);
  const {NO_DATA, GUILD_RATING, NEWBIES} = globalLocalization(language);
  const headerValues = [DATE, DAMAGE_GUILD, CHANGES, GUILD_RATING, NEWBIES];

  return (
    <Container component={Paper}>
      <Table>
        <TableHead>
          <Row>
            {headerValues.map((value) => (
              <HCell key={value}>{value}</HCell>
            ))}
          </Row>
        </TableHead>
        <TableBody>
          {useGuildData().map(({total, percentageChange, date}, idx) => {
            const changeText =
              idx > 0
                ? percentageChange === null
                  ? NO_DATA
                  : `${percentageChange > 0 ? '>' : '<'} ${Math.abs(percentageChange).toFixed(2)}%`
                : '—';

            return (
              <Row key={`guild-${idx}`}>
                <TableCell align="center">{date}</TableCell>
                <TableCell align="center">{(total / 1e12).toFixed(2)}</TableCell>
                <TableCell align="center">
                  <ChangeText value={percentageChange}>{changeText}</ChangeText>
                </TableCell>
                <TableCell align="center">
                  <ChangeText value={guildStatistic[idx - 1]?.rate - guildStatistic[idx].rate}>
                    {guildStatistic[idx].rate}
                  </ChangeText>
                </TableCell>
                <TableCell align="center">
                  <NewbiesText value={guildStatistic[idx].newbies}>{guildStatistic[idx].newbies}</NewbiesText>
                </TableCell>
              </Row>
            );
          })}
        </TableBody>
      </Table>
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
    grid-template-columns: repeat(5, 1fr);
  }
`;

const HCell = styled(TableCell)`
  &.MuiTableCell-root {
    ${boldWeight};
    text-align: center;
  }
`;

const ChangeText = styled.span<{value: number | null}>`
  color: ${({
    value,
    theme: {
      colors: {red100, green100, gray100},
    },
  }) => {
    if (value === null || value === 0) return gray100;
    if (value > 0) return green100;
    if (value < 0) return red100;
    return gray100;
  }};
`;

const NewbiesText = styled.span<{value: number}>`
  color: ${({
    value,
    theme: {
      colors: {green100, gray100},
    },
  }) => (value === 0 ? gray100 : green100)};
`;

export default DamageGrow;
