import React from 'react';

import { BrowserRouter, Redirect, Route } from 'react-router-dom';

import './App.scss';
import InputPage from './components/InputPage/InputPage';

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Route exact path="/" render={() => <Redirect to="/ime" />} />
        <Route path="/ime">
          <InputPage />
        </Route>
      </BrowserRouter>
    </div>
  );
};

export default App;
