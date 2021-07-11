import { BrowserRouter, Route, Switch } from "react-router-dom";

// LOCAL
import Home from "./Home/Home";
import Header from "./Header/Header";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/" exact component={Home} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
