import {FC, ChangeEvent} from 'react';
import styled from 'styled-components';
import Switch from '@mui/material/Switch';

interface Props {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const StyledSwitch: FC<Props> = ({checked, disabled, onChange, ...other}) => (
  <Wrapper checked={checked} disabled={disabled} onChange={onChange} {...other} />
);

const Wrapper = styled(Switch)`
  &.MuiSwitch-root {
    width: 66px;
    height: 30px;
    padding: 0;
    display: flex;

    .MuiSwitch-switchBase {
      padding: 2px;

      &.Mui-checked {
        transform: translateX(34px);
        color: rgb(253, 253, 253);

        & + .MuiSwitch-track {
          opacity: 1;
        }
      }
    }

    .MuiSwitch-thumb {
      width: 26px;
      height: 26px;
      transform: translateX(1px);
    }

    .MuiSwitch-track {
      border-radius: 18px;
      opacity: 1;
      box-sizing: border-box;
      background-color: rgb(205, 210, 218);
    }
  }
`;

export default StyledSwitch;
