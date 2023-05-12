import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StartQuizDialogWrapper from './components/StartQuizDialogWrapper';

describe('StartQuizDialogWrapper', () => {
  const sessionId = '666666';
  const onClose = jest.fn();
  it('renders start quiz dialog with correct message', () => {
    render(<StartQuizDialogWrapper open={true} onClose={onClose} sessionId={sessionId} />);
    expect(screen.getByText(sessionId)).toBeInTheDocument();
  });

  it('triggers onClose when close button is clicked', () => {
    render(<StartQuizDialogWrapper open={true} onClose={onClose} sessionId={sessionId} />);
    const closeButton = screen.getByRole('button', { name: 'Button to close the dialog popup' });
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  })

  it('copies sessionId to clipboard when button is clicked', async () => {
    const writeTextMock = jest.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });
    render(<StartQuizDialogWrapper open={true} onClose={onClose} sessionId={sessionId} />);
    const copyButton = screen.getByRole('button', { name: 'Button to copy the URL to join the game' });
    expect(copyButton).toBeInTheDocument();
    fireEvent.click(copyButton);
    await waitFor(() => expect(writeTextMock).toHaveBeenCalledTimes(1));
    expect(writeTextMock).toHaveBeenCalledWith(`localhost:3000/play?pin=${sessionId}`);
  });
});
