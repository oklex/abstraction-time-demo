// generate for a linear case (depth, knowledge level)
// generate a random tree (depth, max nodes, knowledge level)

export const GenerateSeries = {
  linearPath(depth, knowledge = 0) {
    let maxChildren = 1;
    let data = TreeGenerator(depth, "", maxChildren, knowledge);
    console.log("linearPath", data);
    return data;
  },
  n_aryTree(depth, maxNodes = 1, knowledge = 0) {
    let data = TreeGenerator(depth, "", maxNodes, knowledge);
    console.log(`${maxNodes}_ary tree`, data);
    return data;
  },
  randomNetwork(depth, maxNodes = 1, knowledge = 0) {
    // different from tree due to random connections
    let data = [];
    return data;
  },
};

const TreeGenerator = (
  maxDepth,
  append = "",
  maxChildren,
  knowledge,
  random = false
) => {
  return TreeGeneratorHelper(1, maxDepth, maxChildren, append.concat("0"));
};

const TreeGeneratorHelper = (
  previousDepth,
  maxDepth,
  maxChildren,
  parentNodeId
) => {
  // recursively returns the new data
  let currentDepth = previousDepth + 1;
  let returnData = [];
  let data = [];
  for (let i = 0; i < maxChildren; i++) {
    let thisNode = parentNodeId.concat(i.toString());
    console.log("new node id:", thisNode, currentDepth);
    returnData.push({
      from: parentNodeId,
      to: thisNode,
    });
    if (currentDepth < maxDepth) {
      console.log("call recurrsive", currentDepth, maxDepth, thisNode);
      let childrenData = TreeGeneratorHelper(
        currentDepth,
        maxDepth,
        maxChildren,
        thisNode
      );
      data = data.concat(childrenData);
      console.log(
        "DATA - suspect it is not inclusive",
        childrenData,
        data,
        ` - should be children of ${thisNode}`
      );
    }
  }
  return returnData.concat(data);
};

export const GenerateOptions = (customData, customNodeDetails = []) => {
  return {
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
        data: customData,
        nodes: customNodeDetails,
      },
    ],
  };
};

// data: [
//     {
//       from: "0-0",
//       to: "1-0"
//     },
//     {
//       from: "0-0",
//       to: "1-2"
//     },
//     {
//       from: "0-0",
//       to: "1-1"
//     }
//   ],
//   nodes: [
//     {
//       id: "1-0",
//       marker: { radius: 15 }
//     },
//     {
//       id: "1-1",
//       marker: { radius: 15 }
//     }
//   ]
