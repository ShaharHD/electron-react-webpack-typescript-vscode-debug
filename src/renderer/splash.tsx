import Actuate from 'actuatejs';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// tslint:disable-next-line:no-var-requires
const splashImage = require('./images/logo.svg');
import './splash.scss';

const root = document.getElementById('splash');

export interface SplashProps {}

interface State {
  username?: string;
  password?: string;
}

class Splash extends Component<SplashProps, State> {
  constructor(props: SplashProps) {
    super(props);
    this.state = { username: '', password: '' };
  }

  public render() {
    return (
      <div className="splash">
        <img
          alt="logo"
          src={splashImage}
          onLoad={(e) => Actuate(['fadeIn', 'tada'])(e.target)}
        />
        <p>Loading...</p>
      </div>
    );
  }
}

ReactDOM.render(<Splash />, root);
