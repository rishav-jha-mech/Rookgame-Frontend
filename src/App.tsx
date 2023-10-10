import { Route, Switch, Router } from 'react-router-dom';

import Home from "./pages/home";
import Game from "./pages/game";
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import store from './Redux/store';

const history = createBrowserHistory();

function App() {

  return (
    <>
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route path="/game" children={() => <Game />} />
            <Route path="/" children={() => <Home />} />
          </Switch>
        </Router>
      </Provider>
    </>
  );
}

export default App;
