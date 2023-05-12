import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// Handles snackbars for alerts
export const SnackbarWrapper = (props) => {
  const { open, onClose, severity, message } = props;

  const Alert = React.forwardRef(function Alert (props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default SnackbarWrapper;
