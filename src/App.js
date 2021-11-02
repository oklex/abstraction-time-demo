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

export default class App extends React.Component {
  constructor(props) {
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

  getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  };

  generateDestination = () => {
    // generate destination node
    //    -> if the node exists, then make it the destination
    let max = ""; // path legnth x number of children
    for (let i = 0; i < this.networkDepth; i++) {
      max = String(max) + String(this.networkNodeChildren);
    }
    let randomNumber = this.getRandomInt(0, Number(max));
    // process number to remove illegal digits

    return randomNumber;
  };

  runTest = () => {
    // this.generateDestination();
    let destination = ""; // path legnth x number of children
    for (let i = 0; i < this.networkDepth; i++) {
      destination = String(destination) + String(0);
    }

    
    //  if the test case is linear, go from end to end
    //  if the test case is traversal, then run an algo
    //  if the test case is simulation, then randomly generate paths


    // run updateMemory on loop
    while(this.state.activeMemory && !this.checkDestination(destination)) {
      this.runTestStep(destination);
    }
  };

  checkDestination = (destination) => {
    let prev = this.state.activeMemory.at(-1);
    if (!prev) return false;
    console.log(prev)
    if (prev.id === destination || (prev.path && prev.path.length > 1 && prev.path.at(-1) === destination)) {
      return true; // is destination
    } else return false;
  }

  runTestStep = (destination) => {
    console.log('running test step')
    if (this.state.activeMemory.length === 0) {
      this.updateMemory({ id: 0 });
    } else {
      let prev = this.state.activeMemory.at(-1);
      let prevId;
      if (prev.path && prev.path.length > 1) {
        prevId = prev.path.at(-1)
      } else prevId = prev.id

      // get all edges for this node -> select the best fit node to add to memory next
      //    if this node is "learned" then check the next one (up to abstraction capcity)
      //    if multiple nodes in-sequence are "learned" then abstract them into a path
    }
  };

  updateMemory = (newItem = { id: "", path: [] }) => {
    this.setState({
      activeMemory: this.state.activeMemory.concat(newItem),
    });
    if (newItem.path && newItem.path.length > 1) {
      if (newItem.path.length > this.state.abstractionCapacityRemaining)
        throw Error("abstraction path is too long");
      this.setState({
        abstractionCapacityRemaining:
          this.state.abstractionCapacityRemaining - newItem.path.length,
      });
    }
    if (this.state.activeMemory.length > this.state.workingMemoryLimit) {
      this.setState({
        activeMemory: this.state.activeMemory.shift(),
      });
    }
    // if working memory exceeds capacity, then "forget" the first node
    //    -> if that node is an abstraction, then update capacity
    //
  };

  updateColor = async (e) => {
    let nodes = this.mychart.chart.series[0].nodes;
    // find the node with the right id
    await nodes.forEach((node, index) => {
      if (node.id === e.point.id) {
        this.mychart.chart.series[0].nodes[index].update({
          color: "#aaa",
          // marker: { radius: 15 },
          // link: {
          //   length: 50
          // }
        });
      }
    });
  };

  render() {
    return (
      <div>
        <button onClick={() => this.runTest()}>run test</button>
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
