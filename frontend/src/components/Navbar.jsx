import * as React from 'react';
import { useContext, Context, initialValue } from '../context';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';

// create a navbar with home & log out buttons
export const Navbar = () => {
  const { token, setToken } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = async (event) => {
    const response = await fetch('http://localhost:5005/admin/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
    });
    if (response.status === 200) {
      setToken(initialValue.token);
      navigate('/');
    }
  }
  const handleHome = () => {
    navigate('/dashboard');
  }

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#381272' }}>
      <Toolbar>
        <Button
          size="large"
          color="inherit"
          aria-label="Button to navigate back to dashboard"
          startIcon={<HomeIcon />}
          name='navbar-home'
          sx={{ mr: 2 }}
          onClick={handleHome}
        >
        </Button>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          BigBrain
        </Typography>
        <Button
          color="inherit"
          name='log-out'
          aria-label="Button to log out. Navigate back to the login page"
          onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
