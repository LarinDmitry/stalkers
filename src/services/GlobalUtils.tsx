import React from 'react';
import styled from 'styled-components';
import en from './GlobalLocalization/EN';
import uk from './GlobalLocalization/UK';
import ru from './GlobalLocalization/RU';
import SvgIcon from '@mui/material/SvgIcon';
import UK from 'assets/icons/language_uk.svg';
import EN from 'assets/icons/language_en.svg';
import RU from 'assets/icons/language_ru.svg';
import {useAppSelector} from 'services/hooks';
import {selectDataConfiguration} from 'store/dataSlice';

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

export interface GuildData {
  guildTotal: number;
  percentageChange: number | null;
  date: string;
}

export const stateReducer = (state: any, action: any) => ({...state, ...action});

const localizationObj = {en, uk, ru} as LocalizationObjProps;
export const globalLocalization = (language: string) => localizationObj[language];

export const calculateTopPlayersData = (topN: number): TopPlayerData[] => {
  const {latestZveks} = useAppSelector(selectDataConfiguration);

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
    .filter((item) => item !== null);
};

export const useGuildData = () => {
  const {guildStatistic} = useAppSelector(selectDataConfiguration);

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
