import React, {useEffect, useMemo} from 'react';
import {useLocation, useNavigate} from 'react-router';
import ReactGA from 'react-ga4';
import styled from 'styled-components';
import Table from './components/Table';
import PieChart from './components/PieChart';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import {useAppSelector} from 'services/hooks';
import useQuery from 'services/useQuery';
import {selectUserConfiguration} from 'store/userSlice';
import {globalLocalization} from 'services/GlobalUtils';
import {localization} from './MainUtils';
import Compare from 'assets/icons/compare.svg';
import {font_header_5_bold, font_body_2_reg} from 'theme/fonts';
import BackBtn from 'components/GeneralComponents/BackBtn';
import {selectDataConfiguration} from 'store/dataSlice';

const MainView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, ,] = useQuery();
  const {language, selectedItems} = useAppSelector(selectUserConfiguration);
  const {latestZveks} = useAppSelector(selectDataConfiguration);

  const {guildTotal, date} = latestZveks[0].info[latestZveks[0].info.length - 1];

  useEffect(() => {
    ReactGA.send({hitType: 'main', page: location.pathname});
  }, []);

  const pieChartData = useMemo(
    () =>
      latestZveks.map(({name, info}) => ({
        name,
        damage: info[info.length - 1].damage,
      })),
    []
  );

  const tableData = useMemo(
    () =>
      latestZveks.map(({name, info}) => ({
        name,
        damage: info[info.length - 1].damage,
      })),
    []
  );

  const {MIN, COMPARE} = localization(language);
  const {LAST} = globalLocalization(language);

  return (
    <Wrapper>
      <Header>
        <Title>
          <BackBtn />
          {LAST} - {date}
        </Title>
        <Tooltip title={MIN} disableHoverListener={selectedItems.length >= 2}>
          <span>
            <CompareBtn
              variant="contained"
              onClick={() => navigate(`/compare/${selectedItems.join('^')}`)}
              disabled={selectedItems.length <= 1}
            >
              {isMobile ? (
                <Icon>
                  <Compare />
                </Icon>
              ) : (
                COMPARE
              )}
            </CompareBtn>
          </span>
        </Tooltip>
      </Header>
      <Content>
        <Table data={tableData} total={guildTotal} />
        <PieChart data={pieChartData} total={guildTotal} />
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 1rem 1.5rem;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: calc(68% - 0.5rem) calc(32% - 0.5rem);
  grid-template-rows: calc(100vh - 5.6rem);
  grid-column-gap: 1rem;

  @media ${({theme}) => theme.breakpoints.maxLtg} {
    grid-template-columns: 100%;
    grid-template-rows: 1fr 24rem;
    grid-row-gap: 2rem;
  }
`;

const Icon = styled(SvgIcon)`
  &.MuiSvgIcon-root {
    font-size: 2rem;
    cursor: pointer;
    color: ${({theme}) => theme.colors.blue100};
  }
`;

const CompareBtn = styled(Button)`
  &.MuiButtonBase-root {
    ${font_body_2_reg};
    color: ${({theme}) => theme.colors.gray000};
    background: ${({theme}) => theme.colors.blue100};
    border-radius: 16px;
    text-transform: inherit;

    ${Icon} {
      fill: ${({theme}) => theme.colors.gray000};
    }

    &:hover {
      background: ${({theme}) => theme.colors.blue100};
    }

    &:disabled {
      ${Icon} {
        fill: ${({theme}) => theme.colors.gray090};
      }
    }
  }
`;

const Header = styled.div`
  ${font_header_5_bold};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 67%;
  height: 2.5rem;

  @media ${({theme}) => theme.breakpoints.maxLtg} {
    ${font_body_2_reg};
    font-weight: bold;
    width: 100%;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  column-gap: 1rem;
`;

export default MainView;
