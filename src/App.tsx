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
      depth: 20,
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
      console.log('showing graph', this.state.depth, this.state.maxChildNodes, this.state.workingMemoryLimit)
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
      paths = GenerateSeries.linearPath(depth);
    } else if (type === networkType.tree) {
      paths = GenerateSeries.n_aryTree(depth, this.state.maxChildNodes);
    } else if (type === networkType.network) {
      paths = GenerateSeries.n_aryTree(depth, this.state.maxChildNodes);
    } else {
      throw new Error("option network graph setting is invalid");
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
        <button onClick={() => this.setOptions(this.state.depth, networkType.path)}>
          set options for linear path
        </button>
        <button onClick={() => this.setOptions(this.state.depth, networkType.tree)}>
          set options for tree
        </button>
        <button onClick={() => this.setOptions(this.state.depth, networkType.network)}>
          set options for network
        </button>
        {this.showGraphTest()}
        <br />
        <div>
          <p>to-do next</p>
          <ul>
            <li>update destination generation logic</li>
            <li>integrate abstraction path logic</li>
            <li>create the tree path generation logic</li>
            <li>verify the tree path verification logic</li>
          </ul>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
// update this example when done https://codesandbox.io/s/highcharts-react-demo-forked-ir31m?file=/demo.jsx:1585-1722
