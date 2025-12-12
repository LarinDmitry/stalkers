import React, {useCallback, useReducer, useMemo, useEffect} from 'react';
import styled from 'styled-components';
import {useLocation} from 'react-router';
import ReactGA from 'react-ga4';
import BackBtn from 'components/GeneralComponents/BackBtn';
import MuiInput from '@mui/material/Input';
import SvgIcon from '@mui/material/SvgIcon';
import {useAppSelector} from 'services/hooks';
import {selectUserConfiguration} from 'store/userSlice';
import {stateReducer} from 'services/GlobalUtils';
import {localization, sliderInitialState} from './BossHPUtils';
import Arrow from 'assets/icons/arrow_full.svg';
import {font_header_5_bold, font_header_6_bold} from 'theme/fonts';

const bossHPValues = [
  10250000000, 10675725000, 27129736900, 44137386790, 71807085120, 111327095937, 190059252320, 309207397440,
  503049514760, 818411255740, 1331473271850, 2166173866130, 3524148262880, 5733436808970, 9327728344580, 15175281243620,
  24688655055120, 40165989178240, 65346047794159, 106311485156190, 172958155200660, 281385622695790, 457786269561800,
  744772481954700, 1211670350891600, 1971266493862000, 3207053458865900, 5217555272224000, 8488440672390990,
  13809844129903000, 22467235414944000, 36551945296572000, 59466359803190000, 96745820763360000, 157395775800180000,
  256067187649380000, 416595707584700000, 677757358252139000, 1102639869546720000, 1793878985024180000,
  1848986947168840000, 1857759515130090000, 1888412547128900000, 1919571354156000000, 2091598126343390000,
  2155852020784490000, 2016170000000000000, 2049433317433990000, 2083250000000000000, 2117620142019080000,
  2152560780673150000, 2188078696834050000, 2224181759481070000, 2260880758338260000, 2298185041844730000,
  2336105723120070000, 2374653450341600000, 2413835232271390000, 2453663513603300000, 2494148961577900000,
  2535302419444700000, 2577134909364890000, 2619657686197320000, 2662882089686150000, 2706819696685040000,
  2751482275065980000, 2796881786871060000, 2843030391516340000, 2889940449048420000, 2937624523454980000,
  2986094864591200000, 3035365429855200000, 3085448959449500000, 3136358867278490000, 3188108788589190000,
  3240712583430480000, 3294184340883840000, 3348538382332320000, 3403789265461790000, 3459951789070090000,
  3517040993588500000, 3575072169982700000, 3634060860596300000, 3694022864601860000, 3754974242264200000,
  3816931317258800000, 3879910683994300000, 3943929210072790000, 4009004043252400000, 4075152608947890000,
  4142392626992000000, 4210742105360000000, 4280219350064000000, 4350842969363990000, 4422631878364000000,
  4495605304170600000, 4569782791499940000, 4645184207337090000, 4799739938200990000, 4721829747363990000,
  5791295969328000000, 7169624410035000000, 8875995019632000000, 10988481834272900000, 13603740510816000000,
  16841430752399900000, 20849691246051700000, 25811917681043500000, 31955154368387400000, 39560480935620000000,
  48975876411414100000, 60632133625367000000, 75062581799428200000, 92927476780349300000, 115044215478883000000,
  142424730509050000000, 176321826028161000000, 218286420318261000000, 270238487976909000000, 334555373315700000000,
  414177734226100000000, 512752034293545000000, 634787017569612000000, 785866326654562000000, 972902511040737000000,
  1204453306987710000000, 1490756113113280000000, 1846369885971160000000, 2285355741753780000000,
  2828713193965060000000, 3501257238652740000000, 4336264307453250000000, 5367237946771400000000,
  6643331940755640000000, 8222825168690800000000, 10177852673603400000000, 12597700050829300000000,
  15592881097823600000000, 19300184950415500000000, 23888923203901000000000, 29568662344498700000000,
  36598794565608900000000, 45300384171922300000000, 56070830487190100000000, 69402016980506100000000,
  85902775455820400000000, 106326691241349000000000, 131606519234613000000000, 162896782574901000000000,
  201626499413378000000000, 249564445798679000000000, 308899935216895000000000, 382342803966458000000000,
  473247168673856000000000, 585764607923598000000000, 725033763767431000000000, 897415022164213000000000,
  1110780990144790000000000, 1374876035718150000000000, 1701761310612330000000000, 2106365579922480000000000,
  2607167014912170000000000, 3227037086266940000000000, 3994285098184660000000000, 4943951066901460000000000,
  6119405989077960000000000, 7574332583884700000000000, 9375176968760290000000000, 11604183236233700000000000,
  14363149520141100000000000, 17778077089800100000000000, 22004924795057800000000000, 27236731666213900000000000,
  33712432956096800000000000, 41727772250631000000000000, 51648808001133500000000000, 63928631318141300000000000,
  79128058524044500000000000, 97941243487999300000000000, 121227379451762000000000000, 150049938160548000000000000,
  185725238339770000000000000, 229882561627299000000000000, 284538561440158000000000000, 352189363009170000000000000,
  435924560766052000000000000, 539568319313854000000000000, 667854022025203000000000000, 826640443424173000000000000,
  1023179317888010000000000000, 1266446524461410000000000000, 1567552012907210000000000000,
  1940247192209270000000000000, 2401552953827760000000000000, 2972537011364880000000000000,
  3679276057540460000000000000, 4554046679935120000000000000, 5636799424311750000000000000,
  6976983325602170000000000000, 8635804232412320000000000000,
].reverse();

const BossHPView = () => {
  const {language} = useAppSelector(selectUserConfiguration);
  const location = useLocation();
  const [state, stateDispatch] = useReducer(stateReducer, sliderInitialState);

  useEffect(() => {
    ReactGA.send({hitType: 'calculator', page: location.pathname});
  }, []);

  const updateValue = useCallback((key: string, newValue: number) => {
    stateDispatch({[key]: Math.min(key === 'bossLevel' ? 200 : 100, Math.max(1, newValue))});
  }, []);

  const {hpLevel, bossLevel} = state;

  const {CALCULATOR, BOSS_LEVEL, HP_LEVEL, HP_REMAINING} = localization(language);

  const arrValues = useMemo(
    () => [
      {key: 'bossLevel', title: BOSS_LEVEL, value: bossLevel, max: 200, endAdornment: 'lvl'},
      {key: 'hpLevel', title: HP_LEVEL, value: hpLevel, max: 100, endAdornment: '%'},
    ],
    [BOSS_LEVEL, HP_LEVEL, bossLevel, hpLevel]
  );

  const bossValue = bossHPValues[bossLevel - 1];

  const formatHP = (value: number) => {
    const threshold = 1e16;
    return value >= threshold ? value.toExponential(2) : value.toLocaleString();
  };

  return (
    <Wrapper>
      <BackBtn />
      <Content>
        <Title>{CALCULATOR}</Title>
        {arrValues.map(({key, title, value, max, endAdornment}) => (
          <Slider key={key}>
            <Label>
              <div>{title}</div>
              <Input
                value={value}
                size="small"
                onChange={({target: {value}}) => updateValue(key, Number(value))}
                inputProps={{min: 1, max, type: 'number'}}
                endAdornment={endAdornment}
              />
            </Label>
            <Value>
              <Icon onClick={() => updateValue(key, value - 1)}>
                <Arrow />
              </Icon>
              <Range
                type="range"
                min="1"
                max={max}
                value={value}
                onChange={({target: {value}}) => updateValue(key, Number(value))}
              />
              <Icon rotate={180} onClick={() => updateValue(key, value + 1)}>
                <Arrow />
              </Icon>
            </Value>
          </Slider>
        ))}
        <Text>
          {HP_REMAINING} {formatHP((bossValue * hpLevel) / 100)} / {formatHP(bossValue)}
        </Text>
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  padding: 1rem 1rem 1.5rem;
  align-items: center;
  gap: 1rem;
`;

const Content = styled.div`
  height: calc(100% - 4px);
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.div`
  ${font_header_5_bold};
`;

const Slider = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Input = styled(MuiInput)`
  width: 2.75rem;

  input {
    padding: 0;
    cursor: pointer;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

const Value = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Text = styled.div`
  ${font_header_6_bold};
`;

const Range = styled.input.attrs({type: 'range'})`
  appearance: none;
  width: 250px;
  height: 24px;
  cursor: pointer;

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 24px;
    border-radius: 20px;
    background: linear-gradient(to right, rgb(176, 193, 255), rgb(76, 110, 245) 100%);
    box-shadow: 0 0 0 5px rgba(72, 99, 235, 0.1);
  }

  &::-webkit-slider-thumb {
    appearance: none;
    width: 28px;
    height: 28px;
    background: rgb(176, 193, 255);
    border-radius: 50%;
    border: 2px solid rgb(76, 110, 245);
    margin-top: -2px;
    cursor: pointer;
    transition: 0.2s ease;
  }
`;

const Icon = styled(SvgIcon)<{rotate?: number}>`
  &.MuiSvgIcon-root {
    width: 1.25em;
    height: 1.25em;
    cursor: pointer;
    ${({rotate}) => rotate && `transform: rotate(${rotate}deg)`};
    fill: ${({theme}) => theme.colors.gray100};
    border-radius: 50%;
    border: 2px solid rgba(72, 99, 235, 0.9);
    background-color: rgb(182, 193, 252);
  }
`;

export default BossHPView;
