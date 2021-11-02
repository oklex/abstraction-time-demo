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

let data = GenerateSeries.linearPath(7).data;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.mychart = createRef();

    this.state = {
      destinationPath: [],
      activeMemory: [], // of type { id: string, path: string[] }

      workingMemoryLimit: 5,
      workingMeoryCapacityRemaining: 5,
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
              enableSimulation: true,
              linkLength: 66,
              integration: "verlet",
              approximation: "barnes-hut",
              gravitationalConstant: 0.8,
            },
          },
        },
        series: [
          {
            events: {
              click: (e) => {
                console.log("series events", e);
                // this.onClick(e);
                this.updateColor();
              },
            },
            marker: {
              radius: 7,
            },
            dataLabels: {
              enabled: true,
              linkFormat: "",
              allowOverlap: true,
            },
            data: data,
          },
        ],
      },
    };
  }

  componentDidMount = () => {
    // update to the first test case
    this.updateTestCase();
  };

  updateTestCase = () => {
    // go to the next test case - match the correct function to update state.options
    // update and auto-generate the nodes and series in options
    // MVP - select the test case manually
  };

  runTest = () => {
    // generate destination node
    //    -> if the node exists, then make it the destination
    // run tests one by one
    //  if the test case is linear, go from end to end
    //  if the test case is traversal, then run an algo
    //  if the test case is simulation, then randomly generate paths
    
    // run updateMemory on loop
  };

  updateMemory = () => {
    // get lowest node in memory, or if memory is empty, set to root
    // get all edges for this node -> select the best fit node to add to memory next
    //    if this node is "learned" then check the next one (up to abstraction capcity)
    //    if multiple nodes in-sequence are "learned" then abstract them into a path
    // if working memory exceeds capacity, then "forget" the first node
    //    -> if that node is an abstraction, then update capacity
    // 
  };

  updateColor = () => {
    let myserie = this.state.options.series;
    myserie[0].nodes[0].color = "red";
    console.log("series", this.mychart.chart.series[0].nodes);
    // nodes show up in order listed
    // this.setState({ options: { series: myserie } });
    this.mychart.chart.series[0].nodes[0].update({
      color: "#aaa",
    });
  };

  render() {
    return (
      <div>
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
