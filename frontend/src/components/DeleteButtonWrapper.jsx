import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

export const DeleteButtonWrapper = (props) => {
  const { label, onClick } = props;

  return (
    <IconButton color="primary" aria-label={label} onClick={onClick}>
      <DeleteIcon />
    </IconButton>
  );
};
