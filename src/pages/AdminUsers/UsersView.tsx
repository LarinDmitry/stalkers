import React, {useState} from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import BaseLoader from 'components/GeneralComponents/BaseLoader';
import {getUsersDetails, createUser, updateUser, UsersDetails, CreateUserPayload} from 'api/users';
import UserForm from './components/UserForm';
import Edit from 'assets/icons/edit.svg';
import {font_header_5_bold} from 'theme/fonts';
import {getFormattedDate, getImageComponent, globalLocalization, heroImages, qualityImages} from 'services/GlobalUtils';
import {useAppSelector} from 'services/hooks';
import {selectUserConfiguration} from 'store/userSlice';
import Gey from 'assets/images/gey.png';
import {localization} from 'pages/AdminUsers/UsersUtils';

enum ViewMode {
  LIST = 'list',
  FORM = 'form',
}

const UsersView = () => {
  const queryClient = useQueryClient();
  const {language} = useAppSelector(selectUserConfiguration);
  const {ACTIVE, INACTIVE, ADD_USER, MEMBERS, EDIT_USER} = localization(language);
  const {NICKNAME, TEMPLE, QUALITY, HERO, CREATE, UPDATE, STATUS} = globalLocalization(language);

  const [mode, setMode] = useState<ViewMode>(ViewMode.LIST);
  const [editingUser, setEditingUser] = useState<UsersDetails | null>(null);

  const {data: users = [], isLoading} = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => getUsersDetails(),
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['admin-users']});
      handleBackToList();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['admin-users']});
      handleBackToList();
    },
  });

  const handleOpenAddForm = () => {
    setEditingUser(null);
    setMode(ViewMode.FORM);
  };

  const handleOpenEditForm = (user: UsersDetails) => {
    setEditingUser(user);
    setMode(ViewMode.FORM);
  };

  const handleBackToList = () => {
    setMode(ViewMode.LIST);
    setEditingUser(null);
  };

  const handleFormSubmit = (formData: CreateUserPayload) =>
    editingUser ? updateMutation.mutate({id: editingUser.id, ...formData}) : createMutation.mutate(formData);

  const isFormLoading = createMutation.isPending || updateMutation.isPending;

  const tableHeaders = [NICKNAME, HERO, QUALITY, <img src={Gey} alt="gey" />, TEMPLE, CREATE, UPDATE, STATUS, ''];

  return (
    <Wrapper>
      {mode === ViewMode.LIST ? (
        <Card>
          <HeaderRow>
            <Title>
              {MEMBERS} ({users.filter((item) => item.isActive).length}/{users.length})
            </Title>
            <Button variant="contained" color="primary" onClick={handleOpenAddForm}>
              {ADD_USER}
            </Button>
          </HeaderRow>

          {isLoading ? (
            <BaseLoader />
          ) : (
            <Table>
              <THead>
                {tableHeaders.map((header, id) => (
                  <TableCell align={id === tableHeaders.length - 1 ? 'right' : 'left'}>
                    <b>{header}</b>
                  </TableCell>
                ))}
              </THead>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  {[
                    user.name,
                    getImageComponent(user.damageDealer || '', heroImages, ''),
                    getImageComponent(user.quality || '', qualityImages),
                    user.stars,
                    user.temple,
                    getFormattedDate(user.createdAt),
                    getFormattedDate(user.updatedAt),
                    <Chip
                      label={user.isActive ? ACTIVE : INACTIVE}
                      color={user.isActive ? 'success' : 'default'}
                      size="medium"
                    />,
                    <IconButton color="primary" onClick={() => handleOpenEditForm(user)} title={EDIT_USER}>
                      <Edit />
                    </IconButton>,
                  ].map((item, id, arr) => (
                    <TableCell align={id === arr.length - 1 ? 'right' : 'left'}>{item}</TableCell>
                  ))}
                </TableRow>
              ))}
            </Table>
          )}
        </Card>
      ) : (
        <UserForm
          initialValues={editingUser}
          isLoading={isFormLoading}
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
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const THead = styled(TableHead)`
  img {
    height: 1.6rem;
  }
`;

const Title = styled.div`
  ${font_header_5_bold};
  color: ${({theme}) => theme.colors.gray090};
`;

export default UsersView;
