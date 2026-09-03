import React, {useState, FormEvent, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router';
import ReactGA from 'react-ga4';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import {globalLocalization, loginAdmin} from 'services/GlobalUtils';
import {font_header_5_bold} from 'theme/fonts';
import {useAppSelector} from 'services/hooks';
import {selectUserConfiguration} from 'store/userSlice';

const LoginView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {language} = useAppSelector(selectUserConfiguration);
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    ReactGA.send({hitType: 'login', page: location.pathname});
  }, [location.pathname]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    loginAdmin(login, password) ? navigate('/admin') : setError(true);
  };

  const {ADMIN_ENTER, ERROR_DATA, LOGIN, PASSWORD, ENTER} = globalLocalization(language);

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <Title>{ADMIN_ENTER}</Title>
        {error && <Alert severity="error">{ERROR_DATA}</Alert>}
        <TextField
          label={LOGIN}
          variant="outlined"
          value={login}
          onChange={({target: {value}}) => setLogin(value)}
          fullWidth
          required
        />
        <TextField
          label={PASSWORD}
          type="password"
          variant="outlined"
          value={password}
          onChange={({target: {value}}) => setPassword(value)}
          fullWidth
          required
        />
        <Btn variant="contained" type="submit" size="large" fullWidth>
          {ENTER}
        </Btn>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: rgb(14, 30, 73);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 28rem;
  padding: 2.5rem;
  background-color: ${({theme}) => theme.colors.gray050};
  border-radius: 12px;
`;

const Title = styled.div`
  ${font_header_5_bold};
  text-align: center;
`;

const Btn = styled(Button)`
  &.MuiButton-root {
    background: ${({theme}) => theme.colors.blue100};
  }
`;

export default LoginView;
