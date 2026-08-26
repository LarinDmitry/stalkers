import React, {FC} from 'react';
import {useNavigate} from 'react-router';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import {useAppSelector} from 'services/hooks';
import {selectUserConfiguration} from 'store/userSlice';
import {globalLocalization} from 'services/GlobalUtils';
import Arrow from 'assets/icons/arrow.svg';
import {font_body_4_reg} from 'theme/fonts';

interface Props {
  to?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const BackBtn: FC<Props> = ({to, onClick, disabled}) => {
  const navigate = useNavigate();
  const {language} = useAppSelector(selectUserConfiguration);
  const {BACK} = globalLocalization(language);

  return (
    <Wrapper onClick={() => (onClick ? onClick() : to ? navigate(to) : navigate(-1))} disabled={disabled}>
      <Icon>
        <Arrow />
      </Icon>
      {BACK}
    </Wrapper>
  );
};

const Wrapper = styled(Button)`
  &.MuiButtonBase-root {
    width: 5rem;
    ${font_body_4_reg};
    color: ${({theme}) => theme.colors.gray000};
    background: ${({theme}) => theme.colors.blue100};
    border-radius: 16px;
    text-transform: inherit;

    &:hover {
      background: ${({theme}) => theme.colors.blue100};
    }

    &.Mui-disabled {
      color: rgba(255, 255, 255, 0.6);
      background: ${({theme}) => theme.colors.gray080};
    }
  }
`;

const Icon = styled(SvgIcon)`
  &.MuiSvgIcon-root {
    width: 1rem;
    height: 1rem;
    cursor: pointer;
    fill: ${({theme}) => theme.colors.gray000};
    transform: rotate(90deg);
  }
`;

export default BackBtn;
