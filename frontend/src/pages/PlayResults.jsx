import * as React from 'react';
import Navbar from '../components/Navbar';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

// For a question and its question number, displays the question, if it was answered correctly
// and player response time.
const Question = ({ question, num }) => {
  const questionStartedAt = new Date(question.questionStartedAt);
  const answeredAt = new Date(question.answeredAt);
  const diffInSeconds = (answeredAt - questionStartedAt) / 1000;

  const styles = {
    questionContainer: {
      display: 'flex',
      justifyContent: 'center',
    },
  }

  return (
    <Box mt={2}>
      <Paper variant='outlined' sx={{ width: 500 }}>
        <Box sx= {{ ...styles.questionContainer, p: 2 }}>
          <Typography variant='h5'>Question {num}.</Typography>
          {question.correct ? <CheckIcon fontSize='large'/> : <ClearIcon fontSize='large'/>}
        </Box>
        <Typography p={2} variant='h6'>Time taken: {diffInSeconds} seconds</Typography>
      </Paper>
    </Box>
  );
};

// PlayResults page for when a player finishes playing the quiz.
// Show a breakdown of the questions, whether they got it right or wrong & response time.
export const PlayResults = () => {
  const url = window.location.href;
  const quizId = url.split('/')[4];
  const playerId = url.split('/')[6];
  const [results, setResults] = React.useState([]);

  React.useEffect(() => {
    const getResults = async () => {
      const response = await fetch(`http://localhost:5005/play/${playerId}/results`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 200) {
        const data = await response.json();
        setResults(data);
      }
    }
    getResults();
  }, [])

  return (
    <>
    <Navbar />
    <main>
        <Box sx={{ pt: 12 }}>
          <Container component='main' maxWidth='md'>
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                outline: '1px solid lightgray',
              }}
            >
              <Avatar sx={{ m: 3, bgcolor: '#381272' }}>
                <AssignmentIcon />
              </Avatar>
              <Typography variant='h4' sx={{ pb: 2 }}>Results</Typography>
              <Typography variant='h6' sx={{ pb: 2 }}>Quiz ID: <b>{quizId}</b></Typography>
              <Typography variant='h6' sx={{ pb: 2 }}>Player ID: <b>{playerId}</b></Typography>
              {results.map((q, i) => (
                <Question key={i} question={q} num={i + 1} />
              ))}
              <Typography variant='body2' sx={{ p: 2 }}>Note: Score is calculated by ((Time Remaining) / (Total Time Limit)) * 100 * (Scoring System), where scoring system is double points, standard points, or no points.</Typography>
            </Box>
          </Container>
        </Box>
      </main>
    </>
  );
}

export default PlayResults;
