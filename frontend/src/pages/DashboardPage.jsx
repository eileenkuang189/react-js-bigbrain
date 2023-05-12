import * as React from 'react';
import { useEffect } from 'react';
import defaultThumbnail from '../assets/bigbrain_default.png'
import Navbar from '../components/Navbar';
import StartQuizDialogWrapper from '../components/StartQuizDialogWrapper';
import { useContext, Context } from '../context';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';

// dialog for when the new quiz button is pressed. Have input to create a new quiz.
const NewQuizDialog = (props) => {
  const { onClose, open, handleLoad } = props;
  const [name, setName] = React.useState('');
  const { token } = useContext(Context);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (event) => {
    await fetch('http://localhost:5005/admin/quiz/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({ name })
    })
    handleClose();
    handleLoad();
  }

  const handleNameChange = (event) => setName(event.target.value)

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'sm'} fullWidth>
      <DialogTitle sx={{ textAlign: 'center', fontSize: '30px' }}>New BigBrain Quiz</DialogTitle>
      <DialogContent>
        <TextField
          id='name'
          label='Quiz Name'
          fullWidth
          margin='normal'
          name='new-quiz-name'
          aria-label="field to put the name of the new quiz"
          onChange={handleNameChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} aria-label="Button to cancel the process of making a new quiz">Cancel</Button>
        <Button name='create-quiz' onClick={handleSubmit} aria-label="Button to create a new quiz">Create</Button>
      </DialogActions>
    </Dialog>
  );
}

// Dashboard Page
export const DashboardPage = () => {
  const [NewQuizOpen, setNewQuizOpen] = React.useState(false);
  const [StartQuizOpen, setStartQuizOpen] = React.useState(false);
  const [quizzes, setQuizzes] = React.useState([]);
  const [quizData, setQuizData] = React.useState({});
  const [sessionId, setSessionId] = React.useState('');
  const { token } = useContext(Context);
  const navigate = useNavigate();

  // on load, fetch quiz data from database
  const handleLoad = async () => {
    const response = await fetch('http://localhost:5005/admin/quiz', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
    });
    if (response.status === 200) {
      const quizzesData = await response.json();
      setQuizzes(quizzesData.quizzes);
    }
  };

  useEffect(() => {
    handleLoad();
  }, [token]);

  // once all quizzes have been loaded, we need to load each individual quizzes' data
  useEffect(() => {
    const fetchData = async () => {
      const data = {};
      for (const quiz of quizzes) {
        const response = await fetch(`http://localhost:5005/admin/quiz/${quiz.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token
          },
        });
        const quizData = await response.json();
        data[quiz.id] = quizData;
      }
      setQuizData(data);
    };
    fetchData();
  }, [quizzes, token]);

  // fetch API to delete a quiz. Reload dashboard after deleting a quiz.
  const handleQuizDelete = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this Quiz?')) {
      const response = await fetch(`http://localhost:5005/admin/quiz/${quizId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
      });
      if (response.status === 200) {
        handleLoad();
      }
    }
  }

  // fetch API for getting the session ID. For when we want to copy the session ID to players.
  const getSessionId = async (quizId) => {
    const response = await fetch(`http://localhost:5005/admin/quiz/${quizId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
    });
    if (response.status === 200) {
      const sessionId = await response.json();
      setSessionId(sessionId.active);
    }
  }

  // fetch API for starting a quiz session. Display startQuiz dialog if successful. Also ends the session if there is one already running.
  const handleStartQuiz = async (quiz, quizId) => {
    if (quiz.active !== null) {
      if (window.confirm('Are you sure you want to end this Quiz?')) {
        const end = await fetch(`http://localhost:5005/admin/quiz/${quizId}/end`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token
          },
        });
        if (end.status === 200) {
          if (window.confirm('Would you like to view the results?')) {
            navigate(`/quiz/${quizId}/results?id=${sessionId}`);
          }
        }
      }
    } else {
      const start = await fetch(`http://localhost:5005/admin/quiz/${quizId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
      });
      if (start.status === 200) {
        // display popup with session ID & copy link
        getSessionId(quizId);
        setStartQuizOpen(true);
      }
    }
    handleLoad();
  }

  // helper function to change the text on the start/end quiz button
  const handleStartQuizText = (quiz) => {
    if (quiz.active !== null) return ('End Quiz');
    else return ('Start Quiz');
  }

  // return the total quiz time. Displays in minutes and seconds
  const totalQuizTime = (questions) => {
    let totalTime = 0;
    if (questions) {
      questions.forEach((question) => {
        if (question.timeLimit) {
          totalTime += (question.timeLimit)
        }
      })
    }
    const minutes = Math.floor(totalTime / 60);
    const seconds = Math.floor(totalTime % 60);
    return <Typography>Total Time: <b>{minutes} min {seconds} s</b></Typography>;
  }

  // setter code
  const handleNewQuizOpen = () => setNewQuizOpen(true);
  const handleNewQuizClose = () => setNewQuizOpen(false);
  const handleStartQuizClose = () => setStartQuizOpen(false);

  const styles = {
    containerButton: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '1rem',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
  }

  return (
    <>
      <Navbar />
      <main>
        <Box sx={{ pt: 12 }}>
          <Container>
            <Typography
              variant='h2'
              align='center'
              color='text.primary'
              gutterBottom
            >
              Admin Dashboard
            </Typography>
            <Stack
              direction='row'
              spacing={2}
              justifyContent='center'
            >
              <Button
                variant='contained'
                name='new-quiz'
                onClick={handleNewQuizOpen}
                aria-label="Button to open Dialog to create new quiz">
                  New Quiz</Button>
              <NewQuizDialog
                open={NewQuizOpen}
                onClose={handleNewQuizClose}
                handleLoad={handleLoad}
              />
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth='md'>
          <Grid container spacing={4}>
            {quizzes.map((quiz) => (
              <Grid item key={quiz.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component='img'
                    image={quiz.thumbnail || defaultThumbnail}
                    sx={{ height: 150, width: 'auto' }}
                    alt='quiz thumbnail'
                  />
                  <CardContent>
                    <Typography gutterBottom variant='h5' component='h2'><b>{quiz.name}</b></Typography>
                    <Typography>Number of Questions: <b>{JSON.stringify(quizData[quiz.id]?.questions.length)}</b></Typography>
                    {totalQuizTime(quizData[quiz.id]?.questions)}
                    <Typography>Plays: <b>{JSON.stringify(quizData[quiz.id]?.oldSessions.length)}</b></Typography>
                  </CardContent>
                  <CardActions>
                    <Box sx={ styles.container }>
                      <Box sx={ styles.containerButton }>
                        <Button size='small' name='update-quiz' aria-label="Button to navigate to the update quiz page" onClick={() => navigate(`/quiz/${quiz.id}`)}>Update</Button>
                        <Button size='small' name='delete-quiz' aria-label="Button to delete the quiz" onClick={() => handleQuizDelete(quiz.id)}>Delete</Button>
                        <Button size='small' name='old-results' aria-label="Button to navigate to the old results page" onClick={() => navigate(`/quiz/${quiz.id}/results/all`)}>Old Results</Button>
                      </Box>
                      <Box sx={{ display: 'flex', gap: '5px' }} marginBottom={1}>
                        <Button size='small' name='start-quiz' aria-label="Button to start/end the quiz" variant='contained' onClick={() => handleStartQuiz(quiz, quiz.id)} sx={{ flexGrow: 1 }}>
                          {handleStartQuizText(quiz)}
                        </Button>
                        {sessionId && (
                          <StartQuizDialogWrapper
                            open={StartQuizOpen}
                            onClose={handleStartQuizClose}
                            sessionId={sessionId}
                          />
                        )}
                        {(quiz.active !== null) && (
                            <Button size='small' variant='contained' aria-label="Button to go to the manage quiz page" onClick={() => navigate(`/quiz/${quiz.id}/manage?id=${quiz.active}`)} sx={{ flexGrow: 0.5 }}>Manage Quiz</Button>
                        )}
                      </Box>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </>
  )
}

export default DashboardPage;
