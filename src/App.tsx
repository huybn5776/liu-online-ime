import React from 'react';

import { BrowserRouter, Redirect, Route } from 'react-router-dom';

import InputPage from './components/InputPage/InputPage';
import SettingsPage from './components/SettingsPage/SettingsPage';
import './App.scss';
import './styles.scss';

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Route exact path="/" render={() => <Redirect to={`/ime${window.location.search}`} />} />
        <Route path="/ime">
          <InputPage />
        </Route>
        <Route path="/settings">
          <SettingsPage />
        </Route>
      </BrowserRouter>
    </div>
  );
};

export default App;
