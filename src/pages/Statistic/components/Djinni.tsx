import React, {useMemo, ElementType} from 'react';
import styled from 'styled-components';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import BaseLoader from 'components/GeneralComponents/BaseLoader';
import {useAppSelector} from 'services/hooks';
import {selectUserConfiguration} from 'store/userSlice';
import {calculateGini} from '../StatisticUtils';
import {localization} from '../StatisticUtils';
import {boldWeight} from 'theme/fonts';
import {useQuery} from '@tanstack/react-query';
import {getAllUsersDamage} from 'api/user-damage';

const Djinni = () => {
  const {language} = useAppSelector(selectUserConfiguration);
  const {data: latestZveks = [], isPending} = useQuery({
    queryKey: ['allUsersDamage'],
    queryFn: getAllUsersDamage,
  });

  const uniqueDates = useMemo(
    () =>
      Array.from(new Set(latestZveks.flatMap(({info}) => info.map(({date}) => date)))).filter(
        (date) => date !== 'xx.xx'
      ),
    []
  );

  const giniValues = useMemo(
    () =>
      uniqueDates.map((date) => ({
        date,
        gini: calculateGini(latestZveks.map(({info}) => info.find((i) => i.date === date)?.damage || 0)),
      })),
    [uniqueDates]
  );

  const {DATE, JINNI} = localization(language);
  const headerValues = [DATE, JINNI];

  if (isPending) return <BaseLoader />;

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
          {giniValues.map(({date, gini}) => (
            <Row key={date}>
              <TableCell align="center">{date}</TableCell>
              <TableCell align="center">{gini.toFixed(4)}</TableCell>
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
    grid-template-columns: repeat(2, 1fr);
  }
`;

const HCell = styled(TableCell)`
  &.MuiTableCell-root {
    ${boldWeight};
    text-align: center;
  }
`;

export default Djinni;
