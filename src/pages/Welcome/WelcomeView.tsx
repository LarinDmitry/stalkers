import React, {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router';
import ReactGA from 'react-ga4';
import styled, {keyframes} from 'styled-components';
import LanguageSelector from 'components/GeneralComponents/LanguageSelector';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import {useAppSelector} from 'services/hooks';
import {welcomeTitleStyles} from 'services/GlobalStyled';
import {selectUserConfiguration} from 'store/userSlice';
import {localization} from './WelcomeUtils';
import Background from 'assets/images/background.webp';
import {font_body_2_reg, font_header_6_bold} from 'theme/fonts';
import {useQuery} from '@tanstack/react-query';
import {getHealth} from 'api/health';

const WelcomeView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {language} = useAppSelector(selectUserConfiguration);

  const {isLoading, isError, refetch} = useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    retry: 3,
    retryDelay: 3000,
  });

  useEffect(() => {
    ReactGA.send({hitType: 'welcome', page: location.pathname});
  }, []);

  const {WELCOME, COME, WAKE_UP, SERVER, RETRY} = localization(language);

  return (
    <Wrapper>
      <LanguageSelector language={language} />
      <Leaves>
        {Array.from({length: 25}).map((_, index) => {
          const is3DAnimation = Math.random() > 0.5;
          const animationDuration = 10 + Math.random() * 8;

          return (
            <Leaf
              key={index}
              is3DAnimation={is3DAnimation}
              style={{
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${animationDuration}s`,
                left: `${Math.random() * 150 - 50}%`,
              }}
            />
          );
        })}
      </Leaves>
      <Content>
        <Title>{WELCOME}</Title>
        <Inside variant="contained" onClick={() => navigate('/dashboard')}>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : COME}
        </Inside>

        {isLoading && <StatusText>{WAKE_UP}</StatusText>}

        {isError && (
          <StatusText iserror>
            {SERVER} <RetryLink onClick={() => refetch()}>{RETRY}</RetryLink>
          </StatusText>
        )}
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  position: relative;
  padding: 1rem;
  background: url(${Background}) center center / cover no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  perspective: 800px;
`;

const Leaves = styled.div`
  position: absolute;
  top: -20%;
  width: 100%;
  text-align: center;
  z-index: 0;
`;

const falling2D = keyframes`
    0% {
        transform: translate3d(0, 0, 0) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    25% {
        transform: translate3d(-200px, 300px, 0) rotate(15deg);
    }
    50% {
        transform: translate3d(300px, 600px, 0) rotate(-30deg);
    }
    75% {
        transform: translate3d(-400px, 900px, 0) rotate(45deg);
    }
    100% {
        transform: translate3d(500px, 1200px, 0) rotate(115deg);
        opacity: 0;
    }
`;

const falling3D = keyframes`
    0% {
        transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    25% {
        transform: translate3d(-200px, 300px, 0) rotateX(45deg) rotateY(30deg) rotateZ(15deg);
    }
    50% {
        transform: translate3d(300px, 600px, 0) rotateX(90deg) rotateY(-45deg) rotateZ(-15deg) scale(1.1);
    }
    75% {
        transform: translate3d(-400px, 900px, 0) rotateX(135deg) rotateY(60deg) rotateZ(30deg);
    }
    100% {
        transform: translate3d(500px, 1200px, 0) rotateX(180deg) rotateY(-90deg) rotateZ(60deg);
        opacity: 0;
    }
`;

const Leaf = styled.div<{is3DAnimation: boolean}>`
  display: inline-block;
  width: 20px;
  height: 40px;
  background: linear-gradient(to bottom, rgb(122, 0, 204), rgb(69, 0, 122));
  clip-path: polygon(50% 0%, 100% 75%, 50% 100%, 0% 75%);
  position: absolute; /* Позиционирование для размещения по X */
  top: 0;
  left: 50%; /* Центр по умолчанию */
  transform-origin: center; /* Центр вращения */
  animation: ${({is3DAnimation}) => (is3DAnimation ? falling3D : falling2D)} infinite ease-in-out;
  animation-fill-mode: both;

  &:before {
    content: '';
    position: absolute;
    width: 10px;
    height: 15px;
    top: 5px;
    left: 5px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.5), transparent);
    border-radius: 50%;
    transform: rotate(-30deg);
  }

  &:after {
    content: '';
    position: absolute;
    width: 2px;
    height: 20px;
    background: rgba(255, 255, 255, 0.3);
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
`;

const Title = styled.h1`
  ${welcomeTitleStyles};
`;

const Inside = styled(Button)`
  &.MuiButtonBase-root {
    ${font_body_2_reg};
    color: ${({theme}) => theme.colors.gray000};
    background: linear-gradient(45deg, rgb(69, 0, 122), rgb(255, 0, 255));
    border-radius: 30px;
    padding: 0.75rem 2rem;
    ${font_header_6_bold};
    text-transform: uppercase;
    box-shadow:
      0 4px 6px rgba(0, 0, 0, 0.3),
      0 0 10px rgb(69, 0, 122);
    transition: all 0.3s ease;

    &:hover {
      box-shadow:
        0 6px 10px rgba(0, 0, 0, 0.5),
        0 0 20px rgb(122, 0, 204);
      transform: translateY(-3px);
    }

    &:active {
      transform: translateY(1px);
      box-shadow:
        0 3px 6px rgba(0, 0, 0, 0.2),
        0 0 15px rgb(122, 0, 204);
    }
  }
`;

const StatusText = styled.p<{iserror?: boolean}>`
  margin-top: 1rem;
  font-size: 0.875rem;
  color: ${({iserror}) => (iserror ? '#ff6b6b' : 'rgba(255, 255, 255, 0.8)')};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const RetryLink = styled.span`
  text-decoration: underline;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    color: #fff;
  }
`;

export default WelcomeView;
