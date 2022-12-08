import { readFileSync } from 'fs';

/*
MY THOGHTS:
  This took far longer than it should have. I'm pretty bad
at working with 2d arrays so this code is a bit messy. The strucure
is bad, the getVisibility and getScenicScore functions are poorly written
with repetitive for loops. It works and that's what matters right?
  The challenge was fun though. I'm keeping this short 
because I'm tired and am just ready to be done with this challenge.
*/

const treeMapRaw = readFileSync('./inputs/day8.txt', 'utf-8');

// Map the input to a 2d array
const treeMap = treeMapRaw
  .split('\n')
  .filter((s) => s !== '')
  .map((line) => {
    return line.split('');
  })
  .map((row) => {
    // Map to numbers
    return row.map((col) => {
      return parseInt(col);
    });
  });

const mapWidth = treeMap[0].length;
const mapHeight = treeMap.length;

/*
Part A
  Find the number of visible trees
*/

/**
 * Gets the visibility of a tree at a certain location
 */
function getVisibility(row: number, col: number): boolean {
  const tree = treeMap[row][col];

  // Auto-fail edges
  if (row === 0 || row === mapHeight - 1) return true;
  if (col === 0 || col === mapWidth - 1) return true;

  //   Surely there's a way to abstract the ray
  // casting, but this works just fine

  // Check left
  let hiddenLeft = false;
  for (let searchCol = col - 1; searchCol >= 0; searchCol--) {
    if (treeMap[row][searchCol] >= tree) {
      hiddenLeft = true;
      break;
    }
  }
  if (!hiddenLeft) return true;

  // Check right
  let hiddenRight = false;
  for (let searchCol = col + 1; searchCol < mapWidth; searchCol++) {
    if (treeMap[row][searchCol] >= tree) {
      hiddenRight = true;
      break;
    }
  }
  if (!hiddenRight) return true;

  // Check up
  let hiddenUp = false;
  for (let searchRow = row - 1; searchRow >= 0; searchRow--) {
    if (treeMap[searchRow][col] >= tree) {
      hiddenUp = true;
      break;
    }
  }
  if (!hiddenUp) return true;

  // Check down
  let hiddenDown = false;
  for (let searchRow = row + 1; searchRow < mapHeight; searchRow++) {
    if (treeMap[searchRow][col] >= tree) {
      hiddenDown = true;
      break;
    }
  }
  if (!hiddenDown) return true;

  return false;
}

const visibilityMap: boolean[][] = [];

// Check every tree's visibility
for (let row = 0; row < mapHeight; row++) {
  for (let col = 0; col < mapHeight; col++) {
    if (!visibilityMap[row]) visibilityMap[row] = [];
    visibilityMap[row][col] = getVisibility(row, col);
  }
}

const visibleTrees = visibilityMap.flat().filter((v) => v).length;

console.log('Part A');
console.log(visibleTrees);

/*
Part B
  Find the tree that has the highest scenic score.
The scenic score is the product of the distances the
tree can see. Mostly the same as Part A, but at this point,
this has taken too long that I just want a solution. Maybe someday I'll
make this code not suck.
*/

function getScenicScore(row: number, col: number): number {
  const tree = treeMap[row][col];

  // Check left
  // Initializes the scenicScore to as if the view was not blocked
  let scenicScoreLeft = col;
  for (let searchCol = col - 1; searchCol >= 0; searchCol--) {
    if (treeMap[row][searchCol] >= tree) {
      scenicScoreLeft = col - searchCol;
      break;
    }
  }

  // Check right
  let scenicScoreRight = mapWidth - col - 1;
  for (let searchCol = col + 1; searchCol < mapWidth; searchCol++) {
    if (treeMap[row][searchCol] >= tree) {
      scenicScoreRight = searchCol - col;
      break;
    }
  }

  // Check up
  let scenicScoreUp = row;
  for (let searchRow = row - 1; searchRow >= 0; searchRow--) {
    if (treeMap[searchRow][col] >= tree) {
      scenicScoreUp = row - searchRow;
      break;
    }
  }

  // Check down
  let scenicScoreDown = mapHeight - row - 1;
  for (let searchRow = row + 1; searchRow < mapHeight; searchRow++) {
    if (treeMap[searchRow][col] >= tree) {
      scenicScoreDown = searchRow - row ;
      break;
    }
  }

  const scenicScore =
    scenicScoreLeft * scenicScoreDown * scenicScoreRight * scenicScoreUp;
  return scenicScore;
}

const scenicScoreMap: number[][] = [];

// Check every tree's visibility
for (let row = 0; row < mapHeight; row++) {
  for (let col = 0; col < mapHeight; col++) {
    if (!scenicScoreMap[row]) scenicScoreMap[row] = [];
    scenicScoreMap[row][col] = getScenicScore(row, col);
  }
}

const maxScenicScore = Math.max(...scenicScoreMap.flat());

console.log('Part B');
console.log(maxScenicScore);
