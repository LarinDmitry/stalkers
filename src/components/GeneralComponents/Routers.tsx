import React, {Fragment, lazy} from 'react';
import {Route, createRoutesFromChildren, createBrowserRouter} from 'react-router';
import PageLayout from './PageLayout';
import DashboardLayout from './DashboardLayout';
import AdminLayout from './AdminLayout';

const Dashboard = lazy(() => import('pages/Dashboard/DashboardView'));
const Welcome = lazy(() => import('pages/Welcome/WelcomeView'));
const Main = lazy(() => import('pages/Main/MainView'));
const Details = lazy(() => import('pages/Details/DetailsView'));
const Compare = lazy(() => import('pages/Compare/CompareView'));
const Statistic = lazy(() => import('pages/Statistic/StatisticView'));
const Contacts = lazy(() => import('pages/Contacts/ContactsView'));
const BossHP = lazy(() => import('pages/BossHP/BossHPView'));
const NotFound = lazy(() => import('pages/NotFound/NotFoundView'));

// Admin routes
const Login = lazy(() => import('pages/AdminLogin/LoginView'));
const AdminFlow = lazy(() => import('pages/AdminFlow/FlowView'));

const Routers = () => (
  <Fragment>
    <Route element={<PageLayout />}>
      <Route path="/" element={<Welcome />} />
      <Route path="/main" element={<Main />} />
      <Route path="/details/:id" element={<Details />} />
      <Route path="/compare/:id" element={<Compare />} />
      <Route path="/statistic" element={<Statistic />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/bossHP" element={<BossHP />} />
      <Route path="/admin/login" element={<Login />} />
    </Route>
    <Route element={<DashboardLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
    </Route>
    <Route element={<AdminLayout />}>
      <Route path="/admin" element={<AdminFlow />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Fragment>
);

export const router = createBrowserRouter(createRoutesFromChildren(Routers()), {
  basename: '/stalkers',
});
