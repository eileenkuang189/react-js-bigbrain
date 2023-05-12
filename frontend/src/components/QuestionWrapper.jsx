import React from 'react';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const QuestionWrapper = (props) => {
  const { qno, question, choices } = props;
  return (
    <Container>
      <Paper variant='outlined'>
        <Box p={1}>
          <Typography sx={{ textAlign: 'center' }}>Q{qno}: {question}</Typography>
          <List>
            {choices.map((choice, index) => (
              <ListItem key={index}
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  margin: '5px 0',
                  textAlign: 'center',
                }}>
                <ListItemText secondary={choice} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>
    </Container>
  );
};

export default QuestionWrapper;
