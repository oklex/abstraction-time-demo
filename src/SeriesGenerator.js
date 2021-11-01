// generate for a linear case (depth, knowledge level)
// generate a random tree (depth, max nodes, knowledge level)

export const GenerateSeries = {
    linearPath (depth, knowledge = 0) {
        let data = TreeGenerator(0, depth, "linearPath-", 3);
        let nodes = [];
        return { data, nodes }
    },
    randomTree (depth, maxNodes = 1, knowledge = 0) {
        let data = [];
        let nodes = [];
        return { data, nodes }
    },
    randomNetwork (depth, maxNodes = 1, knowledge = 0) {
        // different from tree due to random connections
        let data = [];
        let nodes = [];
        return { data, nodes }
    }
}

const TreeGenerator = (currentDepth, maxDepth, parentNode = "", maxNodes, data = {}, random = false) => {
    let newData = []
    newData = newData.concat(data);

    for ( let i = 0; i < maxNodes; i++ ) {
        let thisNode = parentNode.concat(i.toString());
        console.log(thisNode);
        newData = newData.concat({
            from: parentNode,
            to: thisNode
        })
        if ( currentDepth < maxDepth ) newData = newData.concat(TreeGenerator(currentDepth + 1, maxDepth, thisNode, maxNodes, newData, random))
    }

    return newData
}


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