import React, {useEffect, useMemo} from 'react';
import {useLocation, useParams} from 'react-router';
import ReactGA from 'react-ga4';
import styled from 'styled-components';
import BackBtn from 'components/GeneralComponents/BackBtn';
import LineChart from './components/LineChart';
import BarChart from './components/BarChart';
import {useAppSelector} from 'services/hooks';
import {selectUserConfiguration} from 'store/userSlice';
import {globalLocalization} from 'services/GlobalUtils';
import {localization} from './DetailsUtils';
import {font_body_2_reg, font_header_6_reg} from 'theme/fonts';
import {selectDataConfiguration} from 'store/dataSlice';

const DetailsView = () => {
  const {id} = useParams<{id: string}>();
  const location = useLocation();
  const {language} = useAppSelector(selectUserConfiguration);
  const {latestZveks} = useAppSelector(selectDataConfiguration);

  useEffect(() => {
    ReactGA.send({hitType: 'details', page: location.pathname});
  }, []);

  const latestZvekValues = useMemo(() => latestZveks.find(({name}) => name === id)?.info || [], [id]);

  const averageAllZveks = useMemo(
    () => latestZvekValues.reduce((acc, {damage}) => acc + damage, 0) / 3 || 0,
    [latestZvekValues]
  );

  const averageLatestZveks = useMemo(() => {
    const {guildTotal = 0} = latestZvekValues.slice(-1)[0] || {};
    return guildTotal / 30;
  }, [latestZvekValues]);

  const latestDamageByDayValues = latestZvekValues.map(({damageByDay, date}) => ({damageByDay, date}));

  const {STATISTIC, NO_DATA, LAST_ZVEKS, AVERAGE_ZVEKS, AVERAGE_GUILD, DAYS_COMPARE} = localization(language);
  const {LATEST_ZVEK, TUE, WED, THU, FRI, SAT, SUN} = globalLocalization(language);

  const zvekDaysOptions = useMemo(() => [TUE, WED, THU, FRI, SAT, SUN], [FRI, SAT, SUN, THU, TUE, WED]);

  const damageByDayData = useMemo(() => {
    const {damageByDay = [], date} = latestZvekValues.slice(-1)[0] || {};
    return damageByDay.map((damage, idx) => ({
      damage,
      date: zvekDaysOptions[idx] || date,
    }));
  }, [latestZvekValues, zvekDaysOptions]);

  return (
    <Wrapper>
      <Header>
        <BackBtn to="/main" />
        <NickName>
          {STATISTIC}
          <b>“{id}”</b>
        </NickName>
      </Header>
      {!latestZvekValues || damageByDayData.length === 0 ? (
        <div>{NO_DATA}</div>
      ) : (
        <>
          <Charts>
            <LineChart
              data={latestZvekValues}
              title={LAST_ZVEKS}
              average={averageAllZveks || 0}
              averageTitle={AVERAGE_ZVEKS}
              stepped
              withCheckbox={false}
            />
            <LineChart
              data={damageByDayData}
              title={LATEST_ZVEK}
              average={averageLatestZveks}
              averageTitle={AVERAGE_GUILD}
              stepped={false}
              withCheckbox
            />
          </Charts>
          <BarChartContainer>
            <BarChart data={latestDamageByDayValues} title={DAYS_COMPARE} />
          </BarChartContainer>
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  padding: 1rem 1rem 1.5rem;
`;

const Header = styled.span`
  display: flex;
  align-items: center;
`;

const NickName = styled.span`
  ${font_header_6_reg};
  margin-left: 1rem;

  @media ${({theme}) => theme.breakpoints.maxLtg} {
    ${font_body_2_reg};
  }
`;

const Charts = styled.div`
  display: grid;
  grid-template-columns: calc(50% - 0.5rem) calc(50% - 0.5rem);
  grid-template-rows: 20rem;
  grid-column-gap: 1rem;
  padding: 0 4rem;

  @media ${({theme}) => theme.breakpoints.maxLtg} {
    grid-template-columns: 100%;
    grid-template-rows: inherit;
    padding: 0;
  }
`;

const BarChartContainer = styled.div`
  margin-top: 1rem;
  height: calc(100vh - 24.5rem);
  display: flex;
  justify-content: center;
  overflow: hidden;

  @media ${({theme}) => theme.breakpoints.maxLtg} {
    height: fit-content;
  }
`;

export default DetailsView;
