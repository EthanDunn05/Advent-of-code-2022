import { readFileSync } from 'fs';

/*
MY THOUGHTS:
  Really fun challenge. The input data was simple to
parse since all it is is arrays of numbers and arrays.
I honestly kind of missed the pure numeric inputs after the
last few days of abstracted representations of things.
  The comparePackets() function is the core of this challenge, and
oh boy was it fun to write. I had some troubles with the wording
of the challenge, but eventually I got it working geat without issue.
Part B was a breeze since I had access to .sort(), but if I did not have
that it would've been harder with implementing some sorting method.

  Overall a very fun challenge. Not super crazy concept, but
not all the challenges need to be complex representations. Sometimes
you just want to compare some data.
*/

/*
An array that contains each packet pair
*/
const packetPairs = readFileSync('./inputs/day13.txt', 'utf-8')
    .split('\n\n')
    .filter((s) => s !== '')
    .map((pairString) => {
      return pairString.split('\n').filter((s) => s !== '');
    });

/**
 * Compares two packets and returns if they are in order
 * If the packets are the same, returns undefined
 */
function comparePackets(
  leftValues: unknown[],
  rightValues: unknown[]
): boolean | undefined {

  //   Min because when we run out of one of the arrays, we decide if it's
  // in order based on which one was bigger
  for (let i = 0; i < Math.min(leftValues.length, rightValues.length); i++) {
    let left = leftValues[i];
    let right = rightValues[i];

    // Both are numbers
    if (Number.isInteger(left) && Number.isInteger(right)) {
      if (left < right) {
        return true;
      }
      if (left > right) {
        return false;
      }

      // Coninue if same
      continue;
    }

    // Since one isn't a number, convert the one that is to an array
    if (Number.isInteger(left)) left = [left];
    if (Number.isInteger(right)) right = [right];

    // Both are Arrays
    if (Array.isArray(left) && Array.isArray(right)) {
      const isInOrder = comparePackets(left, right);

      // If a conclusion has been made, carry up the conclusion
      if (isInOrder !== undefined) return isInOrder;

      // Otherwise, keep searching
      continue;
    }
  }

  // If right ran out first, not in order
  if (leftValues.length > rightValues.length) {
    return false;
  }

  // If left ran out first, in order
  if (rightValues.length > leftValues.length) {
    return true;
  }

  // Otherwise no conclusion can be made yet
  return undefined;
}

/*
Part A
  Find all of the packet pairs that are in the
correct order and get the sum of their indexes
*/

// Read and compare the packets
let sumA = 0;
for (const [i, packetPair] of packetPairs.entries()) {
  // Unknown array because we don't know how many levels of arrays there are,
  // but there's at least one.
  const [leftValues, rightValues] = packetPair.map(
    (p) => JSON.parse(p) as unknown[]
  );

  const inOrder = comparePackets(leftValues, rightValues);
  if (inOrder) sumA += i + 1; // Indexing from 1 >:(
}

console.log('Part A');
console.log(sumA);

/*
Part B
  Now we need to sort the packets...

  There are two divider packets, locate them and
multiply their indexes (Starting at 1) to get the answer.
*/

// Looks wierd, but it's right
// The dividers are: [[2]] and [[6]]
const dividerPacket1 = [[2]];
const dividerPacket2 = [[6]];

const allPackets = packetPairs
  .flat()
  .map((packet) => JSON.parse(packet) as unknown[]);

// Add the divider packets
allPackets.push(dividerPacket1);
allPackets.push(dividerPacket2);

// Cheatng and using the built in sort lmao
allPackets.sort((a, b) => {
  const inOrder = comparePackets(a, b);

  // Sorts to where everything is in order
  if (inOrder) return -1;
  else return 1;
});

// Find the new location of the divider packets
const dividerPacket1Index = allPackets.indexOf(dividerPacket1) + 1;
const dividerPacket2Index = allPackets.indexOf(dividerPacket2) + 1;

console.log('Part B');
console.log(dividerPacket1Index * dividerPacket2Index);
