import React, {useState} from 'react';
import styled from 'styled-components';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import BaseLoader from 'components/GeneralComponents/BaseLoader';
import {
  getGuildStatistic,
  createGuildStatistic,
  updateGuildStatistic,
  deleteGuildStatistic,
  StatisticItem,
  CreateStatisticPayload,
} from 'api/statistic';
import StatisticForm from './components/StatisticForm';
import Edit from 'assets/icons/edit.svg';
import Delete from 'assets/icons/delete.svg';
import {font_header_5_bold} from 'theme/fonts';
import {getFormattedDate, globalLocalization} from 'services/GlobalUtils';
import {ViewMode} from 'services/GlobalStyles';
import {useAppSelector} from 'services/hooks';
import {selectUserConfiguration} from 'store/userSlice';
import {localization} from './ZvekUtils';

const ZvekView = () => {
  const queryClient = useQueryClient();
  const {language} = useAppSelector(selectUserConfiguration);

  const [mode, setMode] = useState<ViewMode>(ViewMode.LIST);
  const [editingRecord, setEditingRecord] = useState<StatisticItem | null>(null);

  const {STAT, SURE} = localization(language);
  const {DATA, TOTAL, RATE, NEW, CREATE, ADD, EDIT, UPDATE, DELETE} = globalLocalization(language);

  const {data: stats = [], isLoading} = useQuery({
    queryKey: ['guild-statistic', 'date'],
    queryFn: () => getGuildStatistic({sortBy: 'date'}),
  });

  const createMutation = useMutation({
    mutationFn: createGuildStatistic,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['guild-statistic']});
      handleBackToList();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateGuildStatistic,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['guild-statistic']});
      handleBackToList();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGuildStatistic,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['guild-statistic']});
    },
  });

  const handleOpenAddForm = () => {
    setEditingRecord(null);
    setMode(ViewMode.FORM);
  };

  const handleOpenEditForm = (record: StatisticItem) => {
    setEditingRecord(record);
    setMode(ViewMode.FORM);
  };

  const handleBackToList = () => {
    setMode(ViewMode.LIST);
    setEditingRecord(null);
  };

  const handleFormSubmit = (payload: CreateStatisticPayload) =>
    editingRecord ? updateMutation.mutate({id: editingRecord.id, ...payload}) : createMutation.mutate(payload);

  const tableHeaders = [DATA, TOTAL, RATE, NEW, CREATE, UPDATE, ''];

  return (
    <Wrapper>
      {mode === ViewMode.LIST ? (
        <Card>
          <HeaderRow>
            <Title>
              {STAT} ({stats.length})
            </Title>
            <Button variant="contained" color="primary" onClick={handleOpenAddForm}>
              {ADD}
            </Button>
          </HeaderRow>

          {isLoading ? (
            <BaseLoader />
          ) : (
            <Table>
              <TableHead>
                {tableHeaders.map((header, id) => (
                  <TableCell key={id} align={id === tableHeaders.length - 1 ? 'right' : 'left'}>
                    <b>{header}</b>
                  </TableCell>
                ))}
              </TableHead>
              {stats.map((record) => (
                <TableRow key={record.id} hover>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>
                    {record.total !== undefined && record.total !== null ? Number(record.total).toLocaleString() : '0'}
                  </TableCell>
                  <TableCell>{record.rate}</TableCell>
                  <TableCell>{record.newbies}</TableCell>
                  <TableCell>{getFormattedDate(record.createdAt)}</TableCell>
                  <TableCell>{getFormattedDate(record.updatedAt)}</TableCell>
                  <TableCell align="right">
                    <ActionsCell>
                      <EditIcon color="primary" onClick={() => handleOpenEditForm(record)} title={EDIT}>
                        <Edit />
                      </EditIcon>
                      <DeleteIcon
                        onClick={() => window.confirm(SURE) && deleteMutation.mutate(record.id)}
                        disabled={deleteMutation.isPending}
                        title={DELETE}
                      >
                        <Delete />
                      </DeleteIcon>
                    </ActionsCell>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          )}
        </Card>
      ) : (
        <StatisticForm
          initialValues={editingRecord}
          isLoading={createMutation.isPending || updateMutation.isPending}
          onSubmit={handleFormSubmit}
          onCancel={handleBackToList}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Card = styled.div`
  height: 100vh;
  background: ${({theme}) => theme.colors.gray000};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  overflow: auto;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const Title = styled.div`
  ${font_header_5_bold};
  color: ${({theme}) => theme.colors.gray090};
`;

const ActionsCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.25rem;
`;

const DeleteIcon = styled(IconButton)`
  &.MuiButtonBase-root {
    fill: ${({theme}) => theme.colors.red100};
  }
`;

const EditIcon = styled(IconButton)`
  &.MuiButtonBase-root {
    fill: ${({theme}) => theme.colors.blue100};
  }
`;

export default ZvekView;
