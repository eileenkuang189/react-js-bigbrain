import * as React from 'react';
import Chart from 'chart.js/auto'
import { useEffect } from 'react';
import { useContext, Context } from '../context';
import Navbar from '../components/Navbar';
import QuestionWrapper from '../components/QuestionWrapper';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';

export const ResultsPage = () => {
  const url = window.location.href;
  const quizId = url.split('/')[4];
  const sessionId = new URLSearchParams(location.search).get('id');
  const { token } = useContext(Context);

  // State variables
  const [sessionResults, setSessionResults] = React.useState(null);
  const [questionData, setQuestionData] = React.useState(null);
  const [leaderboardData, setLeaderboardData] = React.useState(null);
  const [responseTimes, setResponseTimes] = React.useState({});
  const [percentQuestionCorrect, setPercentQuestionCorrect] = React.useState({});
  const [questions, setQuestions] = React.useState([]);

  useEffect(() => {
    getSessionResults();
    getQuestionData();
    getLeaderboard();
  }, [token, sessionId]);

  useEffect(() => {
    getLeaderboard();
    getQuestions();
  }, [sessionResults, questionData]);

  // Gets the results of the quiz session and what peoples scores were
  const getSessionResults = async () => {
    const response = await fetch(`http://localhost:5005/admin/session/${sessionId}/results`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      if (data.results) setSessionResults(data.results);
    }
  };

  // Gets all the data pertaining to this quiz
  const getQuestionData = async () => {
    const response = await fetch(`http://localhost:5005/admin/quiz/${quizId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      setQuestionData(data);
    }
  };

  // Populates question state variable, by mapping questions and its answer choices
  const getQuestions = () => {
    const questionList = [];

    if (questionData) {
      for (let i = 0; i < questionData.questions.length; i++) {
        const q = questionData.questions[i];
        const choices = q.answerOptions.map((option) => option.text);
        questionList.push({
          question: q.question,
          choices,
        });
      }
    }
    setQuestions(questionList);
  }

  // Gets an array of objects sorted by score, each object containing player name and their score
  const getLeaderboard = () => {
    const leaderboard = [];
    const responseTimes = {};
    const questionsCorrect = {};
    if (sessionResults && questionData) {
      // initialize response times object by mappign question number to an empty array
      for (let i = 1; i <= questionData.questions.length; i++) {
        responseTimes[i] = [];
        questionsCorrect[i] = 0;
      }
      const numPlayers = sessionResults.length;

      sessionResults.forEach((player) => {
        const leaderboardEntry = {};
        leaderboardEntry.score = 0;
        leaderboardEntry.name = player.name;

        player.answers.forEach((answer, index) => {
          const points = questionData.questions[index].points;
          const timeLimit = questionData.questions[index].timeLimit;

          if (answer.correct) {
            leaderboardEntry.score += calculateScore(answer.questionStartedAt, answer.answeredAt, points, timeLimit);
            questionsCorrect[index + 1] += 1;
          }
          // calculate response time and add to the corresponding response time entry
          responseTimes[index + 1].push(calculateResponseTime(answer.questionStartedAt, answer.answeredAt));
        })
        leaderboard.push(leaderboardEntry);
      })
      // sort leaderboard entries descending by score
      leaderboard.sort((a, b) => b.score - a.score)

      // Calculate average response time
      for (const key in responseTimes) {
        responseTimes[key] = average(responseTimes[key]);
      }
      setResponseTimes(responseTimes);

      // calculate percentage correct
      for (const key in questionsCorrect) {
        questionsCorrect[key] = Math.ceil(questionsCorrect[key] / numPlayers * 100);
      }
      setPercentQuestionCorrect(questionsCorrect);
    }
    // Set state variables
    setLeaderboardData(leaderboard);
  }

  // Returns score, which is calculated based on the (time remaining to finish question)  * point system
  const calculateScore = (questionStartedAt, answeredAt, points, timeLimit) => {
    // If question not answered, or no-points calculated
    if (questionStartedAt === null || answeredAt === null || points === 'no-points') {
      return 0;
    }
    const startDate = new Date(questionStartedAt);
    const answerDate = new Date(answeredAt);
    const timeTakenForAnswer = Math.ceil((answerDate - startDate) / 1000);
    if (points === 'standard-points') {
      return Math.ceil((timeLimit - timeTakenForAnswer) / timeLimit * 100)
    } else if (points === 'double-points') {
      return Math.ceil((timeLimit - timeTakenForAnswer) / timeLimit * 200);
    }
  }

  // Returns leaderboard if existing
  const displayLeaderboard = () => {
    if (leaderboardData !== null) {
      return (
        leaderboardData.map((row, index) => (
          <TableRow key={index}>
            <TableCell align='center'>{index + 1}</TableCell>
            <TableCell align='center'>{row.name}</TableCell>
            <TableCell align='center'>{row.score}</TableCell>
          </TableRow>
        ))
      )
    }
  }

  // Returns response time in seconds based on when the question was started and answered at
  const calculateResponseTime = (questionStartedAt, answeredAt) => {
    if (questionStartedAt === null || answeredAt === null) {
      return 0;
    }
    const startDate = new Date(questionStartedAt);
    const answerDate = new Date(answeredAt);
    const timeTakenForAnswer = Math.ceil((answerDate - startDate) / 1000);
    return timeTakenForAnswer;
  }

  // Returns the average of an array
  const average = (array) => {
    const sum = array.reduce((acc, val) => acc + val, 0);
    return sum / array.length;
  }

  // Draw a bar chart for response times
  React.useEffect(() => {
    const canvas = document.getElementById('responseTimesChart');
    if (canvas && questionData) {
      const ctx = canvas.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: questionData.questions.map((q, i) => `Q${i + 1}`),
          datasets: [{
            data: Object.values(responseTimes),
            backgroundColor: '#381272',
            borderColor: 'white',
            borderWidth: 2,
            barThickness: 30,
          }],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Question Number'
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Response time (s)'
              }
            }
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
      return () => {
        chart.destroy();
      };
    }
  }, [responseTimes, questions]);

  // Draw a bar chart percentage of players who got each question correct
  React.useEffect(() => {
    const canvas = document.getElementById('percentageCorrectChart');
    if (canvas && questionData) {
      const ctx = canvas.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: questionData.questions.map((q, i) => `Q${i + 1}`),
          datasets: [{
            data: Object.values(percentQuestionCorrect),
            backgroundColor: '#381272',
            borderColor: 'white',
            borderWidth: 2,
            barThickness: 30,
          }],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Question Number'
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: '% correct'
              }
            }
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
      return () => {
        chart.destroy();
      };
    }
  }, [percentQuestionCorrect, questions]);

  return (
    <>
      <Navbar />
      <main>
        <Box sx={{ pt: 8, pb: 4 }}>
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
              <Typography variant='h6' sx={{ pb: 2 }}>Session ID: <b>{sessionId}</b></Typography>
              <Typography variant='h5' sx={{ pb: 2 }}>Top 5 Players</Typography>
              <TableContainer sx={{ pb: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align='center'>Rank</TableCell>
                      <TableCell align='center'>Name</TableCell>
                      <TableCell align='center'>Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayLeaderboard()}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant='body2' sx={{ p: 2 }}>Note: Score is calculated by ((Time Remaining) / (Total Time Limit)) * 100 * (Scoring System), where scoring system is double points, standard points, or no points.</Typography>
              <Typography variant='h5' sx={{ pb: 2 }}>Average Response Time per Question</Typography>
              <Box sx={{ pb: 2 }}>
                <canvas id='responseTimesChart' style={{ maxWidth: '600px', margin: '0 auto' }}></canvas>
              </Box>
              <Typography variant='h5' sx={{ pb: 2 }}>Correct Answers per Question (%)</Typography>
              <Box sx={{ pb: 2 }}>
                <canvas id='percentageCorrectChart' style={{ maxWidth: '600px', margin: '0 auto' }}></canvas>
              </Box>
              {/* {questionData && responseTimes && (<BarChart
                data={{ labels: questionData.questions, values: responseTimes }}
                label='responseTimesChart'
                xTitle='Question Number'
                yTitle='Response time (s)'
                sectionTitle='Average Response Time per Question'
              />)}
              {questionData && percentQuestionCorrect && (<BarChart
                data={{ labels: questionData.questions, values: percentQuestionCorrect }}
                label="percentageCorrectChart"
                xTitle='Question Number'
                yTitle="% correct"
                sectionTitle='Correct Answers per Question (%)'
              />)} */}
              <Typography variant='h5' sx={{ pb: 2 }}>Question Breakdown</Typography>
              <Box sx={{ pb: 2, minWidth: '400px' }}>
                <div>
                  {questions.map((q, i) => (
                    <QuestionWrapper
                      key={i}
                      qno={i + 1}
                      question={q.question}
                      choices={q.choices} />
                  ))}
                </div>
              </Box>
            </Box>
          </Container>
        </Box>
      </main>
    </>
  );
};

export default ResultsPage;
