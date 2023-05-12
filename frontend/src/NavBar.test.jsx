import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Context } from './context.js'

describe('Navbar', () => {
  it('renders with correct buttons', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );
    const logoutButton = screen.getByLabelText('Button to log out. Navigate back to the login page');
    const homeButton = screen.getByLabelText('Button to navigate back to dashboard');
    expect(logoutButton).toBeInTheDocument();
    expect(homeButton).toBeInTheDocument();
  });

  it('renders navbar with correct title', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );
    const titleElement = screen.getByText(/BigBrain/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('handles navigation to dashboard page when home button is clicked', () => {
    const mockNavigate = jest.fn();
    render(
      <Router>
        <Navbar />
      </Router>
    );
    const homeButton = screen.getByLabelText('Button to navigate back to dashboard');
    fireEvent.click(homeButton);
    waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    });
  });

  it('handles logout when logout button is clicked', async () => {
    const mockNavigate = jest.fn();
    const mockSetToken = jest.fn();
    const testToken = 'test-token'

    jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'test-token' }),
        status: 200
      })
    });

    render(
      <Router>
        <Navbar />
      </Router>,
      {
        wrapper: ({ children }) => (
          <Context.Provider value={{ token: testToken, setToken: mockSetToken }}>
            {children}
          </Context.Provider>
        )
      }
    );
    const logoutButton = screen.getByLabelText('Button to log out. Navigate back to the login page');
    fireEvent.click(logoutButton);
    expect(window.fetch).toHaveBeenCalledWith('http://localhost:5005/admin/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: testToken
      }
    });
    waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
