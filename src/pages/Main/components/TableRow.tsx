import React, {useMemo} from 'react';
import styled from 'styled-components';
import {useNavigate} from 'react-router';
import Checkbox from '@mui/material/Checkbox';
import SvgIcon from '@mui/material/SvgIcon';
import useQuery from 'services/useQuery';
import {useAppDispatch, useAppSelector} from 'services/hooks';
import {toggleItemSelection} from 'store/userSlice';
import {selectUserConfiguration} from 'store/userSlice';
import {getImageComponent, globalLocalization, heroImages, qualityImages} from 'services/GlobalUtils';
import {localization} from 'pages/Main/MainUtils';
import Gey from 'assets/images/gey.png';
import Arrow from 'assets/icons/arrow.svg';
import Up from 'assets/icons/grow_up.svg';
import Down from 'assets/icons/grow_down.svg';

const TableRow = ({
  idx,
  name,
  damage,
  total,
  details: {quality, stars = 0, temple = 0, damageDealer},
  isChecked,
  isExpanded,
  toggleRowExpansion,
}: any) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [, , isLaptop] = useQuery();
  const {language} = useAppSelector(selectUserConfiguration);

  const rowData = useMemo(() => {
    const commonCells = [
      {
        key: 'checkbox',
        content: <Checkbox checked={isChecked} onChange={() => dispatch(toggleItemSelection(name))} />,
      },
      {key: 'index', content: idx + 1},
      {key: 'name', content: name},
      {key: 'quality', content: getImageComponent(quality || '', qualityImages)},
    ];

    const laptopCells = isLaptop
      ? [
          {key: 'stars', content: stars},
          {key: 'temple', content: temple},
          {
            key: 'hero',
            content: getImageComponent(damageDealer || '', heroImages, ''),
          },
          {key: 'damage', content: (Math.floor((damage / 1_000_000_000) * 1000) / 1000).toFixed(3)},
          {
            key: 'influence',
            content: `${(Math.floor((damage / total) * 100 * 1000) / 1000).toFixed(3)}`,
          },
        ]
      : [
          {
            key: 'expand',
            content: (
              <ExpandIcon isexpanded={+isExpanded} onClick={() => toggleRowExpansion(name)}>
                {isExpanded ? <Down /> : <Up />}
              </ExpandIcon>
            ),
          },
        ];

    return [...commonCells, ...laptopCells];
  }, [
    isChecked,
    idx,
    name,
    getImageComponent,
    quality,
    isLaptop,
    stars,
    temple,
    damageDealer,
    damage,
    total,
    isExpanded,
    dispatch,
    toggleRowExpansion,
  ]);

  const {IMPACT} = localization(language);
  const {DAMAGE, TEMPLE, BILLION} = globalLocalization(language);

  const expandValues = useMemo(
    () => [
      {
        title: <img src={Gey} alt="gey" />,
        value: stars,
      },
      {
        title: TEMPLE,
        value: temple,
      },
      {
        title: DAMAGE,
        value: `${(Math.floor((damage / 1_000_000_000) * 1000) / 1000).toFixed(3)} ${BILLION}`,
      },
      {
        title: IMPACT,
        value: `${(Math.floor((damage / total) * 100 * 1000) / 1000).toFixed(3)} %`,
      },
    ],
    [stars, TEMPLE, temple, DAMAGE, damage, BILLION, IMPACT, total]
  );

  return (
    <Row>
      {rowData.map(({key, content}) => (
        <Cell key={key}>{content}</Cell>
      ))}
      <Cell>
        <Icon onClick={() => navigate(`/details/${name}`)}>
          <Arrow />
        </Icon>
      </Cell>
      {isExpanded && !isLaptop && (
        <Collapsible>
          <Block>
            {expandValues.map(({title, value}) => (
              <div>
                {title}:<span>{value}</span>
              </div>
            ))}
          </Block>
          <Block>
            <Hero>{getImageComponent(damageDealer || '', heroImages, '')}</Hero>
          </Block>
        </Collapsible>
      )}
    </Row>
  );
};

const Cell = styled.div`
  padding: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Icon = styled(SvgIcon)<{direction?: string}>`
  &.MuiSvgIcon-root {
    cursor: pointer;
    fill: ${({theme}) => theme.colors.gray090};
    transform: rotate(${({direction}) => (direction ? (direction === 'asc' ? '0' : '-180') : '-90')}deg);
  }
`;

const ExpandIcon = styled(SvgIcon)<{isexpanded: number}>`
  &.MuiSvgIcon-root {
    cursor: pointer;
    fill: ${({
      isexpanded,
      theme: {
        colors: {gray090, blue090},
      },
    }) => (isexpanded ? gray090 : blue090)};
  }
`;

const Block = styled.div`
  & > div {
    display: flex;
    align-items: center;
    white-space: nowrap;
    margin-top: 0.25rem;
  }
`;

const Hero = styled.div`
  height: 100%;

  img {
    width: 6rem !important;
    height: 6rem !important;
  }
`;

const Collapsible = styled.div`
  display: grid;
  grid-template-columns: repeat(5, auto);
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-top: 1px solid ${({theme}) => theme.colors.gray100};

  ${Hero} {
    justify-content: flex-end;
    margin: 0 1rem 0 0;
  }

  img {
    width: fit-content;
    height: 1.6rem;
  }

  @media ${({theme}) => theme.breakpoints.maxLtg} {
    width: calc(100vw - 4rem);
    grid-template-columns: calc(50vw - 3rem) calc(50vw - 3rem);
    padding: 1rem;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 4rem 2.25rem auto 6rem 6rem 6rem 6rem 7rem 7rem 3rem;
  border-bottom: 1px solid rgb(224, 224, 224);
  align-items: center;

  &:hover {
    background-color: ${({theme}) => theme.colors.blue050};

    ${Icon} {
      fill: ${({theme}) => theme.colors.gray100};
    }
  }

  @media ${({theme}) => theme.breakpoints.maxLtg} {
    grid-template-columns: 4rem 2.3rem auto 4rem 3rem 3rem;
  }
`;

export default TableRow;
