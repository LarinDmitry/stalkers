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
import {useTopPlayersData} from 'services/GlobalUtils';

const TopPlayers = () => {
  const {language} = useAppSelector(selectUserConfiguration);
  const {DATE, TOP, PERCENT} = localization(language);

  const headerValues = [DATE, TOP, PERCENT];

  return (
    <Container component={Paper}>
      <Table>
        <TableHead>
          <Row>
            {headerValues.map((value) => (
              <TableCell align="center" key={value}>
                <b>{value}</b>
              </TableCell>
            ))}
          </Row>
        </TableHead>
        <TableBody>
          {useTopPlayersData(3).map(({date, topPlayers, topDamagePercentage}, idx) => (
            <Row key={idx}>
              <TableCell align="center">{date}</TableCell>
              <TableCell align="center">{topPlayers.join(', ')}</TableCell>
              <TableCell align="center">{topDamagePercentage.toFixed(2)}%</TableCell>
            </Row>
          ))}
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
    grid-template-columns: repeat(3, 1fr);
  }
`;

export default TopPlayers;
