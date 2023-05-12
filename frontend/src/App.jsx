import { React, useState } from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Context, initialValue } from './context';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EditGamePage from './pages/EditGamePage';
import ManageGamePage from './pages/ManageGamePage';
import EditGameQuestionPage from './pages/EditGameQuestionPage';
import ResultsPage from './pages/ResultsPage';
import PlayPage from './pages/PlayPage';
import PlayQuestionPage from './pages/PlayQuestionPage';
import LobbyPage from './pages/LobbyPage';
import OldResultsPage from './pages/OldResultsPage';
import PlayResults from './pages/PlayResults';

const App = () => {
  const [token, setToken] = useState(initialValue.token);

  return (
    <Context.Provider value={{ token, setToken }}>
      <Router>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/quiz/:gameId' element={<EditGamePage />} />
          <Route path='/quiz/:gameId/:questionId' element={<EditGameQuestionPage />} />
          <Route path='/quiz/:gameId/manage' element={<ManageGamePage />} />
          <Route path='/quiz/:gameId/results' element={<ResultsPage />} />
          <Route path='/quiz/:gameId/results/all' element={<OldResultsPage />} />
          <Route path='/play' element={<PlayPage />} />
          <Route path='/play/:sessionId/lobby/:playerId' element={<LobbyPage />} />
          <Route path='/play/:sessionId/question/:playerId' element={<PlayQuestionPage />} />
          <Route path='/play/:sessionId/results/:playerId' element={<PlayResults />} />
        </Routes>
      </Router>
    </Context.Provider>
  );
}

export default App;
