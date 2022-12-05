import * as fs from 'fs';

/*
MY THOUGHTS:
  Pretty fun challenge overall. The hardest part was
easilly reading the data. If I didn't mess with the input
before reading it, I would be doing a lot of uneeded steps
to sort through the junk. Had some issue with part B, but that
was because I was trying to clone the crate starting position, but
the references were just not having it because there's no easy way to
clone an object. I just went with recomputing the starting position
both times.
  Overall, pretty fun. Still doesn't beat day 2, but it's
pretty close with how much thought I had to put into reading the input.
*/

// Modified input data, original is day5_og.txt
const craneData = fs.readFileSync('./inputs/day5.txt', 'utf8');

// Oh boy this seems tricky...
const lines = craneData.split('\n');

// Split the data into two sets of lines
// Crate lines are reversed beacuse reading top to bottom is easier
const divider = lines.findIndex((s) => s === '');
const crateLines = lines.slice(0, divider).reverse();
const directionLines = lines.slice(divider).filter((s) => s !== '');

// crates is an array of each stack
// Push each crate in each row, from bottom to top
function readCrates(): string[][] {
  const crates: string[][] = [];
  for (const line of crateLines) {
    const crateLevel = line.split('');

    // Push each create to the array
    for (let i = 0; i < crateLevel.length; i++) {
      const crate = crateLevel[i];

      if (!crates[i]) crates[i] = [];
      if (crate !== ' ') {
        crates[i].push(crate);
      }
    }
  }
  return crates;
}

/*
  Part A

Follow the instruction to move crates around and
  get the top crate of each stack
*/

const cratesA = readCrates();

// Follow directions
// The crate stacks are indexed from 1 in the instructions
//   so conversion to a 0 indexed array is needed.
for (const directionString of directionLines) {
  const [amount, from, to] = directionString.split(' ').map((s) => parseInt(s));

  // Move each crate
  for (let i = 0; i < amount; i++) {
    const craneHold = cratesA[from - 1].pop();
    cratesA[to - 1].push(craneHold);
  }
}

// Take the top crate in each stack
const topCratesA: string[] = [];
for (const stack of cratesA) {
  const topCrate = stack.slice(-1)[0];
  topCratesA.push(topCrate);
}

console.log('Part A');
console.log(topCratesA);

/*
  Part B

The crane can actually move multiple crates at once
  so move crates in groups rather than individually
*/

const cratesB = readCrates();

// Follow directions
for (const directionString of directionLines) {
  const [amount, from, to] = directionString.split(' ').map((s) => parseInt(s));

  // Take crates out of the stack
  const craneHold: string[] = [];
  for (let i = 0; i < amount; i++) {
    const cratePull = cratesB[from - 1].pop();
    craneHold.push(cratePull);
  }

  // Push the crates to the new spot
  for(let i = 0; i < amount; i++) {
    const cratePull = craneHold.pop();
    cratesB[to - 1].push(cratePull);
  }
}

// Take the top crate in each stack
const topCratesB: string[] = [];
for (const stack of cratesB) {
  const topCrate = stack.slice(-1)[0];
  topCratesB.push(topCrate);
}

console.log('Part B');
console.log(topCratesB);