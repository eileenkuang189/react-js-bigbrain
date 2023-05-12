import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SnackbarWrapper from './components/SnackbarWrapper.jsx';

describe('SnackbarWrapper', () => {
  it('renders snackbar with correct message', () => {
    const message = 'test message';
    const onClose = jest.fn();
    render(<SnackbarWrapper open={true} onClose={onClose} severity="success" message={message} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  })

  it('triggers onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<SnackbarWrapper open={true} onClose={onClose} severity='info' message='test message' />);
    userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
