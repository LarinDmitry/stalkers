import React, {FC, useMemo, useState} from 'react';
import {Navigate, Outlet, useLocation, Link} from 'react-router';
import styled from 'styled-components';
import {logoutAdmin} from 'api/login-auth';
import SvgIcon from '@mui/material/SvgIcon';
import Button from '@mui/material/Button';
import {globalLocalization} from 'services/GlobalUtils';
import {useAppSelector} from 'services/hooks';
import {selectUserConfiguration} from 'store/userSlice';
import {font_body_2_bold, font_header_4_bold} from 'theme/fonts';
import SidebarIcon from 'assets/icons/sidebar.svg';
import Persons from 'assets/icons/persons.svg';
import Statistic from 'assets/icons/statistic.svg';

const AdminLayout: FC = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const {language} = useAppSelector(selectUserConfiguration);
  const {LOGOUT, ADMIN_TITLE, USERS, SE_DATA} = globalLocalization(language);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const menuLinks = useMemo(
    () => [
      {
        to: '/admin/users',
        icon: <Persons />,
        text: USERS,
      },
      {
        to: '/admin/zvek',
        icon: <Statistic />,
        text: SE_DATA,
      },
    ],
    [USERS, SE_DATA]
  );

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <Wrapper iscollapsed={+isSidebarCollapsed}>
      <Sidebar iscollapsed={+isSidebarCollapsed}>
        <TopSection>
          <Title iscollapsed={+isSidebarCollapsed}>
            {!isSidebarCollapsed && <div>{ADMIN_TITLE}</div>}
            <Icon onClick={() => setIsSidebarCollapsed((prev) => !prev)}>
              <SidebarIcon />
            </Icon>
          </Title>

          <NavMenu iscollapsed={+isSidebarCollapsed}>
            {menuLinks.map(({to, text, icon}) => {
              const isActive = location.pathname.startsWith(to);
              return (
                <MenuItem key={to} to={to} active={isActive} iscollapsed={+isSidebarCollapsed}>
                  <SideIcon>{icon}</SideIcon>
                  {!isSidebarCollapsed && <div>{text}</div>}
                </MenuItem>
              );
            })}
          </NavMenu>
        </TopSection>

        <Btn onClick={logoutAdmin}>{LOGOUT}</Btn>
      </Sidebar>

      <Content>
        <Outlet />
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div<{iscollapsed: number}>`
  display: grid;
  height: 100vh;
  grid-template-columns: ${({iscollapsed}) => (iscollapsed ? 6 : 16)}rem 1fr;
  transition: grid-template-columns 0.4s ease;
  background-color: ${({theme}) => theme.colors.gray050};

  @media ${({theme}) => theme.breakpoints.maxTb} {
    grid-template-columns: 1fr;
    grid-template-rows: 4rem auto;
  }
`;

const Icon = styled(SvgIcon)`
  &.MuiSvgIcon-root {
    cursor: pointer;
    fill: ${({theme}) => theme.colors.gray000};
    height: 2rem;
    width: 2rem;
  }
`;

const Title = styled.div<{iscollapsed: number}>`
  ${font_header_4_bold};
  display: flex;
  align-items: center;
  color: rgb(230, 230, 230);
  padding: 1rem;
  justify-content: ${({iscollapsed}) => (iscollapsed ? 'center' : 'space-between')};

  @media ${({theme}) => theme.breakpoints.maxTb} {
    display: none;
  }
`;

const SideIcon = styled(Icon)`
  &.MuiSvgIcon-root {
    height: 1.5rem;
    width: 1.5rem;
  }
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const NavMenu = styled.nav<{iscollapsed: number}>`
  display: flex;
  flex-direction: column;
  align-items: ${({iscollapsed}) => (iscollapsed ? 'center' : 'start')};

  @media ${({theme}) => theme.breakpoints.maxTb} {
    flex-direction: row;
  }
`;

const MenuItem = styled(Link)<{active?: boolean; iscollapsed: number}>`
  ${font_body_2_bold};
  width: calc(100% - 1rem);
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 3rem;
  padding: 0 1rem;
  margin: 0.5rem;
  border-radius: 1rem;
  text-decoration: none;
  color: rgb(230, 230, 230);
  background-color: ${({active}) => (active ? 'rgb(127, 145, 241)' : 'transparent')};
  cursor: pointer;
  justify-content: ${({iscollapsed}) => (iscollapsed ? 'center' : 'start')};

  &:hover {
    background-color: rgb(127, 145, 241);
  }

  @media ${({theme}) => theme.breakpoints.maxTb} {
    & > div {
      display: none;
    }
  }
`;

const Sidebar = styled.div<{iscollapsed: number}>`
  background: rgb(14, 30, 73);
  width: ${({iscollapsed}) => (iscollapsed ? 6 : 16)}rem;
  transition: width 0.4s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media ${({theme}) => theme.breakpoints.maxTb} {
    width: 100%;
    display: flex;
    flex-direction: row;

    & > div {
      margin-right: auto;
    }
  }
`;

const Btn = styled(Button)`
  &.MuiButtonBase-root {
    text-transform: inherit;
    background: ${({theme}) => theme.colors.red090};
    color: ${({theme}) => theme.colors.gray000};
    margin: 1rem;
  }
`;

const Content = styled.div`
  height: 100vh;
  overflow-y: auto;
`;

export default AdminLayout;
