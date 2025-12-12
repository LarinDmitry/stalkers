import React, {FC} from 'react';
import styled from 'styled-components';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {useAppDispatch} from 'services/hooks';
import {welcomeTitleStyles} from 'services/GlobalStyled';
import {setLanguage} from 'store/userSlice';
import {languageOptions} from 'services/GlobalUtils';

interface Props {
  language: string;
}

const LanguageSelector: FC<Props> = ({language}) => {
  const dispatch = useAppDispatch();

  return (
    <Wrapper value={language} onChange={({target: {value}}) => dispatch(setLanguage(value as string))}>
      {languageOptions.map(({value, label, img}) => (
        <MenuItem key={value} value={value}>
          <Image>{img}</Image>
          <Label>{label}</Label>
        </MenuItem>
      ))}
    </Wrapper>
  );
};

const Image = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
`;

const Label = styled.div``;

const Wrapper = styled(Select)`
  &.MuiInputBase-root {
    z-index: 1;
    position: absolute;
    top: 1rem;
    right: 2rem;
    color: ${({theme}) => theme.colors.gray000};
    outline: none;

    & > div.MuiSelect-select {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 7rem;
    }

    .MuiSvgIcon-root.MuiSelect-icon {
      display: none;
    }

    & > fieldset {
      border: none;
    }

    ${Image} {
      margin-right: 0;
    }

    ${Label} {
      ${welcomeTitleStyles};
      margin: 0;
      font-size: 1rem;
    }
  }
`;

export default LanguageSelector;
