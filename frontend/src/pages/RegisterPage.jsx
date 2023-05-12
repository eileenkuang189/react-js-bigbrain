import * as React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import PsychologyIcon from '@mui/icons-material/Psychology';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

// Register Page for an user to sign up to be an admin
export const RegisterPage = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');

  // fetch API for when the user submits their details and seeks to be registered.
  const handleSubmit = async (event) => {
    const response = await fetch('http://localhost:5005/admin/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, name })
    });
    if (response.status === 200) alert(`Successfully registered ${name}`)
    else alert('Invalid registration');
  };

  // setters
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleNameChange = (event) => setName(event.target.value);

  return (
    <Container component='main' maxWidth='xs'>
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
        <Typography component='h1' variant='h3'>BigBrain</Typography>
        <Typography component='h1' variant='h6'>Register</Typography>
        <TextField
          margin='normal'
          required
          fullWidth
          id='register-name'
          label='First Name'
          name='register-name'
          aria-label="label to register your first name"
          onChange={handleNameChange}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='register-email'
          label='Email Address'
          name='register-email'
          aria-label="label to register your email address"
          onChange={handleEmailChange}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='register-password'
          label='Password'
          type='password'
          name='register-password'
          aria-label="label to register your password"
          onChange={handlePasswordChange}
        />
        <Button
          type='submit'
          fullWidth
          variant='contained'
          aria-label="Button to submit your registration"
          sx={{ mt: 3, mb: 2, backgroundColor: '#381272' }}
          onClick={handleSubmit}
        >
          Register
        </Button>
        <Link to='/' name='link' variant='body2' sx={{ color: '#381272' }}>
          {'Already have an account? Sign in'}
        </Link>
      </Box>
    </Container>
  );
}

export default RegisterPage;
