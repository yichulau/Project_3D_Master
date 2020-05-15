import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import Index from './components/index';

class App extends Component {

  render() {
    return (<BrowserRouter>
      <div>
        <Route path="/" exact component={Index}/>
      </div>
    </BrowserRouter>);
  }
}

export default App;
