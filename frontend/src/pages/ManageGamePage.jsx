import * as React from 'react';
import { useEffect } from 'react';
import { useContext, Context } from '../context';
import Navbar from '../components/Navbar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Page where the admin can go to advance/end the quiz
export const ManageGamePage = () => {
  const url = window.location.href;
  const quizId = url.split('/')[4];
  const { token } = useContext(Context);
  const [sessionData, setSessionData] = React.useState(undefined);
  const [quizEnded, setQuizEnded] = React.useState(false);
  const [question, setQuestion] = React.useState('');
  const [advance, setAdvance] = React.useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('id');

  // fetch API to get the session data. Need this to process the question & position of the quiz
  const getSessionData = async () => {
    const response = await fetch(`http://localhost:5005/admin/session/${sessionId}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      setSessionData(data);
      return data;
    }
  }

  // Display the current question on the screen.
  // If quiz has ended or hasn't started, display the appropriate text.
  const getQuestion = (data) => {
    if (data === undefined) getSessionData();
    if (data !== undefined) {
      const position = data.results.position;
      if (position > data.results.questions.length - 1) {
        setQuizEnded(true);
        setQuestion('Quiz Ended');
      } else if (position !== -1) {
        const questions = data.results.questions;
        setQuestion(`Q${position + 1}: ${questions[position].question}`);
      } else {
        setQuestion('Players Waiting in Lobby. Advance Quiz When Ready');
      }
    }
  }

  // Update the question on the screen every time the quiz gets advanced.
  useEffect(async () => {
    const data = await getSessionData();
    getQuestion(data);
  }, [advance]);

  // helper function to get the number of questions within the quiz.
  const numberOfQuestions = () => {
    if (sessionData !== undefined) return sessionData.results.questions.length;
  }

  // fetch API to advance the quiz to the next question/end quiz.
  const advanceQuiz = async () => {
    if (quizEnded === true) navigate(`/quiz/${quizId}/results?id=${sessionId}`)
    else {
      const response = await fetch(`http://localhost:5005/admin/quiz/${quizId}/advance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        }
      })
      if (response.status === 200) setAdvance(advance + 1);
    }
  }

  // fetch API to end the quiz.
  const endQuiz = async () => {
    if (window.confirm('Are you sure you want to end this Quiz?')) {
      await fetch(`http://localhost:5005/admin/quiz/${quizId}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
      });
      navigate(`/quiz/${quizId}/results?id=${sessionId}`);
    }
  }

  // helper function to change the button text depending on the state of the quiz.
  const handleButtonText = () => {
    if (quizEnded === true) return ('View Results');
    else return ('Advance Quiz');
  }

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      height: '100vh',
      alignItems: 'center',
      flexDirection: 'column',
    },
    text: {
      marginBottom: '30px',
    },
    question: {
      marginBottom: '50px',
    },
    questionText: {
      fontSize: '25px',
      textAlign: 'center',
    },
    buttons: {
      display: 'flex',
      gap: '10px',
    },
    button: {
      width: '180px',
    }
  };

  return (
    <>
      <Navbar />
      <main style={styles.container}>
        <Typography sx={styles.text}>Current Question</Typography>
        <Box sx={styles.question}>
          <Typography sx={styles.questionText}>{question}</Typography>
        </Box>
        <Typography sx={styles.text}>Total Questions: {numberOfQuestions()}</Typography>
        <Box sx={styles.buttons}>
          <Button
            size='large'
            variant='contained'
            aria-label="Button to advance to the next question"
            sx={ styles.button }
            onClick={advanceQuiz}>
              {handleButtonText()}</Button>
          <Button size='large'
            variant='outlined'
            aria-label="Button to end the quiz"
            sx={ styles.button }
            onClick={endQuiz}>
              End Quiz</Button>
        </Box>
      </main>
    </>
  )
}

export default ManageGamePage;
