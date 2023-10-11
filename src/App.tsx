import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./Redux/store";
import Game from "./pages/game";
import Home from "./pages/home";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" Component={Home} />
            <Route path="/game" Component={Game} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
