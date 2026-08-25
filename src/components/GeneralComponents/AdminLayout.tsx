import React, {FC} from 'react';
import {Navigate, Outlet} from 'react-router';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import {checkAuth, globalLocalization, logoutAdmin} from 'services/GlobalUtils';
import {font_header_6_bold} from 'theme/fonts';
import {useAppSelector} from 'services/hooks';
import {selectUserConfiguration} from 'store/userSlice';

const AdminLayout: FC = () => {
  const isAuth = checkAuth();
  const {language} = useAppSelector(selectUserConfiguration);
  const {ADMIN_TITLE, LOGOUT} = globalLocalization(language);

  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <Wrapper>
      <Header>
        <Title>{ADMIN_TITLE}</Title>
        <Btn variant="outlined" color="error" onClick={logoutAdmin}>
          {LOGOUT}
        </Btn>
      </Header>
      <Content>
        <Outlet />
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: ${({theme}) => theme.colors.gray050};
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: ${({theme}) => theme.colors.gray000};
  border-bottom: 1px solid rgb(224, 224, 224);
`;

const Title = styled.div`
  ${font_header_6_bold};
`;

const Content = styled.div`
  height: calc(100vh - 4.25rem);
  padding: 2rem;
  margin: 0 auto;
`;

const Btn = styled(Button)`
  &.MuiButtonBase-root {
    background: ${({theme}) => theme.colors.red100};
    color: ${({theme}) => theme.colors.gray000};
  }
`;

export default AdminLayout;
