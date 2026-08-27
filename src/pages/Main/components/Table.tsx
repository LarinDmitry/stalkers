import React, {useCallback, useMemo, useState, FC} from 'react';
import styled from 'styled-components';
import {useQuery} from '@tanstack/react-query';
import {getUsersDetails, SortOrder} from 'api/users';
import TableRow from './TableRow';
import BaseLoader from 'components/GeneralComponents/BaseLoader';
import Checkbox from '@mui/material/Checkbox';
import SvgIcon from '@mui/material/SvgIcon';
import {useAppDispatch, useAppSelector} from 'services/hooks';
import useQueryHooks from 'services/useQuery';
import {selectUserConfiguration, setSortConfig, selectAllItems, clearSelection} from 'store/userSlice';
import {localization, TABLE_KEY_TO_SORT_FIELD} from 'pages/Main/MainUtils';
import {globalLocalization} from 'services/GlobalUtils';
import Gey from 'assets/images/gey.png';
import Arrow from 'assets/icons/arrow.svg';
import {font_body_4_bold} from 'theme/fonts';

interface Props {
  total: number;
  data: {
    name: string;
    damage: number;
  }[];
}

const Table: FC<Props> = ({data, total}) => {
  const dispatch = useAppDispatch();
  const [, , isLaptop] = useQueryHooks();
  const {sortConfig, selectedItems, language} = useAppSelector(selectUserConfiguration);

  const sortBy = sortConfig?.key ? TABLE_KEY_TO_SORT_FIELD[sortConfig.key] : undefined;
  const sortOrder = sortConfig?.direction === 'desc' ? SortOrder.DESC : SortOrder.ASC;

  const {data: teamDetails = [], isPending} = useQuery({
    queryKey: ['teamDetails', sortBy, sortOrder],
    queryFn: () => getUsersDetails({isActive: true, sortBy, sortOrder}),
  });

  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleRowExpansion = useCallback((name: string) => {
    setExpandedRows((prev) => (prev.includes(name) ? prev.filter((row) => row !== name) : [...prev, name]));
  }, []);

  const teamDetailsMap = useMemo(
    () =>
      teamDetails.reduce(
        (acc, {name, quality, stars, temple, damageDealer}) => {
          acc[name] = {quality, stars, temple, damageDealer};
          return acc;
        },
        {} as Record<string, {quality?: string; stars?: number; temple?: number; damageDealer?: string}>
      ),
    [teamDetails]
  );

  const damageMap = useMemo(
    () =>
      data.reduce(
        (acc, {name, damage}) => {
          acc[name] = damage;
          return acc;
        },
        {} as Record<string, number>
      ),
    [data]
  );

  const processedData = useMemo(() => {
    if (sortBy) {
      return teamDetails.map(({name}) => ({
        name,
        damage: damageMap[name] || 0,
      }));
    }

    if (sortConfig?.key === 'damage' || sortConfig?.key === 'influence') {
      const isAsc = sortConfig.direction === 'asc';
      return [...data].sort((a, b) => (isAsc ? a.damage - b.damage : b.damage - a.damage));
    }

    return data;
  }, [teamDetails, damageMap, data, sortBy, sortConfig]);

  const toggleSelectAll = useCallback(
    (checked: boolean) =>
      checked ? dispatch(selectAllItems(processedData.map(({name}) => name))) : dispatch(clearSelection()),
    [dispatch, processedData]
  );

  const {DAMAGE_TITLE, IMPACT, MORE} = localization(language);
  const {NICKNAME, QUALITY, TEMPLE, HERO} = globalLocalization(language);

  const headerArr = useMemo(
    () => [
      <Checkbox
        indeterminate={selectedItems.length > 0 && selectedItems.length < data.length}
        checked={selectedItems.length === data.length}
        onChange={({target: {checked}}) => toggleSelectAll(checked)}
      />,
      '№',
      NICKNAME,
      QUALITY,
      ...(isLaptop ? [<img src={Gey} alt="gey" />, TEMPLE, HERO, DAMAGE_TITLE, `${IMPACT}, %`] : [MORE]),
      '',
    ],
    [
      data.length,
      isLaptop,
      selectedItems.length,
      toggleSelectAll,
      NICKNAME,
      QUALITY,
      TEMPLE,
      HERO,
      DAMAGE_TITLE,
      IMPACT,
      MORE,
    ]
  );

  const requestSort = useCallback(
    (key: string) => {
      if (key && key !== '№' && key !== 'more') {
        dispatch(
          setSortConfig(
            sortConfig?.key === key && sortConfig.direction === 'desc'
              ? {key, direction: 'asc'}
              : {key, direction: 'desc'}
          )
        );
      }
    },
    [dispatch, sortConfig?.direction, sortConfig?.key]
  );

  const SortIcon = ({columnKey}: {columnKey: string}) =>
    sortConfig?.key === columnKey ? (
      <Icon direction={sortConfig.direction}>
        <Arrow />
      </Icon>
    ) : null;

  if (isPending) return <BaseLoader />;

  return (
    <Wrapper>
      <Header>
        {headerArr.map((item, idx) => {
          const key = [
            '',
            '№',
            'name',
            'quality',
            ...(!isLaptop ? ['more', ''] : ['gey', 'temple', 'hero', 'damage', 'influence']),
            '',
          ][idx];

          return (
            <HCell key={idx} onClick={() => requestSort(key)}>
              {item}
              {key && <SortIcon columnKey={key} />}
            </HCell>
          );
        })}
      </Header>
      {processedData.map(({name, damage}, idx) => {
        const isChecked = selectedItems.includes(name);
        const details = teamDetailsMap[name] || {};
        const isExpanded = expandedRows.includes(name);

        return (
          <TableRow
            key={name}
            idx={idx}
            name={name}
            damage={damage}
            total={total}
            details={details}
            isChecked={isChecked}
            isExpanded={isExpanded}
            toggleRowExpansion={toggleRowExpansion}
          />
        );
      })}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  overflow: auto;
  height: calc(100vh - 6rem);
  border: 1px solid rgb(224, 224, 224);
  border-radius: 8px;
  background: ${({theme}) => theme.colors.gray000};
`;

const Header = styled.div`
  ${font_body_4_bold};
  display: grid;
  grid-template-columns: 4rem 2.25rem auto 6rem 6rem 6rem 6rem 7rem 7rem 3rem;
  color: ${({theme}) => theme.colors.gray090};
  height: 3rem;
  align-items: center;
  border-bottom: 1px solid rgb(224, 224, 224);
  position: sticky;
  top: 0;
  background: ${({theme}) => theme.colors.gray000};
  z-index: 1;

  img {
    width: fit-content;
    height: 1.6rem;
  }

  @media ${({theme}) => theme.breakpoints.maxLtg} {
    grid-template-columns: 4rem 2.3rem auto 4rem 3rem 3rem;
  }
`;

const HCell = styled.div`
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const Icon = styled(SvgIcon)<{direction?: string}>`
  &.MuiSvgIcon-root {
    cursor: pointer;
    fill: ${({theme}) => theme.colors.gray090};
    transform: rotate(${({direction}) => (direction ? (direction === 'asc' ? '0' : '-180') : '-90')}deg);
  }
`;

export default Table;
