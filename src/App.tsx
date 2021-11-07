import React, { createRef } from "react";
import { render } from "react-dom";
import { GenerateOptions, GenerateSeries } from "./SeriesGenerator";
import { TestLogic } from "./Test";

export default class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      depth: 10,
      maxChildNodes: 5,
      workingMemoryLimit: 5,
      abstractionLimit: 5,
      rootId: "0",
      paths: [],
      toggleShowGraph: false,
    };
  }

  showGraphTest = () => {
    if (this.state.toggleShowGraph) {
      return (
        <div>
          <TestLogic
            depth={this.state.depth}
            maxChildNodes={this.state.maxChildNodes}
            workingMemoryLimit={this.state.workingMemoryLimit}
            abstractionLimit={this.state.abstractionLimit}
            rootId={"0"}
            nodePaths={this.state.paths}
          />
        </div>
      );
    }
  };

  setOptions = () => {
    let paths = GenerateSeries.linearPath(this.state.depth);
    console.log("setting paths ", paths);
    this.setState({
      toggleShowGraph: true,
      paths,
    });
  };

  render() {
    return (
      <div>
        <button onClick={(e) => this.setOptions()}>set options</button>
        {this.showGraphTest()}
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
// update this example when done https://codesandbox.io/s/highcharts-react-demo-forked-ir31m?file=/demo.jsx:1585-1722
