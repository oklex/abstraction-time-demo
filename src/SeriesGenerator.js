// generate for a linear case (depth, knowledge level)
// generate a random tree (depth, max nodes, knowledge level)

export const GenerateSeries = {
  linearPath(depth, knowledge = 0) {
    let maxChildren = 1;
    let data = TreeGenerator(depth, "path", maxChildren, knowledge);
    let nodes = [];
    console.log(data);
    return { data, nodes };
  },
  randomTree(depth, maxNodes = 1, knowledge = 0) {
    let data = [];
    let nodes = [];
    return { data, nodes };
  },
  randomNetwork(depth, maxNodes = 1, knowledge = 0) {
    // different from tree due to random connections
    let data = [];
    let nodes = [];
    return { data, nodes };
  },
};

const TreeGenerator = (
  maxDepth,
  append = "",
  maxChildren,
  knowledge,
  random = false
) => {
  let data = [];
  return TreeGeneratorHelper(
    1,
    maxDepth,
    maxChildren,
    append.concat("-0")
  );
};

const TreeGeneratorHelper = (
  currentDepth,
  maxDepth,
  maxChildren,
  parentNodeId
) => {
  // recursively returns the new data
  let data = [];
  for (let i = 0; i < maxChildren; i++) {
    let thisNode = parentNodeId.concat(i.toString());
    data = data.concat({
        from: parentNodeId,
        to: thisNode
    })
    console.log(thisNode);
    if (currentDepth < maxDepth) {
      data = data.concat(
        TreeGeneratorHelper(currentDepth + 1, maxDepth, maxChildren, thisNode)
      );
    }
  }

  return data;
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
