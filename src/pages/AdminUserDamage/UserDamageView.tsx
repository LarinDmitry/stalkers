import React, {useState} from 'react';
import styled from 'styled-components';
import {useLocation} from 'react-router';
import {getUsersDetails, UsersDetails} from 'api/users';
import {getAllUsersDamage, updateUserDamage, UserDamageItem} from 'api/user-damage';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import Button from '@mui/material/Button';
import BaseLoader from 'components/GeneralComponents/BaseLoader';
import BackBtn from 'components/GeneralComponents/BackBtn';
import {font_header_5_bold} from 'theme/fonts';
import {useAppSelector} from 'services/hooks';
import {selectUserConfiguration} from 'store/userSlice';
import {globalLocalization} from 'services/GlobalUtils';
import DamageModal from './components/DamageModal';
import Check from 'assets/icons/check.svg';
import Info from 'assets/icons/info.svg';

interface LocationState {
  date?: string;
}

const UserDamageView = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const {language} = useAppSelector(selectUserConfiguration);
  const {ADD, EDIT, SE_DAMAGE} = globalLocalization(language);

  const targetDate = (location.state as LocationState)?.date || '';

  const [selectedUser, setSelectedUser] = useState<{user: UsersDetails; index: number} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const {data: users = [], isLoading: isUsersLoading} = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => getUsersDetails({isActive: true}),
  });

  const {data: usersDamage = [], isLoading: isDamageLoading} = useQuery<UserDamageItem[]>({
    queryKey: ['all-users-damage'],
    queryFn: getAllUsersDamage,
  });

  const upsertMutation = useMutation({
    mutationFn: updateUserDamage,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['all-users-damage']});
      handleCloseModal();
    },
  });

  const handleOpenModal = (user: UsersDetails, index: number) => {
    setSelectedUser({user, index});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveDamage = (damageByDay: number[]) => {
    if (!selectedUser || !targetDate) return;

    upsertMutation.mutate({
      userId: Number(selectedUser.user.id),
      date: targetDate,
      damageByDay,
    });
  };

  const getInitialDamageByDay = (): number[] | undefined => {
    if (!selectedUser) return undefined;
    const userDamageData = usersDamage.find(({name}) => name === selectedUser.user.name);
    return userDamageData?.info.find(({date}) => date === targetDate)?.damageByDay;
  };

  return (
    <Wrapper>
      <BackBtn to="/admin/zvek" />
      <Title>
        {SE_DAMAGE} {targetDate}
      </Title>

      {isUsersLoading || isDamageLoading ? (
        <BaseLoader />
      ) : (
        <CardsGrid>
          {users.map((user, i) => {
            const userDamageData = usersDamage.find(({name}) => name === user.name);
            const dateRecord = userDamageData?.info.find(({date}) => date === targetDate);

            const hasDamage = Boolean(dateRecord && dateRecord.damageByDay && dateRecord.damageByDay.length > 0);
            const totalDamage = dateRecord?.damageByDay
              ? dateRecord.damageByDay.reduce((acc, curr) => acc + Number(curr), 0)
              : 0;

            return (
              <Card key={user.id}>
                <Header>
                  <Id>{String(i + 1).padStart(2, '0')}</Id>
                  <StatusIcon iscomplete={hasDamage}>{hasDamage ? <Check /> : <Info />}</StatusIcon>
                </Header>

                <Name>{user.name}</Name>
                <Damage>{totalDamage.toLocaleString()}</Damage>

                <ActionButton variant="contained" onClick={() => handleOpenModal(user, i)}>
                  {hasDamage ? EDIT : ADD}
                </ActionButton>
              </Card>
            );
          })}
        </CardsGrid>
      )}

      {selectedUser && (
        <DamageModal
          open={isModalOpen}
          userName={selectedUser.user.name}
          initialValues={getInitialDamageByDay()}
          isLoading={upsertMutation.isPending}
          onClose={handleCloseModal}
          onSubmit={handleSaveDamage}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
`;

const Title = styled.div`
  ${font_header_5_bold};
  color: ${({theme}) => theme.colors.gray090};
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
`;

const Card = styled.div`
  background: ${({theme}) => theme.colors.gray000};
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  border: 1px solid ${({theme}) => theme.colors.gray080};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const Id = styled.span`
  font-size: 0.85rem;
  font-weight: bold;
`;

const StatusIcon = styled.div<{iscomplete: boolean}>`
  display: flex;
  height: 1.25rem;
  width: 1.25rem;
  align-items: center;
  fill: ${({
    iscomplete,
    theme: {
      colors: {green100, orange100},
    },
  }) => (iscomplete ? green100 : orange100)};
`;

const Name = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Damage = styled.div`
  font-size: 1.15rem;
  font-weight: bold;
  color: ${({theme}) => theme.colors.gray090};
  margin: 0.75rem 0;
`;

const ActionButton = styled(Button)`
  &.MuiButtonBase-root {
    text-transform: none;
    background-color: ${({theme}) => theme.colors.blue100};
    color: ${({theme}) => theme.colors.gray000};
    box-shadow: none;

    &:hover {
      background-color: ${({theme}) => theme.colors.blue090};
      box-shadow: none;
    }
  }
`;

export default UserDamageView;
