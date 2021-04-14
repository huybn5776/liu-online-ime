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
        <Route path="/" exact render={() => <Redirect to={`/ime${window.location.search}`} />} />
        <Route path="/ime" component={InputPage} />
        <Route path="/settings" component={SettingsPage} />
      </BrowserRouter>
    </div>
  );
};

export default App;
