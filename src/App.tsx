import React, { createRef } from "react";
import { render } from "react-dom";
// Import Highcharts
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import networkgraph from "highcharts/modules/networkgraph";
import { GenerateSeries } from "./SeriesGenerator";

if (typeof Highcharts === "object") {
  networkgraph(Highcharts);
}

export default class App extends React.Component<any, any> {
  mychart: any;
  networkDepth: number;
  networkNodeChildren: number;

  constructor(props: any) {
    super(props);
    this.mychart = createRef();
    this.networkDepth = 10;
    this.networkNodeChildren = 5;

    this.state = {
      destinationId: [],
      activeMemory: [], // of type { id: string, path: string[] }

      workingMemoryLimit: 5,
      abstractionLimit: 5,
      abstractionCapacityRemaining: 5,

      options: {
        chart: {
          type: "networkgraph",
          marginTop: 80,
        },
        title: {
          text: "Network graph",
        },
        plotOptions: {
          networkgraph: {
            keys: ["from", "to"],
            layoutAlgorithm: {
              // enableSimulation: true,
              // linkLength: 66,
              integration: "verlet",
              approximation: "barnes-hut",
              gravitationalConstant: 0.8,
            },
          },
        },
        series: [
          {
            events: {
              // buggy
              // click: (e) => {
              //   console.log("series events", e);
              //   // this.onClick(e);
              //   this.updateColor(e);
              // },
            },
            marker: {
              radius: 7,
            },
            dataLabels: {
              enabled: true,
              linkFormat: "",
              allowOverlap: true,
            },
            data: GenerateSeries.linearPath(this.networkDepth).data,
          },
        ],
      },
    };
  }

  // runTestStep = (destination) => {
  //   if (this.state.activeMemory.length === 0) {
  //     console.log("running test step - starting at root");
  //     this.updateMemory({ id: 0 });
  //   } else {
  //     console.log(
  //       "running test step - active memory is:",
  //       this.state.activeMemory
  //     );
  //     let prev = this.state.activeMemory.at(-1);
  //     let prevId;
  //     if (prev.path && prev.path.length > 1) {
  //       prevId = prev.path.at(-1);
  //     } else {
  //       prevId = prev.id;
  //     }
  //     console.log("prevId:", prevId, prev);

  //     let nodes = this.mychart.chart.series[0].nodes; // linksFrom: [{options: { from: string, to: string }}] and linksTo: [{options: { from: string, to: string }}]
  //     // for each node, if the ID is the most recent node, then check nodes
  //     for (let i = 0; i < nodes.length; i++) {
  //       if (nodes[i].id === String(prevId)) {
  //         console.log(
  //           "linksFrom:",
  //           nodes[i].linksFrom,
  //           nodes[i].linksFrom[0].to
  //         );
  //         // assume index 0 for now
  //         let newId = nodes[i].linksFrom[0].to;
  //         this.updateMemory({
  //           id: String(newId),
  //           path: [],
  //         });
  //         break;
  //       }
  //     }

  //     // get all edges for this node -> select the best fit node to add to memory next
  //     //    if this node is "learned" then check the next one (up to abstraction capcity)
  //     //    if multiple nodes in-sequence are "learned" then abstract them into a path
  //   }
  // };

  // updateMemory = (newItem = { id: "", path: [] }) => {
  //   this.setState({
  //     activeMemory: this.state.activeMemory.push(newItem),
  //   });
  //   console.log("updateMemory - state:", this.state.activeMemory);
  //   if (newItem.path && newItem.path.length > 1) {
  //     if (newItem.path.length > this.state.abstractionCapacityRemaining)
  //       throw Error("abstraction path is too long");
  //     this.setState({
  //       abstractionCapacityRemaining:
  //         this.state.abstractionCapacityRemaining - newItem.path.length,
  //     });
  //   }
  //   if (this.state.activeMemory.length > this.state.workingMemoryLimit) {
  //     this.setState({
  //       activeMemory: this.state.activeMemory.shift(),
  //     });
  //   }
  //   // if working memory exceeds capacity, then "forget" the first node
  //   //    -> if that node is an abstraction, then update capacity
  //   //
  // };

  updateColor = async (e: any) => {
    let nodes = this.mychart.chart.series[0].nodes;
    // find the node with the right id
    await nodes.forEach((node: any, index: number) => {
      if (node.id === e.point.id) {
        this.mychart.chart.series[0].nodes[index].update({
          color: "#aaa",
        });
      }
    });
  };

  getNodeDetails = (nodeId: string) => {
    let nodes = this.mychart.chart.series[0].nodes;
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === nodeId) {
        return nodes[i];
      }
    }
  };

  render() {
    return (
      <div>
        <button
          onClick={() => {
            console.log("testLogic class not initialized");
          }}
        >
          run test
        </button>
        <HighchartsReact
          ref={(element) => (this.mychart = element)}
          highcharts={Highcharts}
          options={this.state.options}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
// update this example when done https://codesandbox.io/s/highcharts-react-demo-forked-ir31m?file=/demo.jsx:1585-1722
