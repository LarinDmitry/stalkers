import React, {useState, FormEvent, FC} from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import BackBtn from 'components/GeneralComponents/BackBtn';
import BaseLoader from 'components/GeneralComponents/BaseLoader';
import {StatisticItem, CreateStatisticPayload} from 'api/statistic';
import {DATE_REGEX, FormState, INITIAL_FORM_STATE} from '../ZvekUtils';
import {font_header_5_bold} from 'theme/fonts';
import {globalLocalization} from 'services/GlobalUtils';
import {useAppSelector} from 'services/hooks';
import {selectUserConfiguration} from 'store/userSlice';

interface Props {
  initialValues?: StatisticItem | null;
  isLoading: boolean;
  onSubmit: (data: CreateStatisticPayload) => void;
  onCancel: () => void;
}

const StatisticForm: FC<Props> = ({initialValues, isLoading, onSubmit, onCancel}) => {
  const {language} = useAppSelector(selectUserConfiguration);
  const {ADD, EDIT, DATA, TOTAL, CREATE_ENTITY, SAVE, NEW, RATE, DATE_ERR, DATE_HINT} = globalLocalization(language);

  const [formData, setFormData] = useState<FormState>(() => {
    if (initialValues) {
      return {
        date: initialValues.date ?? '',
        total: initialValues.total !== undefined ? String(initialValues.total) : '',
        rate: initialValues.rate !== undefined ? String(initialValues.rate) : '',
        newbies: initialValues.newbies !== undefined ? String(initialValues.newbies) : '',
      };
    }
    return INITIAL_FORM_STATE;
  });

  const [dateError, setDateError] = useState<string>('');

  const handleDateChange = (val: string) => {
    let cleanVal = val.replace(/[^\d.]/g, '');

    if (cleanVal.length === 2 && !cleanVal.includes('.')) {
      cleanVal = `${cleanVal}.`;
    }

    if (cleanVal.length > 5) return;

    setFormData({...formData, date: cleanVal});
    DATE_REGEX.test(cleanVal) || (cleanVal === '' && setDateError(''));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!DATE_REGEX.test(formData.date)) {
      setDateError(`${DATE_ERR}. ${DATE_HINT}`);
      return;
    }

    const payload: CreateStatisticPayload = {
      date: formData.date,
      total: formData.total,
      rate: Number(formData.rate),
      newbies: Number(formData.newbies),
    };

    onSubmit(payload);
  };

  return (
    <Wrapper onSubmit={handleSubmit} as="form">
      <HeaderRow>
        <BackBtn to="/zvek" onClick={onCancel} disabled={isLoading} />
      </HeaderRow>
      <Title>{initialValues ? `${EDIT}: ${initialValues.date}` : ADD}</Title>

      <FormGrid>
        <TextField
          label={DATA}
          variant="outlined"
          placeholder="01.26"
          value={formData.date}
          onChange={({target: {value}}) => handleDateChange(value)}
          error={Boolean(dateError)}
          helperText={dateError || DATE_HINT}
          required
          fullWidth
        />

        <TextField
          label={TOTAL}
          variant="outlined"
          value={formData.total}
          onChange={({target: {value}}) => setFormData({...formData, total: value})}
          required
          fullWidth
        />

        <TextField
          label={RATE}
          variant="outlined"
          value={formData.rate}
          onChange={({target: {value}}) => setFormData({...formData, rate: value})}
          required
          fullWidth
        />

        <TextField
          label={NEW}
          variant="outlined"
          value={formData.newbies}
          onChange={({target: {value}}) => setFormData({...formData, newbies: value})}
          required
          fullWidth
        />
      </FormGrid>

      <FormFooter>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          size="large"
          disabled={isLoading}
          startIcon={isLoading && <BaseLoader />}
        >
          {initialValues ? SAVE : CREATE_ENTITY}
        </Button>
      </FormFooter>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100vh;
  background: ${({theme}) => theme.colors.gray000};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const Title = styled.div`
  ${font_header_5_bold};
  margin: 1.5rem 0 1rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media ${({theme}) => theme.breakpoints.maxTb} {
    grid-template-columns: 1fr;
  }
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default StatisticForm;
