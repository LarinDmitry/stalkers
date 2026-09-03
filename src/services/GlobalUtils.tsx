import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import RU from 'assets/icons/language_ru.svg';
import {useQuery} from '@tanstack/react-query';
import {getGuildStatistic, StatisticItem} from 'api/statistic';
import {getAllUsersDamage} from 'api/user-damage';
import en from './GlobalLocalization/EN';
import uk from './GlobalLocalization/UK';
import ru from './GlobalLocalization/RU';
import SvgIcon from '@mui/material/SvgIcon';
import UK from 'assets/icons/language_uk.svg';
import EN from 'assets/icons/language_en.svg';
import X from 'assets/images/quality/x.png';
import B from 'assets/images/quality/b+.png';
import A_Low from 'assets/images/quality/a-.png';
import A from 'assets/images/quality/a.png';
import A_High from 'assets/images/quality/a+.png';
import S from 'assets/images/quality/s.png';
import SS from 'assets/images/quality/ss.png';
import SSS from 'assets/images/quality/sss.png';
import Aspen from 'assets/images/heroes/aspen.png';
import Vulkan from 'assets/images/heroes/vulkan.png';
import Mokman from 'assets/images/heroes/mokman.png';
import Vesa from 'assets/images/heroes/vesa.png';
import Nataly from 'assets/images/heroes/nataly.png';
import Williams from 'assets/images/heroes/williams.png';

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
      const numericGuildTotal = Number(guildTotal) || 0;

      if (numericGuildTotal === 0) return null;

      const topPlayers = latestZveks
        .map(({info, name}) => ({
          name,
          damage: info[index] ? info[index].damage : 0,
        }))
        .sort((a, b) => b.damage - a.damage)
        .slice(0, topN);

      const topDamageSum = topPlayers.reduce((sum, {damage}) => sum + damage, 0);
      const topDamagePercentage = (topDamageSum / numericGuildTotal) * 100;

      return {
        date,
        topPlayers: topPlayers.map(({name}) => name),
        topDamagePercentage,
        guildTotal: numericGuildTotal,
      };
    })
    .filter((item): item is TopPlayerData => item !== null);
};

export const useGuildData = () => {
  const {data: guildStatistic = []} = useQuery<StatisticItem[]>({
    queryKey: ['guild-statistic'],
    queryFn: () => getGuildStatistic(),
  });

  return guildStatistic.map(({total, rate, date}, index, arr) => {
    const currentTotal = Number(total) || 0;
    const previousTotal = index > 0 ? Number(arr[index - 1]?.total) || 0 : 0;

    const percentageChange =
      index > 0 && previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : null;

    return {total: currentTotal, percentageChange, rate, date};
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

export const qualityImages: {[key: string]: string} = {
  '': X,
  'b+': B,
  'a-': A_Low,
  a: A,
  'a+': A_High,
  s: S,
  ss: SS,
  sss: SSS,
};

export const heroImages: {[key: string]: string} = {
  aspen: Aspen,
  mokman: Mokman,
  nataly: Nataly,
  vesa: Vesa,
  vulkan: Vulkan,
  williams: Williams,
};

export const getImageComponent = (type: string, images: Record<string, string>, fallback = X) => (
  <StyledImage src={images[type] || fallback} alt={type} />
);

const StyledImage = styled.img`
  height: 3rem;
  width: 3rem;
`;

export const getFormattedDate = (date: string | undefined) => (date ? dayjs(date).format('DD.MM.YYYY') : '-');
