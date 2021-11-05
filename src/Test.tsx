import React, { createRef } from "react";
import { render } from "react-dom";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import networkgraph from "highcharts/modules/networkgraph";

if (typeof Highcharts === "object") {
  networkgraph(Highcharts);
}

export interface IMemoryNode extends Iid {
  abstractionPath?: Iid[];
}

interface Iid {
  id: string;
}

interface INode extends Any {
  linksFrom: ILinks[];
  linksTo: ILinks[];
}

interface ILinks extends Any {
  to?: string;
  from?: string;
}

type Any = any;

interface ITestProps {
  depth: number;
  maxChildNodes: number;
  workingMemoryLimit: number,
  abstractionLimit: number,

  options: any;
  rootId: string;
}

interface ITestState {
  destinationId: string;
  activeMemory: IMemoryNode[];
  abstractionCapacityRemaining: number;
}

export class TestLogic extends React.Component<ITestProps, ITestState> {
  mychart: any;

  constructor(props: ITestProps) {
    super(props);
    this.mychart = createRef();
    this.state = {
      destinationId: "",
      activeMemory: [],
      abstractionCapacityRemaining: this.props.abstractionLimit
    };
  }

  runTest = () => {
    console.log("run test: ", this.state.activeMemory, this.props.rootId);
    this.setState({
      activeMemory: [...this.state.activeMemory, { id: this.props.rootId }],
    });
    while (!this.checkDestination()) {
      setTimeout(() => this.runTestStep(), 1000);
      break;
    }
  };

  runTestStep = () => {
    console.log('run test step', this);
    // find next node
    // add to memory
    return 0;
  };

  findNextNode = () => {
    // get node details for this most recent node by ID
    let mostRecentIndex: number = this.state.activeMemory.length - 1;
    let mostRecentNode: IMemoryNode = this.state.activeMemory[mostRecentIndex];
    let lastNodeId: string;

    if (
      mostRecentNode.abstractionPath &&
      mostRecentNode.abstractionPath.length > 1
    ) {
      const abstractionPath = mostRecentNode.abstractionPath;
      const mostRecentPathIndex: number =
        mostRecentNode.abstractionPath.length - 1;
      lastNodeId = abstractionPath[mostRecentPathIndex].id;
    } else {
      lastNodeId = mostRecentNode.id;
    }

    const nodeDetails: any = this.getNodeDetails(lastNodeId);
    // if multiple nodes branch from here, then find the best matching child with the destination path

    if (nodeDetails && nodeDetails.linksFrom) {
      return nodeDetails.linksFrom[0].to;
    } else {
      throw Error("no links from this node exist");
    }
  };

  generateDestination = (
    destinationDepth: number = this.props.depth,
    maxChildNodes: number = this.props.maxChildNodes
  ) => {
    let max: String | Number = "";
    for (let i = 0; i < destinationDepth; i++) {
      max = String(max) + String(destinationDepth);
    }
    let combination = String(getRandomInt(0, Number(max)));
    // process number to remove illegal digits
    for (let i = 0; i < combination.length; i++) {
      if (Number(combination[i]) > this.props.maxChildNodes) {
        let preppendCombination: string =
          i - 1 >= 0 ? combination.slice(0, i - 1) : "";
        let appendCombination: string =
          i + 1 <= combination.length
            ? combination.slice(i + 1, combination.length)
            : "";
        combination =
          preppendCombination + String(maxChildNodes - 1) + appendCombination;
      }
    }
    this.setState({
      destinationId: combination,
    });
    return combination;
  };

  checkDestination = () => {
    const memoryLength: number = this.state.activeMemory.length;
    if (
      memoryLength > 1 &&
      this.state.destinationId &&
      this.state.activeMemory[memoryLength - 1].id === this.state.destinationId
    ) {
      return true;
    } else {
      return false;
    }
  };

  
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
            this.runTest()
          }}
        >
          run test
        </button>
        <HighchartsReact
          ref={(element) => (this.mychart = element)}
          highcharts={Highcharts}
          options={this.props.options}
        />
      </div>
    );
  }
}

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};


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