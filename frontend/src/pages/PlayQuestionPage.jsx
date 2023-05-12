import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

const styles = {
  root: {
    backgroundColor: '#f2f2f2',
    height: '100vh',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    maxWidth: '400px',
    maxHeight: '400px',
  },
  video: {
    width: '400px',
    height: '300px',
  },
  iframe: {
    width: '100%',
    height: '100%',
  },
  smallImage: {
    width: '160px',
    height: '160px',
  }
}

const colors = ['#e21c3d', '#1468d0', '#da9e04', '#288a0c', '#0fa3a3', '#854cbf'];

const PlayQuestionPage = () => {
  const url = window.location.href;
  const segments = url.split('/');
  const gamepin = segments[4];
  const playerId = segments[6];
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Question Data
  const [question, setQuestion] = React.useState('');
  const [questionType, setQuestionType] = React.useState('');
  const [time, setTime] = React.useState(10);
  const [timeQuestionStarted, setTimeQuestionStarted] = React.useState('')
  const [points, setPoints] = React.useState('standard-points');
  const [answerOptions, setAnswerOptions] = React.useState([]);

  // // Media variables
  const [image, setImage] = React.useState('');
  const [videoUrl, setVideoUrl] = React.useState('');

  // Handle user input
  const [selected, setSelected] = React.useState([]);
  const [selectedRadio, setSelectedRadio] = React.useState('');
  const [timerId, setTimerId] = React.useState(null);
  const [statusTimerId, setStatusTimerId] = React.useState(null);
  const [correctAns, setCorrectAns] = React.useState([]);

  // Poll questions every 5 seconds
  React.useEffect(() => {
    setSelected([]);
    setSelectedRadio('');
    setCorrectAns([]);
    loadQuestion();
    const interval = setInterval(() => {
      loadQuestion();
    }, 5000);
    return () => clearInterval(interval);
  }, [timeQuestionStarted])

  // Sets timer
  React.useEffect(() => {
    const timer = setInterval(() => {
      if (time > 0) setTime(time - 1);
    }, 1000);
    setTimerId(timer);
    return () => clearInterval(timer);
  }, [time]);

  // When time is up, get answers
  React.useEffect(() => {
    if (time === 0) getAnswers();
  }, [time]);

  // Checks if game is started every 5 secnods
  React.useEffect(() => {
    gameStarted();
    const interval = setInterval(() => {
      gameStarted();
    }, 5000);
    setStatusTimerId(interval);
    return () => clearInterval(interval);
  }, []);

  // Checks current game status. If game is not started, then navigate to results page.
  const gameStarted = async () => {
    const response = await fetch(`http://localhost:5005/play/${playerId}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch((err) => console.log(err));
    if (response.status === 200) {
      const data = await response.json();
      if (!data.started) {
        clearInterval(statusTimerId);
        navigate(`/quiz/${gamepin}/results?id=${playerId}`);
      }
    } else if (response.status === 400) {
      clearInterval(statusTimerId);
      navigate(`/play/${gamepin}/results/${playerId}`);
    }
  }

  // Gets question details for the current question that the session is up to
  const loadQuestion = async () => {
    const response = await fetch(`http://localhost:5005/play/${playerId}/question`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch(err => console.error(err));
    if (response.status === 200) {
      const data = await response.json();
      if (data.question.isoTimeLastQuestionStarted !== timeQuestionStarted) {
        if (data.question.question) setQuestion(data.question.question);
        if (data.question.questionType) setQuestionType(data.question.questionType);
        if (data.question.timeLimit) setTime(data.question.timeLimit);
        if (data.question.points) setPoints(data.question.points);
        if (data.question.answerOptions) setAnswerOptions(data.question.answerOptions);
        if (data.question.image) setImage(data.question.image);
        if (data.question.videoUrl) setVideoUrl(data.question.videoUrl);
        setTimeQuestionStarted(data.question.isoTimeLastQuestionStarted);
        setCorrectAns([]);
      }
    }
  };

  // Displays media - image or video type
  const handleMedia = () => {
    if (image === '') {
      if (videoUrl === '') {
        return (
          <Box sx={styles.image}/>
        )
      } else {
        return (
          <Box>
            <iframe
              title='YouTube Preview'
              src={videoUrl}
              alt='quiz video'
              style={styles.iframe}
            />
          </Box>
        )
      }
    } else {
      return (
        <Box component='img' src={image} sx={isSmallScreen ? styles.smallImage : styles.image} alt='quiz image'></Box>
      )
    }
  };

  // Submit player answers
  const handleSubmit = async () => {
    let answerIds = {};
    answerIds = selected;
    await fetch(`http://localhost:5005/play/${playerId}/answer`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ answerIds })
    }).catch(err => console.error(err));
  }

  // Clears timer and gets correct answer for the current question that the session is up to
  const getAnswers = async () => {
    clearInterval(timerId);
    const response = await fetch(`http://localhost:5005/play/${playerId}/answer`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (response.status === 200) {
      const data = await response.json();
      setCorrectAns(data.answerIds);
    }
  }

  // Handles user answer selection for single-select (radio button) questions
  const handleSelect = (event) => {
    setSelectedRadio(parseInt(event.target.value));
    setSelected([parseInt(event.target.value)]);
  }

  // Handles user answer selection for multi-select (checkbox) questions
  const handleCheckboxSelect = (event) => {
    const id = parseInt(event.target.value);
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  }

  // Checks if question at the current index is correct answer
  const isCorrectAnswer = (index) => {
    if (correctAns.includes(index)) {
      return (
        <Typography>CORRECT</Typography>
      )
    }
  }

  // Displays question based on if questionType is single-select or multi-select
  const displaySelectionType = () => {
    if (questionType === 'single-choice') {
      return (
        <RadioGroup
            name='radioButtonsGrid'
            value={selectedRadio}
            onChange={handleSelect}
          >
          <Grid container spacing={2} maxWidth>
            {answerOptions.map((option, index) => (
              <Grid item xs={6} key={index}>
                <Paper
                  elevation={correctAns.includes(option.id) ? 16 : 0}
                  sx={{
                    padding: '30px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    height: '80px',
                    backgroundColor: colors[index % colors.length],
                    color: '#ffffff',
                  }}
                >
                  <FormControlLabel
                    value={option.id}
                    control={<Radio />}
                    label={option.text}
                  />
                  {isCorrectAnswer(option.id)}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </RadioGroup>
      )
    } else if (questionType === 'multi-choice') {
      return (
        <Grid container spacing={2} maxWidth>
        {answerOptions.map((option, index) => (
          <Grid item xs={6} key={index}>
            <Paper
              elevation={selected.includes(option.id) === index ? 6 : 0}
              sx={{
                padding: '40px',
                textAlign: 'center',
                cursor: 'pointer',
                height: '80px',
                backgroundColor: colors[index % colors.length],
                color: '#ffffff',
              }}
            >
              <FormControlLabel
                control={<Checkbox onChange={handleCheckboxSelect} value={option.id}/>}
                label={option.text}
              />
              {isCorrectAnswer(option.id)}
            </Paper>
          </Grid>
        ))}
      </Grid>
      )
    }
  }

  return (
    <>
      <Container disableGutters maxWidth sx={styles.root}>
        <Box sx={{ p: 3, textAlign: 'center', backgroundColor: 'white' }}>
          <Typography variant='h6'>{question}</Typography>
        </Box>
        <Divider />
        <Box
          sx={{
            margin: 4,
            height: '40vh',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant='h2' onComplete={() => getAnswers()}>{time}</Typography>
          {handleMedia()}
          <Typography variant='h6'>Points: {points}</Typography>
        </Box>
        <Box
          sx={{
            margin: 4,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <Button
            variant='contained'
            aria-label='Button to submit answer'
            disabled={ time === 0 }
            onClick={() => handleSubmit()}>
              Submit
          </Button>
        </Box>
        <Box sx={styles.center}>
         {displaySelectionType()}
        </Box>
      </Container>
    </>
  );
};

export default PlayQuestionPage;
