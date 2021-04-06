import React from 'react';

import { Link } from 'react-router-dom';

import ImeTextArea from '../ImeTextArea/ImeTextArea';
import './InputPage.scss';

const InputPage: React.FC = () => {
  return (
    <div className="InputPage">
      <ImeTextArea/>
      <Link to="/settings" className="icon-button setting-page-link">
        <i className="cog icon" />
      </Link>
    </div>
  );
};

export default InputPage;
