import Actuate from 'actuatejs';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import splashImage from './images/logo.svg';
import './splash.scss';

const root = document.getElementById('splash');

export interface SplashProps {}

interface State {}

class Splash extends Component<SplashProps, State> {
  constructor(props: SplashProps) {
    super(props);
  }

  public render() {
    return (
      <div className="splash">
        <img alt="logo" src={splashImage} onLoad={(e) => Actuate(['fadeIn', 'tada'])(e.target)} />
        <p>Loading...</p>
      </div>
    );
  }
}

ReactDOM.render(<Splash />, root);
