import React, {useState, useEffect, FC, FormEvent} from 'react';
import styled from 'styled-components';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from 'assets/icons/close.svg';
import {useAppSelector} from 'services/hooks';
import {selectUserConfiguration} from 'store/userSlice';
import {globalLocalization} from 'services/GlobalUtils';
import {localization} from '../UserDamageUtils';

const DAYS_COUNT = 6;

interface Props {
  open: boolean;
  userName: string;
  initialValues?: number[];
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (damageByDay: number[]) => void;
}

const DamageModal: FC<Props> = ({open, userName, initialValues, isLoading, onClose, onSubmit}) => {
  const {language} = useAppSelector(selectUserConfiguration);
  const {EDIT} = localization(language);
  const {USER_TOTAL, CANCEL, SAVE} = globalLocalization(language);

  const [days, setDays] = useState<string[]>(Array(DAYS_COUNT).fill(''));

  useEffect(() => {
    setDays(
      initialValues && initialValues.length > 0
        ? initialValues.map((val) => (val ? String(val) : ''))
        : Array(DAYS_COUNT).fill('')
    );
  }, [initialValues, open]);

  const handleInputChange = (i: number, value: string) => {
    const cleanVal = value.replace(/\D/g, '');
    const newDays = [...days];
    newDays[i] = cleanVal;
    setDays(newDays);
  };

  const totalDamage = days.reduce((acc, curr) => acc + (Number(curr) || 0), 0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(days.map((d) => Number(d) || 0));
  };

  return (
    <Wrapper open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Header>
        <Title>
          <SubTitle>
            {EDIT} <User>{userName}</User>
          </SubTitle>
        </Title>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Header>

      <Form onSubmit={handleSubmit}>
        <Content>
          <InputsColumn>
            {days.map((val, idx) => (
              <InputRow key={idx}>
                <DayLabel>Day {idx + 1}</DayLabel>
                <TextField
                  size="small"
                  value={val}
                  onChange={({target: {value}}) => handleInputChange(idx, value)}
                  placeholder="0"
                  variant="outlined"
                  fullWidth
                />
              </InputRow>
            ))}
            <Total>
              <Label>{USER_TOTAL}</Label>
              <Value>{totalDamage.toLocaleString()}</Value>
            </Total>
          </InputsColumn>
        </Content>

        <Footer>
          <Button variant="outlined" onClick={onClose} disabled={isLoading}>
            {CANCEL}
          </Button>
          <Button variant="contained" color="primary" type="submit" disabled={isLoading}>
            {SAVE}
          </Button>
        </Footer>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled(Dialog)`
  .MuiPaper-root {
    border-radius: 16px;
    padding: 1.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const SubTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
`;

const User = styled.span`
  margin-left: 0.25rem;
  font-size: 1.25rem;
  font-weight: bold;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const InputsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const DayLabel = styled.div`
  min-width: 50px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const Total = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.5rem;
  border-top: 1px solid ${({theme}) => theme.colors.gray090};
  margin-top: 0.25rem;
`;

const Label = styled.span`
  font-weight: bold;
`;

const Value = styled.span`
  font-weight: bold;
  font-size: 1.1rem;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
`;

export default DamageModal;
