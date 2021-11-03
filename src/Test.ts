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
export class TestLogic {
  depth: number;
  maxChildNodes: number;
  rootId: string;
  updateColor: (id: string, status: string) => {};
  getNodeDetails: (id: string) => INode;

  destinationId: string = "";
  activeMemory: IMemoryNode[] = [];

  constructor(
    depth: number,
    maxChildNodes: number,
    updateColorCallback: (id: string, status: string) => {},
    getNodeDetails: (id: string) => any,
    rootId: string
  ) {
    this.depth = depth;
    this.maxChildNodes = maxChildNodes;
    this.rootId = rootId;
    this.updateColor = updateColorCallback;
    this.getNodeDetails = getNodeDetails;
  }

  runTest = () => {
    this.activeMemory.push({ id: this.rootId });
    while (!this.checkDestination()) {
      setTimeout(() => this.runTestStep(), 1000);
      break;
    }
  };

  runTestStep = () => {
    // find next node
    // add to memory
    return 0;
  };

  findNextNode = () => {
    // get node details for this most recent node by ID
    let mostRecentIndex: number = this.activeMemory.length - 1;
    let mostRecentNode: IMemoryNode = this.activeMemory[mostRecentIndex];
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

    if (nodeDetails.linksFrom) {
      return nodeDetails.linksFrom[0].to;
    } else {
      throw Error("no links from this node exist");
    }
  };

  generateDestination = (
    destinationDepth: number = this.depth,
    maxChildNodes: number = this.maxChildNodes
  ) => {
    let max: String | Number = "";
    for (let i = 0; i < destinationDepth; i++) {
      max = String(max) + String(destinationDepth);
    }
    let combination = String(getRandomInt(0, Number(max)));
    // process number to remove illegal digits
    for (let i = 0; i < combination.length; i++) {
      if (Number(combination[i]) > this.maxChildNodes) {
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
    this.destinationId = combination;
    return combination;
  };

  checkDestination = () => {
    const memoryLength: number = this.activeMemory.length;
    if (
      memoryLength > 1 &&
      this.destinationId &&
      this.activeMemory[memoryLength - 1].id === this.destinationId
    ) {
      return true;
    } else {
      return false;
    }
  };

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
}

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};
