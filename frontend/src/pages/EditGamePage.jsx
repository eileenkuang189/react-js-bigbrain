import * as React from 'react';
import Navbar from '../components/Navbar';
import defaultThumbnail from '../assets/bigbrain_default.png'
import SnackbarWrapper from '../components/SnackbarWrapper';

import { useNavigate } from 'react-router-dom';
import { useContext, Context } from '../context';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export const GamePage = () => {
  const url = window.location.href;
  const regex = /\/quiz\/(\d+)/;
  const match = url.match(regex);
  const quizId = match[1];
  const navigate = useNavigate();
  const { token } = useContext(Context);

  // State variables
  const [name, setName] = React.useState('');
  const [quizQuestions, setQuizQuestions] = React.useState([]);
  const [questionData, setQuestionData] = React.useState([]);
  const [thumbnail, setThumbnail] = React.useState(null);

  // Alert snackbars
  const [submitAlert, setSubmitAlert] = React.useState(false);
  const [errorAlert, setErrorAlert] = React.useState(false);

  React.useEffect(() => {
    handleLoadQuestion();
  }, []);

  const handleLoadQuestion = async () => {
    console.log('Loading...')
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
        console.log(data);
        setQuestionData(data.questions);
        const updateQuestions = [];
        data.questions.forEach((obj) => {
          updateQuestions.push(Object.values(obj)[0]);
        })
        setQuizQuestions([...updateQuestions]);
        setName(data.name);
        if (data.thumbnail !== {}) {
          setThumbnail(data.thumbnail);
        }
      }
    } catch (err) {
      alert(err);
    }
  }

  // Navigate back to dashboard
  const handleBack = () => navigate('/dashboard');

  // Updates the quiz name variable
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  // Updates quizQuestions variable
  const handleQuestionChange = (event, index) => {
    const updateQuestions = [...quizQuestions];
    updateQuestions[index] = event.target.value;
    setQuizQuestions(updateQuestions);
    console.log(questionData)
  };

  // Updates quizQuestions variable
  const handleAddQuestion = () => setQuizQuestions([...quizQuestions, '']);

  // Navigates to the question's edit page
  const handleEditQuestion = (index) => {
    handleUpdate();
    navigate(`/quiz/${quizId}/${index}`);
  };

  const handleDeleteQuestion = (index) => {
    console.log(`deleteQuestion ${index}`);
    const currQuestions = [...quizQuestions];
    currQuestions.splice(index, 1);
    setQuizQuestions(currQuestions);
    console.log(quizQuestions);
  };

  // Displays a list of quiz question inputs, with edit and delete buttons
  const mapQuestions = () => {
    console.log('mapping questions...');
    console.log(quizQuestions);
    return quizQuestions.map((item, index) => (
      <Stack
      key={index}
      direction="row"
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
      >
        <TextField
          margin="normal"
          required
          label={ `Question ${index + 1}` }
          defaultValue={item}
          fullWidth
          onChange={(event) => handleQuestionChange(event, index)}
        />
        <IconButton color="primary" aria-label="Edit Question" onClick={() => handleEditQuestion(index)}>
          <EditIcon />
        </IconButton>
        <IconButton color="primary" aria-label="Edit Question" onClick={() => handleDeleteQuestion(index)}>
          <DeleteIcon />
        </IconButton>
      </Stack>
    ))
  };

  const checkEmptyQuestion = () => {
    for (const i in quizQuestions) {
      if (quizQuestions[i] === '') return true;
    }
    return false;
  };

  // Updates all the details of a particular quiz of Bigbrain
  const handleUpdate = async () => {
    if (checkEmptyQuestion()) {
      alert('Please fill out all questions.');
      return;
    }
    console.log(quizQuestions);
    const questions = [];
    quizQuestions.forEach((question, index) => {
      let obj = { };
      if (index < questionData.length) {
        obj = questionData[index];
      }
      obj.question = question;
      questions.push(obj);
    });
    const body = { questions, name, thumbnail }
    console.log('submitting all da questions')
    console.log(body);
    const response = await fetch(`http://localhost:5005/admin/quiz/${quizId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify(body)
    })
    if (response.status === 200) setSubmitAlert(true);
    else setErrorAlert(true);
  };

  // Handles thumbnail uplaod
  const handleFileUpload = (event) => {
    console.log('handling file upload...')
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setThumbnail(reader.result);
    reader.readAsDataURL(file);
    console.log(thumbnail);
  };

  // Handle snackbars
  const generateSnackbars = () => {
    return (
      <>
        <SnackbarWrapper
          open={submitAlert}
          name="quiz-update-success"
          onClose={(event) => handleSnackbarClose(event, 'submit')}
          severity="success"
          message="Quiz questions updated."
        />
        <SnackbarWrapper
          open={errorAlert}
          onClose={(event) => handleSnackbarClose(event, 'error')}
          severity="error"
          message="Error occured."
        />
      </>
    )
  };

  // Handle snackbar close
  const handleSnackbarClose = (type) => {
    if (type === 'submit') setSubmitAlert(false);
    if (type === 'error') setErrorAlert(false);
  };

  return (
    <>
      <Navbar />
      {generateSnackbars()}
      <Container component="main" maxWidth="md" sx={{ pt: 12 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography variant="h4" align="center" sx={{ mb: 3 }}>Update Quiz</Typography>
          <Typography variant="h6">Thumbnail</Typography>
          {(thumbnail && (
            <Card sx={{ mt: 3, mb: 3 }}>
              <CardMedia sx={{ height: 400 }} name='thumbnail' image={thumbnail} alt='uploaded thumbnail'/>
            </Card>
          )) || (
            <Card sx={{ mt: 3, mb: 3 }}>
              <CardMedia sx={{ height: 400 }} image={defaultThumbnail} alt='default thumbnail'/>
            </Card>
          )}
          <TextField
            margin="normal"
            required
            id="Updated Quiz Name"
            label="Quiz Name"
            name='quiz-name'
            fullWidth
            value={name}
            onChange={handleNameChange}
            sx={{ mb: 3 }}
          />
          <Divider />
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 3, mb: 3 }}
          >
            <Typography variant="h6">Questions</Typography>
            <Button onClick={handleAddQuestion} variant='contained' margin='normal' align="center">
              Add Question
            </Button>
          </Stack>
          {mapQuestions()}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            sx={{ mt: 3 }}
          >
            <Button variant="contained" component="label" startIcon={<PhotoCameraIcon />}>
              Upload Thumbnail
              <input hidden accept="image/*" name='edit-thumbnail' type="file" onChange={handleFileUpload}/>
            </Button>
            <Button onClick={handleBack} name="edit-back" variant='outlined' margin='normal'>
              Back
            </Button>
            <Button
              variant="contained"
              name="update-quiz"
              onClick={handleUpdate}
            >
              Update
            </Button>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}

export default GamePage;
