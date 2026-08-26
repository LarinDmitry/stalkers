import React, {useState, FormEvent} from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Switch from 'components/GeneralComponents/Switch';
import BackBtn from 'components/GeneralComponents/BackBtn';
import BaseLoader from 'components/GeneralComponents/BaseLoader';
import {HERO_OPTIONS, INITIAL_USER_FORM, QUALITY_OPTIONS} from '../UsersUtils';
import {UsersDetails, CreateUserPayload} from 'api/users';
import {font_header_5_bold} from 'theme/fonts';
import {useAppSelector} from 'services/hooks';
import {selectUserConfiguration} from 'store/userSlice';
import {getImageComponent, globalLocalization, heroImages, qualityImages} from 'services/GlobalUtils';
import {localization} from '../UsersUtils';

interface UserFormProps {
  initialValues?: UsersDetails | null;
  isLoading: boolean;
  onSubmit: (data: CreateUserPayload) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({initialValues, isLoading, onSubmit, onCancel}) => {
  const {language} = useAppSelector(selectUserConfiguration);
  const {SAVE, CREATE_USER, EDIT_USER} = localization(language);
  const {NICKNAME, TEMPLE, QUALITY, HERO, STARS, STATUS} = globalLocalization(language);

  const [formData, setFormData] = useState<CreateUserPayload>(() => {
    if (initialValues) {
      return {
        name: initialValues.name,
        damageDealer: initialValues.damageDealer,
        quality: initialValues.quality,
        stars: initialValues.stars,
        temple: initialValues.temple,
        isActive: initialValues.isActive,
      };
    }
    return INITIAL_USER_FORM;
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Wrapper onSubmit={handleSubmit} as="form">
      <HeaderRow>
        <BackBtn to="/admin/users" onClick={onCancel} disabled={isLoading} />
      </HeaderRow>
      <Title>{initialValues ? `${EDIT_USER}: ${initialValues.name}` : CREATE_USER}</Title>

      <FormGrid>
        <TextField
          label={NICKNAME}
          variant="outlined"
          value={formData.name}
          onChange={({target: {value}}) => setFormData({...formData, name: value})}
          required
          fullWidth
        />

        <SwitchBox>
          {STATUS}
          <Switch
            checked={formData.isActive}
            onChange={({target: {checked}}) => setFormData({...formData, isActive: checked})}
          />
        </SwitchBox>

        <TextField
          select
          label={HERO}
          value={formData.damageDealer}
          onChange={({target: {value}}) => setFormData({...formData, damageDealer: value})}
          fullWidth
          required
        >
          {HERO_OPTIONS.map((hero) => (
            <MenuItem key={hero} value={hero}>
              {getImageComponent(hero || '', heroImages, '')}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label={QUALITY}
          value={formData.quality}
          onChange={({target: {value}}) => setFormData({...formData, quality: value})}
          fullWidth
          required
        >
          {QUALITY_OPTIONS.map((q) => (
            <MenuItem key={q} value={q}>
              {getImageComponent(q, qualityImages)}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label={STARS}
          type="number"
          variant="outlined"
          value={formData.stars}
          onChange={({target: {value}}) => setFormData({...formData, stars: Number(value)})}
          required
          fullWidth
        />

        <TextField
          label={TEMPLE}
          type="number"
          variant="outlined"
          value={formData.temple}
          onChange={({target: {value}}) => setFormData({...formData, temple: Number(value)})}
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
          {initialValues ? SAVE : CREATE_USER}
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
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);.
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

const SwitchBox = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  align-items: center;
`;

export default UserForm;
