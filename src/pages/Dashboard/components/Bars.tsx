import React, {useMemo} from 'react';
import styled from 'styled-components';
import SvgIcon from '@mui/material/SvgIcon';
import {useAppSelector} from 'services/hooks';
import {selectUserConfiguration} from 'store/userSlice';
import {useGuildData, globalLocalization} from 'services/GlobalUtils';
import {localization} from '../DashboardUtils';
import Increase from 'assets/icons/increase.svg';
import Decrease from 'assets/icons/decrease.svg';
import {font_body_2_bold, mediumWeight} from 'theme/fonts';
import {selectDataConfiguration} from 'store/dataSlice';

interface PlayerData {
  name: string;
  damageLastZvek: number;
  damagePreviousZvek: number;
  percentageChange: number;
}

const Bars = () => {
  const {language} = useAppSelector(selectUserConfiguration);
  const {latestZveks, guildStatistic} = useAppSelector(selectDataConfiguration);
  const guildData = useGuildData();

  const playerData: PlayerData[] = useMemo(
    () =>
      latestZveks
        .reduce<PlayerData[]>((acc, {name, info}) => {
          const [prev, last] = info.slice(-2);
          if (!prev || !last || prev.damage === 0) return acc;

          const percentageChange = ((last.damage - prev.damage) / prev.damage) * 100;
          acc.push({
            name,
            damageLastZvek: last.damage,
            damagePreviousZvek: prev.damage,
            percentageChange,
          });
          return acc;
        }, [])
        .sort((a, b) => b.percentageChange - a.percentageChange),
    []
  );

  const guild = guildData?.[2];
  const guildChange: number | null = guild?.percentageChange ?? null;
  const {rate: currentRate = 0, newbies = 0} = guildStatistic?.[2] || {};
  const {rate: previousRate = 0} = guildStatistic?.[1] || {};

  const getIcon = (isPositive: boolean | undefined | null) => {
    if (isPositive === undefined || isPositive === null) return null;
    return isPositive ? <Increase /> : <Decrease />;
  };

  const {BEST} = localization(language);
  const {NO_DATA, GROW, GUILD_RATING, NEWBIES} = globalLocalization(language);

  const formattedChange =
    guildChange === null ? NO_DATA : `${guildChange > 0 ? '+' : '-'}${Math.abs(guildChange).toFixed(2)}%`;
  const guildRateDiff = previousRate - currentRate;

  const arrValues = [
    {
      key: 'total',
      value: <Value>{guild?.total ? `${(guild.total / 1e12).toFixed(0)} T` : NO_DATA}</Value>,
      isPositive: guildChange !== null && guildChange > 0,
      percent: guildChange === 0 ? '' : formattedChange,
      icon: getIcon(guildChange !== null && guildChange > 0),
      label: GROW,
    },
    {
      key: 'best',
      value: <Value>{playerData[0].name}</Value>,
      isPositive: playerData[0].percentageChange > 0,
      percent: `+${playerData[0].percentageChange.toFixed(2)}%`,
      icon: getIcon(playerData[0].percentageChange > 0),
      label: BEST,
    },
    {
      key: 'rating',
      value: <ChangeText value={guildRateDiff}>{currentRate}</ChangeText>,
      isPositive: guildRateDiff > 0,
      percent: guildRateDiff === 0 ? '' : guildRateDiff > 0 ? `(+${guildRateDiff})` : `(-${-guildRateDiff})`,
      icon: guildRateDiff === 0 ? null : getIcon(guildRateDiff > 0),
      label: GUILD_RATING,
    },
    {
      key: 'newbies',
      value: <ChangeText value={newbies}>{newbies}</ChangeText>,
      isPositive: newbies > 0,
      percent: null,
      icon: newbies === 0 ? null : getIcon(newbies > 0),
      label: NEWBIES,
    },
  ];

  return (
    <Wrapper>
      {arrValues.map(({key, value, isPositive, percent, icon, label}) => (
        <Box key={key}>
          {value}
          {percent === null ? <div /> : <Percent positive={isPositive}>{percent}</Percent>}
          {icon === null ? <div /> : <Icon positive={isPositive}>{icon}</Icon>}
          <Text>{label}</Text>
        </Box>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 1rem;

  @media ${({theme}) => theme.breakpoints.maxTb} {
    grid-template-columns: 1fr;
    grid-row-gap: 1rem;
  }
`;

const Box = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.3rem;
  padding: 1rem 0.5rem 0.5rem 1rem;
  border-radius: 6px;
  background-color: ${({theme}) => theme.colors.gray000};
  box-shadow:
    0 2px 1px -1px rgba(0, 0, 0, 0.2),
    0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
`;

const Text = styled.div`
  ${mediumWeight};
  white-space: nowrap;
`;

const Value = styled.div`
  ${font_body_2_bold};
`;

const ChangeText = styled.span<{value: number | null}>`
  ${font_body_2_bold};
  color: ${({
    value,
    theme: {
      colors: {green100, red100, gray100},
    },
  }) => {
    if (value === null) return gray100;
    if (value > 0) return green100;
    if (value < 0) return red100;
    return gray100;
  }};
`;

const Percent = styled.div<{positive: boolean}>`
  color: ${({
    positive,
    theme: {
      colors: {green100, red100},
    },
  }) => (positive ? green100 : red100)};
`;

const Icon = styled(SvgIcon)<{positive: boolean}>`
  &.MuiSvgIcon-root {
    width: 1.4rem;
    height: 1.4rem;
    padding: 0.2rem;
    background-color: ${({positive}) => (positive ? 'rgba(68, 217, 38, 0.15)' : 'rgba(235, 72, 99, 0.15)')};
    border-radius: 3px;
    fill: ${({
      positive,
      theme: {
        colors: {green100, red100},
      },
    }) => (positive ? green100 : red100)};
  }
`;

export default Bars;
