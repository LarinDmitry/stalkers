import React from 'react';
import styled from 'styled-components';
import RU from 'assets/icons/language_ru.svg';
import {useQuery} from '@tanstack/react-query';
import {getGuildStatistic} from 'api/statistic';
import {getAllUsersDamage} from 'api/user-damage';
import en from './GlobalLocalization/EN';
import uk from './GlobalLocalization/UK';
import ru from './GlobalLocalization/RU';
import SvgIcon from '@mui/material/SvgIcon';
import UK from 'assets/icons/language_uk.svg';
import EN from 'assets/icons/language_en.svg';

export interface LocalizationObjProps {
  [key: string]: {
    [key: string]: string;
  };
}

export interface TopPlayerData {
  date: string;
  topPlayers: string[];
  topDamagePercentage: number;
  guildTotal: number;
}

export const stateReducer = (state: any, action: any) => ({...state, ...action});

const localizationObj = {en, uk, ru} as LocalizationObjProps;
export const globalLocalization = (language: string) => localizationObj[language];

export const useTopPlayersData = (topN: number): TopPlayerData[] => {
  const {data: latestZveks = []} = useQuery({
    queryKey: ['allUsersDamage'],
    queryFn: getAllUsersDamage,
  });

  if (!latestZveks.length || !latestZveks[0]?.info) return [];

  return latestZveks[0].info
    .map(({date, guildTotal}, index) => {
      if (guildTotal === 0) return null;

      const topPlayers = latestZveks
        .map(({info, name}) => ({
          name,
          damage: info[index] ? info[index].damage : 0,
        }))
        .sort((a, b) => b.damage - a.damage)
        .slice(0, topN);

      const topDamageSum = topPlayers.reduce((sum, {damage}) => sum + damage, 0);
      const topDamagePercentage = (topDamageSum / guildTotal) * 100;

      return {
        date,
        topPlayers: topPlayers.map(({name}) => name),
        topDamagePercentage,
        guildTotal,
      };
    })
    .filter((item): item is TopPlayerData => item !== null);
};

export const useGuildData = () => {
  const {data: guildStatistic = []} = useQuery({
    queryKey: ['guildStatistic'],
    queryFn: getGuildStatistic,
  });

  return guildStatistic.map(({total, rate, date}, index, arr) => {
    const previous = arr[index - 1]?.total || 0;
    const percentageChange = index > 0 && previous > 0 ? ((total - previous) / previous) * 100 : null;
    return {total, percentageChange, rate, date};
  });
};

const Icon = styled(SvgIcon)`
  &.MuiSvgIcon-root {
    font-size: 2rem;
    cursor: pointer;
    fill: ${({theme}) => theme.colors.blue100};
  }
`;

export const languageOptions = [
  {
    label: 'English',
    value: 'en',
    img: (
      <Icon>
        <EN />
      </Icon>
    ),
  },
  {
    label: 'Українська',
    value: 'uk',
    img: (
      <Icon>
        <UK />
      </Icon>
    ),
  },
  {
    label: 'Русский',
    value: 'ru',
    img: (
      <Icon>
        <RU />
      </Icon>
    ),
  },
];

const ADMIN_USERS = [
  {login: 'admin', password: '123456'},
];

export const checkAuth = (): boolean => localStorage.getItem('isAuth') === 'true';

export const loginAdmin = (login: string, pass: string): boolean => {
  const user = ADMIN_USERS.find((u) => u.login === login && u.password === pass);
  if (user) {
    localStorage.setItem('isAuth', 'true');
    return true;
  }
  return false;
};

export const logoutAdmin = (): void => {
  localStorage.removeItem('isAuth');
  window.location.href = '/stalkers/admin/login';
};
