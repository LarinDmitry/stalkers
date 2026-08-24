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
}

const BackBtn: FC<Props> = ({to}) => {
  const navigate = useNavigate();
  const {language} = useAppSelector(selectUserConfiguration);
  const {BACK} = globalLocalization(language);

  return (
    <Wrapper onClick={() => navigate(to || '/dashboard')}>
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
