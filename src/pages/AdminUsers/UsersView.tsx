import React, {useState, useCallback, useEffect} from 'react';
import styled from 'styled-components';
import ReactGA from 'react-ga4';
import {useLocation} from 'react-router';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import BaseLoader from 'components/GeneralComponents/BaseLoader';
import {
  getUsersDetails,
  createUser,
  updateUser,
  UsersDetails,
  CreateUserPayload,
  UserSortField,
  SortOrder,
} from 'api/users';
import UserForm from './components/UserForm';
import Edit from 'assets/icons/edit.svg';
import {font_header_5_bold} from 'theme/fonts';
import {getFormattedDate, getImageComponent, globalLocalization, heroImages, qualityImages} from 'services/GlobalUtils';
import {useAppSelector} from 'services/hooks';
import {selectUserConfiguration} from 'store/userSlice';
import {localization} from 'pages/AdminUsers/UsersUtils';
import Arrow from 'assets/icons/arrow.svg';
import Gey from 'assets/images/gey.png';
import {ViewMode} from 'services/GlobalStyles';

interface SortState {
  field: UserSortField;
  order: SortOrder;
}

const HEADER_SORT_MAP: Record<number, UserSortField> = {
  0: UserSortField.NAME,
  1: UserSortField.DAMAGE_DEALER,
  2: UserSortField.QUALITY,
  3: UserSortField.STARS,
  4: UserSortField.TEMPLE,
  5: UserSortField.CREATED_AT,
  6: UserSortField.UPDATED_AT,
  7: UserSortField.IS_ACTIVE,
};

const UsersView = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const {language} = useAppSelector(selectUserConfiguration);

  const {ACTIVE, INACTIVE, MEMBERS} = localization(language);
  const {NICKNAME, TEMPLE, QUALITY, ADD, EDIT, HERO, CREATE, UPDATE, STATUS} = globalLocalization(language);

  const [mode, setMode] = useState<ViewMode>(ViewMode.LIST);
  const [editingUser, setEditingUser] = useState<UsersDetails | null>(null);
  const [sortState, setSortState] = useState<SortState>({
    field: UserSortField.UPDATED_AT,
    order: SortOrder.DESC,
  });

  const {data: users = [], isLoading} = useQuery({
    queryKey: ['admin-users', sortState?.field, sortState?.order],
    queryFn: () =>
      getUsersDetails({
        sortBy: sortState?.field,
        sortOrder: sortState?.order,
      }),
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

  useEffect(() => {
    ReactGA.send({hitType: 'user-damage', page: location.pathname});
  }, [location.pathname]);

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

  const handleSort = useCallback((i: number) => {
    const targetField = HEADER_SORT_MAP[i];
    if (!targetField) return;

    setSortState((prev) => {
      if (prev?.field === targetField) {
        return prev.order === SortOrder.DESC
          ? {field: targetField, order: SortOrder.ASC}
          : {field: targetField, order: SortOrder.DESC};
      }
      return {field: targetField, order: SortOrder.DESC};
    });
  }, []);

  const isFormLoading = createMutation.isPending || updateMutation.isPending;

  const tableHeaders = [NICKNAME, HERO, QUALITY, <img src={Gey} alt="gey" />, TEMPLE, CREATE, UPDATE, STATUS, ''];

  return (
    <Wrapper>
      {mode === ViewMode.LIST ? (
        <Card>
          <HeaderRow>
            <Title>
              {MEMBERS} ({users.filter(({isActive}) => isActive).length}/{users.length})
            </Title>
            <Button variant="contained" color="primary" onClick={handleOpenAddForm}>
              {ADD}
            </Button>
          </HeaderRow>

          {isLoading ? (
            <BaseLoader />
          ) : (
            <Table>
              <THead>
                <TableRow>
                  {tableHeaders.map((header, id) => {
                    const sortField = HEADER_SORT_MAP[id];

                    return (
                      <TableCell key={id} align={id === tableHeaders.length - 1 ? 'right' : 'left'}>
                        <HCell isSortable={Boolean(sortField)} onClick={() => sortField && handleSort(id)}>
                          <b>{header}</b>
                          {sortState?.field === sortField && (
                            <SortIcon isAsc={sortState?.order === SortOrder.ASC}>
                              <Arrow />
                            </SortIcon>
                          )}
                        </HCell>
                      </TableCell>
                    );
                  })}
                </TableRow>
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
                    <IconButton color="primary" onClick={() => handleOpenEditForm(user)} title={EDIT}>
                      <Edit />
                    </IconButton>,
                  ].map((item, id, arr) => (
                    <TableCell key={id} align={id === arr.length - 1 ? 'right' : 'left'}>
                      {item}
                    </TableCell>
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
  overflow: auto;
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

const HCell = styled.div<{isSortable?: boolean}>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  cursor: ${({isSortable}) => (isSortable ? 'pointer' : 'default')};
  user-select: none;
`;

const SortIcon = styled(SvgIcon)<{isAsc?: boolean}>`
  &.MuiSvgIcon-root {
    font-size: 1.2rem;
    fill: ${({theme}) => theme.colors.gray090};
    transform: rotate(${({isAsc}) => (isAsc ? 0 : '-180')}deg);
    transition: transform 0.2s ease;
  }
`;

const Title = styled.div`
  ${font_header_5_bold};
  color: ${({theme}) => theme.colors.gray090};
`;

export default UsersView;
