import { readFileSync } from 'fs';
import { MinHeap } from 'mnemonist';
import { Vector } from 'vector2d';

/*
MY THOUGHS:
  Pretty fun challenge today. It's just some maze solving and
part B wasn't that much different. The hardest part was implementing Dijkstra's
algorithm since it's been a while since I've done it
  Overall, not much to say. It's pretty good.

  Also I added Mnemonist because I need the data structures now.
*/

// Maze solving lets go

/*
The plan is to read the map and use Dijkstra's algorithm
to find the best path. I don't feel like implementing A* even
though it would solve it faster. 
*/

/* The grid setup */
type Node = {
  location: Vector;
  height: number;
};

/* Read the input data */
const heightMapRaw = readFileSync('./inputs/day12.txt', 'utf-8');

const rows = heightMapRaw.split('\n').filter((s) => s !== '');
const unprocessedGrid = rows.map((row) => {
  const cols = row.split('');
  return cols;
});

function getHeight(heightLetter: string) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  return alphabet.indexOf(heightLetter);
}

/* Convert the data to nodes */
function getNodes(): {
  nodes: Node[][];
  startingNode: Vector;
  endingNode: Vector;
} {
  let startingNode: Node;
  let endingNode: Node;
  const nodes: Node[][] = [];

  for (let row = 0; row < unprocessedGrid.length; row++) {
    nodes[row] = [];

    for (let col = 0; col < unprocessedGrid[row].length; col++) {
      const elevation = unprocessedGrid[row][col];
      let node: Node;

      // Starting node
      if (elevation === 'S') {
        node = {
          location: new Vector(row, col),
          height: getHeight('a'),
        };

        startingNode = node;
      }
      // Ending node
      if (elevation === 'E') {
        node = {
          location: new Vector(row, col),
          height: getHeight('z'),
        };

        endingNode = node;
      }
      // Any other node
      else {
        node = {
          location: new Vector(row, col),
          height: getHeight(elevation),
        };
      }

      nodes[row][col] = node;
    }
  }

  return {
    nodes: nodes,
    startingNode: startingNode.location,
    endingNode: endingNode.location,
  };
}

/*
Part A
  Find the shortest path to the ending node. The pathfinding
can only go up by one level, but can go down any number.
*/

// Less efficient than A*, but I don't feel like doing more
function dijkstraPathfind(
  grid: Node[][],
  startingNodes: Node[],
  endingNode: Node
): Node[] {
  const allNodes = grid.flat();

  // Keep track of the shortest distances so far and the path to it
  const distances = new Map<Node, number>();
  const previousNode = new Map<Node, Node>();

  // Fill the maps and searchQueue
  for (const node of allNodes) {
    if (!startingNodes.includes(node)) {
      distances.set(node, Number.MAX_VALUE);
    }
  }

  startingNodes.forEach((n) => distances.set(n, 0));

  // Queue for searching
  const searchQueue = MinHeap.from(allNodes, (a, b) => {
    const distA = distances.get(a);
    const distB = distances.get(b);

    if (distA < distB) return -1;
    if (distA > distB) return 1;
    return 0;
  });

  function tracePath(node: Node): Node[] {
    const path: Node[] = [];

    let currentNode = node;
    while (previousNode.get(currentNode)) {
      path.push(previousNode.get(currentNode));
      currentNode = previousNode.get(currentNode);
    } 

    return path.reverse();
  }

  // Search
  while (searchQueue.size > 0) {
    // Get the current best
    const node = searchQueue.pop();

    // Terminate if we have found the best path
    if (node === endingNode) {
      return tracePath(node);
    }

    // Get Neighbors
    const neighbors: Node[] = [];
    const pos = node.location;

    if (grid[pos.x - 1]) {
      const up = grid[pos.x - 1][pos.y];
      if (up && up.height <= node.height + 1) neighbors.push(up);
    }

    if (grid[pos.x + 1]) {
      const down = grid[pos.x + 1][pos.y];
      if (down && down.height <= node.height + 1) neighbors.push(down);
    }

    const left = grid[pos.x][pos.y - 1];
    if (left && left.height <= node.height + 1) neighbors.push(left);

    const right = grid[pos.x][pos.y + 1];
    if (right && right.height <= node.height + 1) neighbors.push(right);

    // Search neighbors
    for (const neighbor of neighbors) {
      // Change in distance is 1
      const newDist = distances.get(node) + 1;

      // if the new distance is faster
      if (newDist < distances.get(neighbor)) {
        // Update the distance and previous
        distances.set(neighbor, newDist);
        previousNode.set(neighbor, node);
      }
    }

    // Resort the heap because it won't otherwise
    // This is painful
    searchQueue.consume().forEach((n) => searchQueue.push(n));
  }

  // No path was found
  return tracePath(endingNode);
}

const {
  nodes: partAGrid,
  startingNode: partAStartingNode,
  endingNode: partAEndingNode,
} = getNodes();

const shortestPathA = dijkstraPathfind(
  partAGrid,
  [partAGrid[partAStartingNode.x][partAStartingNode.y]],
  partAGrid[partAEndingNode.x][partAEndingNode.y]
);

console.log('Part A');
console.log(shortestPathA.length);

/*
Part B
  Now we can start from any point of height 0

  Slightly changed the pathfinding to have multple starting
points.
*/

const { nodes: gridB, endingNode: partBEndingNode } = getNodes();

const partBStartNodes = gridB.flat().filter((n) => n.height === 0);

const shortestPathB = dijkstraPathfind(
  gridB,
  partBStartNodes,
  gridB[partBEndingNode.x][partBEndingNode.y]
);

console.log('Part B');
console.log(shortestPathB.length);
