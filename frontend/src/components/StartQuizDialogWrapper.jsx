import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import DialogActions from '@mui/material/DialogActions';

// dialog for when the start quiz button is pressed. display session ID & ability to copy
const StartQuizDialogWrapper = (props) => {
  const { onClose, open, sessionId } = props;

  const handleClose = () => {
    onClose();
  };
  const handleClick = () => {
    navigator.clipboard.writeText(`localhost:3000/play?pin=${sessionId}`);
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'sm'} fullWidth>
      <DialogTitle sx={{ textAlign: 'center', fontSize: '30px' }}>Started BigBrain Quiz</DialogTitle>
      <DialogContent>
        <Stack
          direction='row'
          spacing={2}
          alignItems='center'
          justifyContent='space-between'
          sx={{ mt: 2, mb: 1 }}
        >
          <Typography>
            Session ID: <span name='session-id'>{sessionId}</span>
          </Typography>
          <Button
            variant='contained'
            name='copy-session'
            onClick={handleClick}
            aria-label="Button to copy the URL to join the game">
            Copy</Button>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button name='start-close' onClick={handleClose} aria-label="Button to close the dialog popup">Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default StartQuizDialogWrapper;
