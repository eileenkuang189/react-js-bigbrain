import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Context } from './context.js'

import LoginPage from './pages/LoginPage';

describe('LoginPage', () => {
  test('renders login form', () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByRole('button', { name: 'Button to login' });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test('successfully submits login form', async () => {
    const mockSetToken = jest.fn();
    const mockNavigate = jest.fn();
    jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'test-token' }),
        status: 200
      });
    });
    render(
      <Router>
        <LoginPage />
      </Router>,
      {
        wrapper: ({ children }) => (
          <Context.Provider value={{ setToken: mockSetToken }}>
            {children}
          </Context.Provider>
        )
      }
    );
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByRole('button', { name: 'Button to login' });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'test-password' } });
    fireEvent.click(submitButton);
    expect(window.fetch).toHaveBeenCalledWith('http://localhost:5005/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: 'test@example.com', password: 'test-password' })
    });
    waitFor(() => {
      expect(mockSetToken).toHaveBeenCalledWith('test-token');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
