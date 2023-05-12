import * as React from 'react';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useContext, Context } from '../context';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

// Old Results Page for the admin to view the results of past sessions.
export const OldResultsPage = () => {
  const { token } = useContext(Context);
  const url = window.location.href;
  const quizId = url.split('/')[4];
  const [sessions, setSessions] = React.useState([]);
  const navigate = useNavigate();

  // fetch API to receive a list of all past sessions.
  const getResultsData = async () => {
    const response = await fetch(`http://localhost:5005/admin/quiz/${quizId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      setSessions(data.oldSessions);
    }
  }

  useEffect(() => {
    getResultsData();
  }, [quizId]);

  const styles = {
    container: {
      paddingTop: '8em',
      textAlign: 'center',
    },
    boxContainer: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
    }
  }

  return (
    <>
      <Navbar />
      <main>
        <Container component='main' maxWidth='md' sx={ styles.container }>
          <Paper variant='outlined'>
            <Typography variant='h4' sx={{ p: 2 }}>Old Results</Typography>
            <Divider />
            <Box sx={styles.boxContainer}>
              {sessions.map((session, i) => (
                <Button
                  key={i}
                  aria-label="Button to navigate to the session's results"
                  onClick={() => navigate(`/quiz/${quizId}/results?id=${session}`)}>
                    {session}
                </Button>
              ))}
            </Box>
          </Paper>
        </Container>
      </main>
    </>
  )
}

export default OldResultsPage;
