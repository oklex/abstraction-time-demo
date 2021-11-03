
export interface IMemoryNode extends INode {
    abstractionPath?: INode;
}

interface INode {
    id: string
}

export class TestLogic {
    depth: number;
    maxChildNodes: number;
    rootId: string;
    updateColor: (id: string, status: string) => {};
    getNodeDetails: (id: string) => any


    destinationId: string = ""
    activeMemory: IMemoryNode[] = []

    constructor(depth: number, maxChildNodes: number, updateColorCallback: (id: string, status: string) => {}, getNodeDetails: (id: string) => any, rootId: string) {
        this.depth = depth;
        this.maxChildNodes = maxChildNodes;
        this.rootId = rootId;
        this.updateColor = updateColorCallback;
        this.getNodeDetails = getNodeDetails;
    }

    runTest = () => {
        this.activeMemory.push({ id: this.rootId })
        while (!this.checkDestination()) {
            setTimeout(() => this.runTestStep(), 1000);
            break;
        }
    }

    runTestStep = () => {
        return 0;
    }

    findNextNode = () => {
        // get node details for this most recent node by ID

        // if multiple nodes branch from here, then find the best matching child with the destination path

    }

    generateDestination = (destinationDepth: number = this.depth, maxChildNodes: number = this.maxChildNodes) => {
        let max: String | Number = "";
        for (let i = 0; i < destinationDepth; i++) {
            max = String(max) + String(destinationDepth);
        }
        let combination = String(getRandomInt(0, Number(max)));
        // process number to remove illegal digits
        for (let i = 0; i < combination.length; i++) {
            if (Number(combination[i]) > this.maxChildNodes) {
                let preppendCombination: string = (i - 1 >= 0 ? combination.slice(0, i - 1) : "")
                let appendCombination: string = (i + 1 <= combination.length ? combination.slice(i + 1, combination.length) : "")
                combination = preppendCombination + String(maxChildNodes - 1) + appendCombination;
            }
        }
        this.destinationId = combination;
        return combination;
    }

    checkDestination = () => {
        const memoryLength: number = this.activeMemory.length;
        if (memoryLength > 1 && this.destinationId && this.activeMemory[memoryLength - 1].id === this.destinationId) {
            return true;
        } else {
            return false;
        }
    }
}

const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};