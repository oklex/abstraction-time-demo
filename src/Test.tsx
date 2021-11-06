import React, { createRef } from "react";
import { render } from "react-dom";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import networkgraph from "highcharts/modules/networkgraph";
import { findDiff, getRandomInt } from "./utils";
import { TIMEOUT } from "dns";

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
  id: string;
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
  workingMemoryLimit: number;
  abstractionLimit: number;

  options: any;
  rootId: string;
}

interface ITestState {
  destinationId: string;
  activeMemory: IMemoryNode[];
  abstractionCapacityRemaining: number;

  running: boolean;
}

export class TestLogic extends React.Component<ITestProps, ITestState> {
  mychart: any;

  constructor(props: ITestProps) {
    super(props);
    this.mychart = createRef();
    this.state = {
      destinationId: "",
      activeMemory: [],
      abstractionCapacityRemaining: this.props.abstractionLimit,
      running: false,
    };
  }

  runTest = async () => {
    if (!this.state.destinationId) {
      this.generateDestination();
    }
    console.log("run test: ", this.state.activeMemory, this.props.rootId);
    this.setState({
      activeMemory: [...this.state.activeMemory, { id: this.props.rootId }],
    });
    while (!this.checkDestination() && !this.state.running) {
      this.setState({
        running: true,
      });
      await Promise.all([this.runTestStep()]).then(() => {
        this.setState({
          running: false,
        });
      });
    }
  };

  runTestStep = async () => {
    console.log("run test step: ", this.state.activeMemory);
    let activeMemoryLength: number = this.state.activeMemory.length;
    if (activeMemoryLength > 0) {
      // find all nodes from this one
      let mostRecentNode: IMemoryNode =
        this.state.activeMemory[activeMemoryLength - 1];
      let prevId: string = mostRecentNode.id;
      let nextNode: IMemoryNode;
      let nextNodeOptions: INode[] = this.getNodeDetails(prevId).linksFrom;
      // console.log("run test step: check node options -", nextNodeOptions);

      if (nextNodeOptions.length === 0) {
        throw new Error(
          "no next nodes: check whether this is a dead end or the destination"
        );
      }

      // identify next node
      let prevIdDiff: number = this.state.destinationId.length;
      await Promise.all([
        nextNodeOptions.forEach(async (node) => {
          let optionId = node.to;
          // console.log("run test step: check node for -", optionId);
          let currentIdDiff: number = findDiff(
            this.state.destinationId,
            optionId
          ).length;
          // console.log("run test step: check node one by one -", currentIdDiff);
          if (currentIdDiff < prevIdDiff) {
            // console.log("run test step: found a better match -", optionId);
            prevIdDiff = currentIdDiff;
            nextNode = {
              id: optionId,
              abstractionPath: this.checkAbstractionPath(optionId),
            };
            // console.log('next node:', nextNode)
          }
        }),
      ]).then(async () => {
        // console.log("run test step: update memory -", nextNode);
        await this.updateMemory(nextNode);
      });

      // call add to memory
    }
    return 0;
  };

  checkAbstractionPath = (nodeId: string) => {
    // add as many nodes to the path as is learned and can fit
    return [];
  };

  updateMemory = async (newItem: IMemoryNode) => {
    // console.log("update memory -", newItem, this.state.activeMemory);
    this.setState({
      activeMemory: this.state.activeMemory.concat([newItem]),
    });

    // check and update abstraction capacity
    let abstractPathLength: number = newItem.abstractionPath
      ? newItem.abstractionPath.length
      : 0;
    if (abstractPathLength > this.state.abstractionCapacityRemaining) {
      throw Error("abstraction path is too long");
    } else {
      this.setState({
        abstractionCapacityRemaining:
          this.state.abstractionCapacityRemaining - abstractPathLength,
      });
    }

    // check and update working memory
    if (this.state.activeMemory.length > this.props.workingMemoryLimit) {
      let abstractionToRemove: number = 0;
      let nodeToRemove: IMemoryNode = this.state.activeMemory[0];

      if (nodeToRemove && nodeToRemove.abstractionPath) {
        abstractionToRemove = nodeToRemove.abstractionPath.length;
      }
      this.setState({
        activeMemory: this.state.activeMemory.slice(1), // pop first item
        abstractionCapacityRemaining:
          this.state.abstractionCapacityRemaining - abstractionToRemove,
      });
    }

    // await this.updateColor()
    // console.log("update memory -", newItem, this.state.activeMemory);
  };

  generateDestination = (
    destinationDepth: number = this.props.depth,
    maxChildNodes: number = this.props.maxChildNodes
  ) => {
    //   console.log("set destination with: ", destinationDepth, maxChildNodes);
    //   let max: String | Number = "";
    //   for (let i = 0; i < destinationDepth; i++) {
    //     max = String(max) + String((maxChildNodes > 9)? 9 : maxChildNodes);
    //   }
    //   let combination = String(getRandomInt(0, Number(max)));
    //   // process number to remove illegal digits
    //   for (let i = 0; i < combination.length; i++) {
    //     console.log("checking each digit: ", combination[i]);
    //     if (Number(combination[i]) > maxChildNodes) {
    //       let preppendCombination: string =
    //         i - 1 >= 0 ? combination.slice(0, i - 1) : "";
    //       let appendCombination: string =
    //         i + 1 <= combination.length
    //           ? combination.slice(i + 1, combination.length)
    //           : "";
    //       combination =
    //         preppendCombination + String(maxChildNodes - 1) + appendCombination;
    //     }
    //   }
    this.setState({
      destinationId: "0000000000",
    });
    //   console.log("set destination as: ", combination);
    //   return combination;
  };

  checkDestination = () => {
    const memoryLength: number = this.state.activeMemory.length;
    if (
      memoryLength > 1 &&
      this.state.destinationId &&
      this.state.activeMemory[memoryLength - 1].id === this.state.destinationId
    ) {
      console.log("at destionation");
      return true;
    } else {
      // console.log('not at destionation')
      return false;
    }
  };

  updateColor = async () => {
    let allNodes = this.mychart.chart.series[0].nodes;
    // find the node with the right id
    await allNodes.forEach((node: any, index: number) => {
      this.state.activeMemory.map((memoryNode) => {
        if (node.id === memoryNode.id) {
          this.mychart.chart.series[0].nodes[index].update({
            color: "#aaa",
          });
        }
      });
    });
  };

  getNodeDetails = (nodeId: string) => {
    console.log('get node details')
    let nodes: INode[] = this.mychart.chart.series[0].nodes;
    let returnNode: any | null = null;
    console.log('nodes: ', nodes)
    for (let i = 0; i < nodes.length; i++) {
      console.log('get node details: ', nodes[i], nodeId)
      if (String(nodes[i].id) === String(nodeId)) {
        returnNode = nodes[i];
      }
    }
     if (!returnNode) {
       throw new Error("no return node was found in list:verify that this node id is correct")
     } else {
       console.log('node details found:', returnNode)
     return returnNode;
     }
  };

  render() {
    return (
      <div>
        <button
          onClick={() => {
            this.runTest();
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
