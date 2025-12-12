import React, {FC} from 'react';
import styled from 'styled-components';
import {useAppDispatch} from 'services/hooks';
import {DataSource, setDataSource} from 'store/dataSlice';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const sources: DataSource[] = ['ST', 'CLS'];

interface Props {
  selectedSource: string;
}

const DataSelector: FC<Props> = ({selectedSource}) => {
  const dispatch = useAppDispatch();

  return (
    <Wrapper value={selectedSource} onChange={({target: {value}}) => dispatch(setDataSource(value as DataSource))}>
      {sources.map((s) => (
        <MenuItem key={s} value={s}>
          {s}
        </MenuItem>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled(Select)`
  &.MuiInputBase-root {
    z-index: 1;
    position: absolute;
    border: 1px solid;
    top: 2rem;
    left: 4rem;
    color: ${({theme}) => theme.colors.gray000};
    outline: none;

    & > div.MuiSelect-select {
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 2rem;
    }

    .MuiSvgIcon-root.MuiSelect-icon {
      display: none;
    }

    & > fieldset {
      border: none;
    }
  }
`;

export default DataSelector;
