import React, { Component } from "react";
import { Route } from "react-router-dom";
import Home from "./Components/Home";
import Profile from "./Components/Profile";

class App extends Component {
  render() {
    return (
      <>
        <Route path="/" exact component={Home} />
        <Route path="/profile" component={Profile} />
      </>
    );
  }
}

export default App;
