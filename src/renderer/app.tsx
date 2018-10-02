import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './app.scss';

const root = document.getElementById('app');

export interface AppProps {}

interface State {}

class App extends Component<AppProps, State> {
  constructor(props: AppProps) {
    super(props);
  }

  public render() {
    // Example to show load delay
    setTimeout(() => {
      ipcRenderer.send('app-is-ready');
    }, 5000);

    return (
      <div className="app">
        <p>Main Application</p>
      </div>
    );
  }
}

ReactDOM.render(<App />, root);
