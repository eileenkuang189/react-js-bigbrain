import * as React from 'react';
import { Button, TextField } from '@mui/material';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import { useLocation, useNavigate } from 'react-router-dom'

const PlayPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialsessionId = new URLSearchParams(location.search).get('pin') || '';
  const [sessionId, setSessionId] = React.useState(initialsessionId);
  const [name, setName] = React.useState('');

  const handleSubmit = async () => {
    // join game using the game pin (sessionId)
    const response = await fetch(`http://localhost:5005/play/join/${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    })
    if (response.status === 200) {
      const sessionData = await response.json();
      // Check if sesssion is already started
      const gameStatus = await fetch(`http://localhost:5005/play/${sessionData.playerId}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).catch((err) => console.log(err));
      if (gameStatus.status === 200) {
        const statusData = await gameStatus.json();
        if (!statusData.started) {
          navigate(`/play/${sessionId}/lobby/${sessionData.playerId}?name=${name}`);
        } else {
          alert('Game is already started')
        }
      }
    } else {
      alert('Invalid Session ID');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#381272',
        flexFlow: 'column wrap',
      }}
    >
      <Typography variant='h3' color='white' sx={{ pb: 2 }}>BigBrain!</Typography>
      <Container component='main' maxWidth='xs'>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#FFFFFF',
            p: 4,
            borderRadius: 2,
          }}
        >
          <TextField
            label='Enter Session ID'
            name='sessionID'
            required
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            variant='outlined'
            margin='normal'
            aria-label="input field to put the session ID"
            fullWidth
          />
          <TextField
            label='Enter Name'
            name='play-name'
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant='outlined'
            margin='normal'
            aria-label="input field to put your name"
            fullWidth
          />
          <Button
            variant='contained'
            sx={{ backgroundColor: '#333333' }}
            type='submit'
            fullWidth
            aria-label="Button to join the game"
            onClick={handleSubmit}
          >
            Enter
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default PlayPage;
