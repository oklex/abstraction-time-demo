import React, { createRef } from "react";
import { render } from "react-dom";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import networkgraph from "highcharts/modules/networkgraph";
import { findDiff } from "./utils";
import { GenerateOptions } from "./SeriesGenerator";

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
  to: string;
  from: string;
}

type Any = any;

interface ITestProps {
  depth: number;
  maxChildNodes: number;
  workingMemoryLimit: number;
  abstractionLimit: number;
  nodePaths: ILinks[];

  rootId: string;
}

interface ITestState {
  destinationId: string;
  activeMemory: IMemoryNode[];
  abstractionCapacityRemaining: number;

  options: any;
  nodeSettings: any[];

  showGraph: boolean;
}

const hexColor: string = "FF5733";

export class TestLogic extends React.Component<ITestProps, ITestState> {
  mychart: any;

  constructor(props: ITestProps) {
    super(props);
    this.mychart = createRef();
    this.state = {
      destinationId: "",
      activeMemory: [],
      abstractionCapacityRemaining: this.props.abstractionLimit,
      options: {},
      nodeSettings: [],
      showGraph: false,
    };
  }

  componentDidMount = () => {
    console.log("paths in props: ", this.props.nodePaths);
    this.setState({
      options: GenerateOptions(this.props.nodePaths, this.state.nodeSettings),
      showGraph: true,
    });
  };

  startTest = async () => {
    if (this.checkDestination()) {
      console.log("already at destination");
      return;
    }
    if (!this.state.destinationId) {
      await this.generateDestination().then(() => {
        console.log("start test: ", this.state.activeMemory, this.props.rootId);
        this.setState({
          activeMemory: [...this.state.activeMemory, { id: this.props.rootId }],
        });
      });
    }
  };

  runTestStep = async () => {
    if (this.checkDestination()) {
      console.log("already at destination");
      return;
    }

    console.log("run test step: ", this.state.activeMemory);
    let activeMemoryLength: number = this.state.activeMemory.length;
    if (activeMemoryLength > 0) {
      // find all nodes from this one
      let mostRecentNode: IMemoryNode =
        this.state.activeMemory[activeMemoryLength - 1];
      let prevId: string = mostRecentNode.id;
      let nextNode: IMemoryNode;

      let nextNodeOptions: ILinks[] = [];

      // this should be an async forEach
      for (let i = 0; i < this.props.nodePaths.length; i++) {
        console.log("match node details");
        if (String(this.props.nodePaths[i].from) === String(prevId)) {
          console.log("match found", this.props.nodePaths[i]);
          nextNodeOptions.push(this.props.nodePaths[i]);
          break;
        }
      }
      // then
      console.log("node details", nextNodeOptions);
      if (nextNodeOptions.length === 0) {
        throw new Error(
          "no next nodes: check whether this is a dead end or the destination"
        );
      }

      // then
      // identify next node
      let prevIdDiff: number = this.state.destinationId.length;
      console.log('nextNodeOptions', nextNodeOptions, this.props.nodePaths) // nextNodeOptions is wrong
      return await Promise.all([
        nextNodeOptions.forEach(async (node: ILinks) => {
          let optionId: string = node.to;
          console.log("run test step: check if node is best choice", optionId);
          let currentIdDiff: number = findDiff(
            this.state.destinationId,
            optionId
          ).length;
          console.log("run test step: check node one by one -", currentIdDiff);
          if (currentIdDiff < prevIdDiff) {
            console.log("run test step: found a better match -", optionId);
            prevIdDiff = currentIdDiff;
            nextNode = {
              id: optionId,
              abstractionPath: this.checkAbstractionPath(optionId),
            };
            // console.log('next node:', nextNode)
          }
        }),
      ]).then(async () => {
        console.log("run test step: update memory -", nextNode);
        await Promise.all([this.updateMemory(nextNode)]).then(async () => {
          await this.updateColor()
            .then(() => {
              console.log("done entire step");
            })
            .catch(() => {
              throw new Error("update color failed");
            });
        });
      });
      // });
      // console.log("run test step: check node options -", nextNodeOptions);

      // call add to memory
    }
  };

  checkAbstractionPath = (nodeId: string) => {
    // add as many nodes to the path as is learned and can fit
    return [];
  };

  updateMemory = async (newItem: IMemoryNode) => {
    console.log("update memory -", newItem, this.state.activeMemory);
    this.setState({
      activeMemory: this.state.activeMemory.concat([newItem]),
    });

    // check and update abstraction capacity
    console.log('abstractionPath? ', newItem.abstractionPath)
    let abstractPathLength: number =  newItem.abstractionPath
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
  };

  generateDestination = async (
    destinationDepth: number = this.props.depth,
    maxChildNodes: number = this.props.maxChildNodes
  ) => {
    let Promises: any = [];
    let destination: string = "0"; // start at root 0
    for (let i = 0; i < destinationDepth - 1; i++) {
      Promises.push(
        this.addRandomDigit(maxChildNodes, (num: string) => {
          console.log('random num', num , ' out of ', destinationDepth); (destination += num);
        })
      );
    }
    return await Promise.all(Promises).then(() => {
      console.log(`destination set to ${destination}`)
      this.setState({
        destinationId: destination
      })
    });
    //https://stackoverflow.com/questions/11488014/asynchronous-process-inside-a-javascript-for-loop
  };

  addRandomDigit = async (limit: number, callback: (num: string) => any) => {
    let newLimit = limit > 9 ? 9 : limit;
    let min = Math.ceil(0);
    let max = Math.floor(newLimit);
    let random = Math.floor(Math.random() * (max - min + 1)) + min;
    callback(String(random));
  };

  checkDestination = () => {
    const memoryLength: number = this.state.activeMemory.length;
    if (
      memoryLength > 1 &&
      this.state.destinationId &&
      this.state.activeMemory[memoryLength - 1].id === this.state.destinationId
    ) {
      console.log("at destination", this.state.destinationId.length);
      return true;
    } else {
      // console.log('not at destionation')
      return false;
    }
  };

  // update according to: https://github.com/highcharts/highcharts-react#optimal-way-to-update
  updateColor = async () => {
    console.log(
      "update color",
      this.state.activeMemory,
      this.state.nodeSettings
    );
    // for each activeMemory, if it exists in node settings, then change it, else create it
    let newNodeSettings: any[] = [];
    console.log("activeMemory in updateColor", this.state.activeMemory);
    return await Promise.all([
      this.state.activeMemory.forEach((node: any, index: number) => {
        console.log("acitve memory in updateColor", node);
        newNodeSettings.push({
          id: node.id,
          color: "#" + hexColor,
        });
      }),
      this.setState({
        showGraph: false,
      }),
    ])
      .then(() => {
        console.log("newNodeSettings", newNodeSettings);
        this.setState({
          options: GenerateOptions(this.props.nodePaths, newNodeSettings),
          showGraph: true,
        });
      })
      .finally(() => {
        setTimeout(() => {}, 1000);
      });
  };

  // getNodeDetails = (nodeId: string) => {
  //   var returnNode: any | null = null;

  //   for (let i = 0; i < this.state.nodeDetails.length; i++) {
  //     console.log(
  //       "match node details",
  //       String(nodeId),
  //       String(this.state.nodeDetails[i].id),
  //       String(nodeId) === String(this.state.nodeDetails[i].id)
  //     );
  //     if (String(this.state.nodeDetails[i].id) === String(nodeId)) {
  //       returnNode = this.state.nodeDetails[i];
  //       console.log("found a matching node detail", returnNode);
  //       // return this.state.nodeDetails[i];
  //       break;
  //     }
  //   }
  //   return returnNode;

  // await Promise.all([
  //   this.state.nodeDetails.map((details) => {
  //     console.log(
  //       "match node details",
  //       String(nodeId),
  //       String(details.id),
  //       String(nodeId) === String(details.id)
  //     );
  //   }),
  // ]).then((returnVal: any[]) => {
  //   console.log("return", returnVal, returnNode);
  //   return returnNode;
  // });
  // // .then(() => {
  // //   if (!returnNode) {
  // //     throw new Error(
  // //       "no return node was found in list: verify that this node id is correct"
  // //     );
  // //   }
  // // });
  // };

  showGraph = () => {
    console.log("show graph?", this.state.showGraph);
    if (this.state.showGraph) {
      return (
        <HighchartsReact
          ref={(element) => (this.mychart = element)}
          highcharts={Highcharts}
          options={this.state.options}
        />
      );
    } else {
      return <div></div>;
    }
  };

  render() {
    return (
      <div>
        <br />
        <button
          onClick={() => {
            this.startTest();
          }}
        >
          start test
        </button>
        <button
          onClick={() => {
            this.runTestStep();
          }}
        >
          run test step
        </button>
        {this.showGraph()}
      </div>
    );
  }
}
