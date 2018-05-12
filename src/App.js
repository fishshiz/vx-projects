import React, { Component } from "react";
import Graph from "./components/graph";
import Lines from "./components/lines";


class App extends Component {
 
  render() {
    return (
      <div className="container">
        <Graph />
        <Lines />
      </div>
    );
  }
}

export default App;
