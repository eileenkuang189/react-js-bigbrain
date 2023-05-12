import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PsychologyIcon from '@mui/icons-material/Psychology';

// for the player, when they are waiting for the quiz to start.
const LobbyPage = () => {
  const url = window.location.href;
  const segments = url.split('/');
  const gamepin = segments[4];
  const playerId = segments[segments.length - 1].split('?')[0];
  const name = new URLSearchParams(location.search).get('name');
  const [intervalId, setIntervalId] = React.useState(null);
  const navigate = useNavigate();

  // setInterval to detect whether or not the game has started every 5 seconds
  React.useEffect(() => {
    gameStarted();
    const interval = setInterval(() => {
      gameStarted();
    }, 5000);
    setIntervalId(interval);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    return () => clearInterval(intervalId);
  }, []);

  // fetch API to detect whether or not the game has started. If so, redirect player to Q1.
  const gameStarted = async () => {
    const response = await fetch(`http://localhost:5005/play/${playerId}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch((err) => console.log(err));
    if (response.status === 200) {
      const data = await response.json();
      if (data.started) {
        clearInterval(intervalId);
        navigate(`/play/${gamepin}/question/${playerId}`);
      }
    }
  }

  const styles = {
    root: {
      backgroundColor: '#381272',
      height: '100vh',
    },
    headerBox: {
      marginTop: '0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.5em',
      backgroundColor: '#24076c',
    },
    header: {
      padding: '20px',
      backgroundColor: 'white',
    },
    center: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    bigBrainContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: '20px',
    },
    bigBrain: {
      color: 'white',
      marginBottom: '100px',
      textAlign: 'center',
    },
    waiting: {
      backgroundColor: '#24076c',
      color: 'white',
      padding: '10px',
      textAlign: 'center',
    },
  };

  return (
    <>
      <Container disableGutters maxWidth style={styles.root}>
        <Box
          id='answers'
          role="status"
          aria-label={`Join URL: localhost:3000/play, Game Pin: ${gamepin}`}
          flexDirection={{ xs: 'column', sm: 'row' }}
          height={{ xs: '30vh', sm: '20vh' }}
          sx={{ my: 3, ...styles.headerBox }}>
            <Typography variant='h6' sx={styles.header}>Join at: <b>localhost:300/play</b></Typography>
            <Typography variant='h6' sx={styles.header}>Game Pin: <b>{gamepin}</b></Typography>
        </Box>
        <Box sx={styles.bigBrainContainer}>
          <PsychologyIcon sx={{ color: 'white', height: '50px', width: '50px' }}/>
          <Typography variant='h3' sx={styles.bigBrain}>BigBrain! Lobby</Typography>
          <PsychologyIcon sx={{ color: 'white', height: '50px', width: '50px' }}/>
        </Box>
        <Box sx={styles.center}>
        <Typography variant='h4' sx={styles.waiting}>Waiting For Quiz To Start...</Typography>
        <Typography variant='h5' sx={{ ...styles.bigBrain, mt: 5, mb: 5 }}>Your Name: <span name='your-name'>{name}</span></Typography>
        </Box>
      </Container>
    </>
  );
};

export default LobbyPage;
