import React, { createRef } from "react";
import { render } from "react-dom";
import { GenerateOptions, GenerateSeries } from "./SeriesGenerator";
import { TestLogic } from "./Test";

enum networkType {
  path,
  tree,
  network,
}
export default class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      depth: 10,
      maxChildNodes: 5,
      workingMemoryLimit: 4,
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

  setOptions = (depth: number, type: networkType) => {
    let paths: any[];
    if (type === networkType.path) {
      console.log("setting linear paths");
      paths = GenerateSeries.linearPath(this.state.depth);
    } else if (type === networkType.tree) {
      paths = GenerateSeries.n_aryTree(this.state.depth, this.state.maxChildNodes);
    } else if (type === networkType.network) {
      paths = GenerateSeries.n_aryTree(this.state.depth, this.state.maxChildNodes);
    } else {
      throw new Error('option network graph setting is invalid')
    }
    console.log("setting paths ", paths);
    this.setState({
      toggleShowGraph: true,
      paths,
    });
  };

  render() {
    return (
      <div>
        <button onClick={() => this.setOptions(10, networkType.path)}>
          set options for linear path
        </button>
        <button onClick={() => this.setOptions(10, networkType.tree)}>
          set options for tree
        </button>
        <button onClick={() => this.setOptions(10, networkType.network)}>
          set options for network
        </button>
        {this.showGraphTest()}
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
// update this example when done https://codesandbox.io/s/highcharts-react-demo-forked-ir31m?file=/demo.jsx:1585-1722
