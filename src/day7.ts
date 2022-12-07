import * as fs from 'fs';

/*
MY THOUGHTS:
  Now we're getting somewhere! This challenge was super fun.
Reading console output to model the filesystem was really interesting
and pretty fun to do. Once that was modeled, finding the outputs was still
tricky because I'm not very used to navigating a tree.
  This was a cool idea for a challenge, and it makes me look forward
to the challenges in the future!
*/

// This is quite interesting...
const sysInRaw = fs.readFileSync('./inputs/day7.txt', 'utf-8');
const sysIn = sysInRaw.split('\n').filter((s) => s !== '');

/* Structure of the filesystem model */

type Directory = {
  name: string;
  parent: Directory;
  childDirs: Directory[];
  childFiles: File[];
};
type File = {
  name: string;
  size: number;
};

// Keep as a seperate var for when we nav to root
const rootDir: Directory = {
  name: '/',
  parent: undefined,
  childDirs: [],
  childFiles: [],
};

let currentDir = rootDir;

/* Read the input to create the filesystem */

// Process the terminal input
for (const line of sysIn) {
  const args = line.split(' ');

  // Process cd
  if (args[0] === '$' && args[1] === 'cd') {
    const cdTarget = args[2];

    // cd .. leads to parent
    if (cdTarget === '..') {
      currentDir = currentDir.parent;
    }
    // cd / leads to root
    else if (cdTarget === '/') {
      currentDir = rootDir;
    }
    // Any other cd goes to the childDir of that name
    else {
      currentDir = currentDir.childDirs.find(
        (child) => child.name === cdTarget
      );
    }
  }

  // Ignore ls lmao
  else if (args[0] === '$' && args[1] == 'ls') {
    // Do nothing
  }

  // Process dir
  else if (args[0] === 'dir') {
    const dirName = args[1];

    currentDir.childDirs.push({
      name: dirName,
      parent: currentDir,
      childDirs: [],
      childFiles: [],
    });
  }

  // Process file
  else {
    const fileSize = parseInt(args[0]);
    const fileName = args[1];

    currentDir.childFiles.push({
      name: fileName,
      size: fileSize,
    });
  }
}

/*
Part A:
  Find all directories that have files that sum to
a size of at least 100,000. Then find the sum of all of
those directories.
*/

// Traverses the directory bottom up
function traverseFilesystem(dir: Directory, effect: (dir: Directory) => void) {
  for (const child of dir.childDirs) {
    traverseFilesystem(child, effect);
  }

  effect(dir);
}

// Get the total size of every directory and save it to a map
const dirSizes = new Map<Directory, number>();
traverseFilesystem(rootDir, (dir) => {
  // Sum all the files
  const directSize = dir.childFiles.reduce((prev, current) => {
    return prev + current.size;
  }, 0);

  // Sum the sizes of the children
  const indirectSize = dir.childDirs.reduce((prev, current) => {
    return prev + dirSizes.get(current);
  }, 0);

  dirSizes.set(dir, directSize + indirectSize);
});

const MAX_DIR_SIZE = 100000;

// Get the final answer
let sumA = 0;
for (const dirSize of dirSizes.values()) {
  if (dirSize <= MAX_DIR_SIZE) sumA += dirSize;
}

console.log('Part A');
console.log(sumA);

/*
Part B:
  Find the smallest dir that is bigger than 30,000,000.
The answer is the size of that directory.
*/

const UPDATE_SIZE = 30000000;
const unusedSpace = 70000000 - dirSizes.get(rootDir);
const neededSize = UPDATE_SIZE - unusedSpace;

// Sort the sizes ascending
const sortedDirSizes = [...dirSizes.values()].sort((a, b) => a - b);

// Find the solution
for (const dirSize of sortedDirSizes) {
  if (dirSize <= neededSize) continue;

  console.log('Part B');
  console.log(dirSize);
  break;
}
