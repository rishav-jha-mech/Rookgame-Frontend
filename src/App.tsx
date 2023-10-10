import { Route, Switch, Router } from 'react-router-dom';

import Home from "./pages/home";
import Game from "./pages/game";
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

function App() {

  return (
    <>
      <Router history={history}>
        <Switch>
          <Route path="/game" children={() => <Game />} />
          <Route path="/" children={() => <Home />} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
