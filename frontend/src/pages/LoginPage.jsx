import * as React from 'react';
import { useContext, Context } from '../context';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import PsychologyIcon from '@mui/icons-material/Psychology';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

// login page for the admin
export const LoginPage = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { setToken } = useContext(Context);
  const navigate = useNavigate();

  // fetch API to handle a login. Runs when the user presses the Log In button.
  const handleSubmit = async () => {
    const response = await fetch('http://localhost:5005/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    if (response.status === 200) {
      const data = await response.json();
      setToken(data.token);
      navigate('/dashboard');
    } else alert('Invalid login details');
  };

  // setters
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 3, bgcolor: '#381272' }}>
          <PsychologyIcon />
        </Avatar>
        <Typography component='h1' variant='h3'>
          BigBrain
        </Typography>
        <Typography component='h1' variant='h6'>
          Sign in
        </Typography>
          <TextField
            margin='normal'
            required
            fullWidth
            id='login-email'
            name='login-email'
            aria-label="input field to put login email"
            label='Email Address'
            onChange={handleEmailChange}
            inputProps={{ 'data-testid': 'email-input' }}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            label='Password'
            type='password'
            id='login-password'
            aria-label="input field to put login password"
            name='login-password'
            onChange={handlePasswordChange}
            inputProps={{ 'data-testid': 'password-input' }}
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            aria-label="Button to login"
            sx={{ mt: 3, mb: 2, backgroundColor: '#381272' }}
            onClick={handleSubmit}
          >
            Sign In
          </Button>
          <Link
            to='/register'
            aria-label="link to go to register an account"
            variant='body2'
            sx={{ color: '#381272' }}>
              {"Don't have an account? Register"}
          </Link>
        </Box>
    </Container>
  );
}

export default LoginPage;
