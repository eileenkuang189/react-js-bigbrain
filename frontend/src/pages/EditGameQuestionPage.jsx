import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import { useContext, Context } from '../context';
import Navbar from '../components/Navbar';
import SnackbarWrapper from '../components/SnackbarWrapper';
import DialogWrapper from '../components/Dialog';
import MediaPreview from '../components/MediaPreview';
import { DeleteButtonWrapper } from '../components/DeleteButtonWrapper';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Card, CardActions, CardContent } from '@mui/material';
// import IconButton from '@mui/material/IconButton';
// import DeleteIcon from '@mui/icons-material/Delete';

const MAX_ANSWERS = 6;
const MIN_ANSWERS = 2;

const theme = createTheme({
  typography: {
    fontSize: 24,
  },
  components: {
    MuiInputLabel: {
      defaultProps: {
        sx: {
          fontSize: '20px',
        },
      },
    },
  },
});

export const QuestionPage = () => {
  const navigate = useNavigate();
  const { token } = useContext(Context);
  const url = window.location.href;
  const regex = /\/quiz\/(\d+)\/(\d+)/
  const match = url.match(regex);
  const quizId = match[1];
  const questionNo = parseInt(match[2]) + 1;

  // Question Data
  const [quizName, setQuizName] = React.useState('');
  const [quizData, setQuizData] = React.useState(null);
  const [questionText, setQuestionText] = React.useState('');
  const [questionType, setQuestionType] = React.useState('single-choice');
  const [timeLimit, setTimeLimit] = React.useState(30);
  const [points, setPoints] = React.useState('standard-points');
  const [answerOptions, setAnswerOptions] = React.useState([]);

  // Media variables
  const [image, setImage] = React.useState('');
  const [videoUrl, setVideoUrl] = React.useState('');
  const [selectedTag, setSelectedTag] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  // Alert snackbars
  const [maxAnswersAlert, setMaxAnswersAlert] = React.useState(false);
  const [minAnswersAlert, setMinAnswersAlert] = React.useState(false);
  const [submitAlert, setSubmitAlert] = React.useState(false);
  const [errorAlert, setErrorAlert] = React.useState(false);
  const [editAlert, setEditAlert] = React.useState(false);

  React.useEffect(() => {
    setEditAlert(true);
    const handleLoadQuestion = async () => {
      try {
        const response = await fetch(`http://localhost:5005/admin/quiz/${quizId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          },
        });
        if (response.status === 200) {
          const data = await response.json();
          setQuizData(data);
          setQuizName(data.name);
          if (data.questions.length >= questionNo) {
            const questionData = data.questions[questionNo - 1];
            if (questionData.question) setQuestionText(questionData.question);
            if (questionData.points) setPoints(questionData.points);
            if (questionData.questionType) setQuestionType(questionData.questionType);
            if (questionData.timeLimit) setTimeLimit(questionData.timeLimit);
            if (questionData.answerOptions) setAnswerOptions(questionData.answerOptions);
            if (questionData.image) setImage(questionData.image);
            if (questionData.videoUrl) setVideoUrl(questionData.videoUrl);
            if (questionData.selectedTag) setSelectedTag(questionData.selectedTag);
          }
        }
      } catch (err) {
      }
    }
    handleLoadQuestion();
    setAnswerOptions([
      { id: 1, text: '', isCorrect: false },
      { id: 2, text: '', isCorrect: false }]);
  }, [])

  // setters
  const handleQuestionText = (event) => setQuestionText(event.target.value);
  const handleQuestionType = (event) => setQuestionType(event.target.value);
  const handleTimeLimit = (event) => setTimeLimit(event.target.value);
  const handlePoints = (event) => setPoints(event.target.value);

  // Add answer, else raise alert if max answers reached
  const handleAddAnswer = () => {
    if (answerOptions.length < MAX_ANSWERS) {
      const newAnswer = { id: answerOptions.length + 1, text: '', isCorrect: false }
      setAnswerOptions([...answerOptions, newAnswer]);
    } else setMaxAnswersAlert(true);
  };

  // Sets answer options text
  const handleAnswerOptionChange = (event, optionId) => {
    const updatedAnswerOptions = answerOptions.map((option) => {
      if (option.id === optionId) {
        return { id: option.id, text: event.target.value, isCorrect: option.isCorrect };
      } else {
        return option;
      }
    });
    // console.log(updatedAnswerOptions)
    setAnswerOptions(updatedAnswerOptions);
  };

  // Sets answer options correct checkbox
  const handleAnswerOptionCheckboxChange = (event, optionId) => {
    const updatedAnswerOptions = answerOptions.map((option) => {
      if (option.id === optionId) {
        return { id: option.id, text: option.text, isCorrect: event.target.checked };
      } else {
        return option;
      }
    });
    // console.log(updatedAnswerOptions)
    setAnswerOptions(updatedAnswerOptions);
  };

  // Deletes an answer option
  const handleDeleteAnswer = (event, optionId) => {
    if (answerOptions.length === MIN_ANSWERS) {
      setMinAnswersAlert(true);
      return;
    }
    const newAnswerOptions = answerOptions.filter((option) => option.id !== optionId);
    const updateAnsId = newAnswerOptions.map((object, index) => ({
      id: index + 1,
      text: object.text,
      isCorrect: object.isCorrect
    }));
    setAnswerOptions(updateAnsId);
  }

  // Displays answer options
  const mapAnswerOptions = () => {
    if (!answerOptions) return '';
    return answerOptions.map((option) => (
      <Grid item xs={2} sm={6} key={option.id}>
        <Card sx={{ p: 1 }} variant="outlined">
          <CardContent>
            <FormControl margin="normal" fullWidth>
              <TextField
                label={`Answer Option ${option.id}`}
                onChange={(event) => handleAnswerOptionChange(event, option.id)}
                value={option.text}
                name={option.id.toString()}
                variant="filled"
              />
            </FormControl>
          </CardContent>
          <CardActions sx={{ justifyContent: 'space-between' }}>
            <FormControlLabel control={<Checkbox checked={option.isCorrect} color="success"
              onChange={(event) => handleAnswerOptionCheckboxChange(event, option.id)} />} label="Is correct?" />
            <DeleteButtonWrapper label="button to delete an answer option" onClick={(event) => handleDeleteAnswer(event, option.id)}/>
          </CardActions>
        </Card>
      </Grid>
    ))
  };

  const handleBack = () => {
    navigate(`/quiz/${quizId}`);
  };

  const checkEmptyAnswer = () => {
    for (const key in answerOptions) {
      if (answerOptions[key].text === '') {
        return false;
      }
    }
    return true;
  };

  const checkCorrectAnswerSelected = () => {
    for (const key in answerOptions) {
      if (answerOptions[key].isCorrect) {
        return true;
      }
    }
    return false;
  }

  // Updates all the details of a particular quiz of Bigbrain
  const handleUpdate = async (event) => {
    if (!checkEmptyAnswer()) {
      alert('Please fill out all answer options.');
      return;
    }
    if (!checkCorrectAnswerSelected()) {
      alert('Please select at least one correct answer.');
      return;
    }
    try {
      const questions = quizData.questions;
      questions[questionNo - 1].questionType = questionType;
      questions[questionNo - 1].timeLimit = timeLimit;
      questions[questionNo - 1].points = points;
      questions[questionNo - 1].answerOptions = answerOptions;
      questions[questionNo - 1].question = questionText;
      questions[questionNo - 1].image = image;
      questions[questionNo - 1].videoUrl = videoUrl;
      questions[questionNo - 1].selectedTag = selectedTag;
      const body = { questions }
      body.name = quizName;
      body.thumbnail = quizData.thumbnail;
      body.answerOptions = answerOptions;
      const response = await fetch(`http://localhost:5005/admin/quiz/${quizId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify(body)
      })
      if (response.status === 200) {
        setSubmitAlert(true);
      } else {
        setErrorAlert(true);
      }
    } catch (err) {
    }
  }

  // Handle snackbars
  const generateSnackbars = () => {
    return (
      <>
        <SnackbarWrapper
          open={submitAlert}
          onClose={(event) => handleSnackbarClose(event, 'submit')}
          severity="success"
          message="Successfully submitted."
        />
        <SnackbarWrapper
          open={errorAlert}
          onClose={(event) => handleSnackbarClose(event, 'failed-submit')}
          severity="error"
          message="Submit failed."
        />
        <SnackbarWrapper
          open={maxAnswersAlert}
          onClose={(event) => handleSnackbarClose(event, 'max-answers')}
          severity="warning"
          message="You have reached the maximum number of answers."
        />
        <SnackbarWrapper
          open={minAnswersAlert}
          onClose={(event) => handleSnackbarClose(event, 'min-answers')}
          severity="warning"
          message="You must have least two answers."
        />
        <SnackbarWrapper
          open={editAlert}
          onClose={(event) => handleSnackbarClose(event, 'edit-question')}
          severity="info"
          message="Quiz questions will be updated."
        />
      </>
    )
  }

  // Handle snackbar close
  const handleSnackbarClose = (event, type) => {
    if (type === 'submit') {
      setSubmitAlert(false);
    }
    if (type === 'max-answers') {
      setMaxAnswersAlert(false);
    }
    if (type === 'min-answers') {
      setMinAnswersAlert(false);
    }
    if (type === 'failed-submit') {
      setErrorAlert(false);
    }
    if (type === 'edit-question') {
      setEditAlert(false);
    }
  };

  // Check if current upload media type is image or video
  const getSelectedTag = () => {
    if (selectedTag === 'video' && videoUrl !== '') return 'video'
    else if (selectedTag === 'image' && image !== '') return 'image'
    return '';
  }
  return (
    <>
      <Navbar />
      {generateSnackbars()}
      <Container component="main" maxWidth="lg" sx={{ pt: 12 }}>
        <Typography variant="h4" align="center">{quizName || 'Quiz Name'}</Typography>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Stack
            id="header"
            direction="col"
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
            sx={{ my: 3 }}
          >
            <Typography variant="h5" align="center" sx={{ pr: 3 }}>Q{questionNo}.</Typography>
            <ThemeProvider theme={theme}>
              <TextField
                margin="normal"
                required
                id="Question Text"
                aria-label="input field to change the question text"
                label="Question Text"
                size="medium"
                fullWidth
                value={questionText}
                sx={{ mb: 3 }}
                onChange={handleQuestionText}
              />
            </ThemeProvider>
          </Stack>
          <Stack>
            <Typography variant="h5" sx={{ mb: 3 }}>Preview media</Typography>
            <MediaPreview
              open={open}
              selectedTag={getSelectedTag()}
              image={image}
              videoUrl={videoUrl}
            />
            <DialogWrapper
              open={open}
              videoUrl={videoUrl}
              image={image}
              selectedTag={selectedTag}
              onOpen={(value) => setOpen(value)}
              onVideoUrlChange={(value) => setVideoUrl(value)}
              onImageChange={(value) => setImage(value)}
              onSelectedTagChange={(value) => setSelectedTag(value)}
            />
          </Stack>
          <Stack
            id="answers"
            direction={{ sm: 'column', md: 'row' }}
            spacing={1}
            justifyContent="space-around"
            sx={{ my: 3 }}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <Box sx={{ pr: 3, minWidth: 6 / 10 }}>
              <Stack
                id="add-answer"
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                sx={{ mt: 3, mb: 3 }}
              >
                <Typography variant="h5" sx={{ mb: 3 }}>Answers</Typography>
                <Button onClick={handleAddAnswer} aria-label="Button to add another answer" variant='contained' margin='normal' align="center">
                  Add Answer
                </Button>
              </Stack>
              <Grid container spacing={2}
                direction={{ xs: 'column', sm: 'row' }}
              >
                {mapAnswerOptions()}
              </Grid>
            </Box>
            <Box sx={{ pl: 3 }}>
              <FormControl sx={{ mb: 3 }}>
                <FormLabel id="question-type" aria-label="form to choose what type of question">Select question type:</FormLabel>
                <RadioGroup
                  aria-label="question-type"
                  name="question-type-buttons-group"
                  value={questionType}
                  onChange={handleQuestionType}
                >
                  <FormControlLabel value="single-choice" control={<Radio />} label="Single choice" />
                  <FormControlLabel value="multi-choice" control={<Radio />} label="Multi choice" />
                </RadioGroup>
              </FormControl>
              <Typography variant="body1" sx={{ mb: 2 }}>Time limit</Typography>
              <FormControl fullWidth sx={{ mb: 3 }} aria-label="form to choose how much time allocated for the question">
                <InputLabel id="time-limit-label">Time limit</InputLabel>
                <Select
                  labelId="time-limit-label"
                  id="time-limit-select"
                  label="time-limit"
                  value={timeLimit}
                  onChange={handleTimeLimit}
                >
                  <MenuItem value={5}>5 seconds</MenuItem>
                  <MenuItem value={10}>10 seconds</MenuItem>
                  <MenuItem value={20}>20 seconds</MenuItem>
                  <MenuItem value={30}>30 seconds</MenuItem>
                  <MenuItem value={60}>1 minute</MenuItem>
                  <MenuItem value={90}>1 minute 30 seconds</MenuItem>
                  <MenuItem value={120}>2 minutes</MenuItem>
                  <MenuItem value={180}>3 minutes</MenuItem>
                  <MenuItem value={240}>4 minutes</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="body1" sx={{ mb: 2 }}>Points</Typography>
              <FormControl fullWidth sx={{ mb: 3 }}maria-label="form to choose how many points on offer for the question">
                <InputLabel id="points-label">Points</InputLabel>
                <Select
                  labelId="points-label"
                  id="points-select"
                  label="points"
                  value={points}
                  onChange={handlePoints}
                >
                  <MenuItem value="standard-points">Standard points</MenuItem>
                  <MenuItem value="double-points">Double points</MenuItem>
                  <MenuItem value="no-points">No points</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>
          <Stack
            id="options"
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            sx={{ mt: 3 }}
          >
            <Button
              onClick={handleBack}
              aria-label="Button to go back"
              variant='outlined'
              margin='normal'>
              Back
            </Button>
            <Button
              variant="contained"
              aria-label="Button to update the question"
              onClick={handleUpdate}
            >
              Update
            </Button>
          </Stack>
        </Paper>
      </Container>
    </>
  )
}

export default QuestionPage;
