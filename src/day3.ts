import * as fs from 'fs';

const backpackData = fs.readFileSync('./inputs/day3.txt', 'utf8');
const backpacks = backpackData.split('\n').filter((s) => s !== '');

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

// Make a priority map
const priorityMap = new Map<string, number>();
for (let i = 0; i < alphabet.length; i++) {
  const lowerLetter = alphabet[i];
  const upperLetter = lowerLetter.toUpperCase();

  // a-z is 1-26
  // A-Z is 27-52
  const lowerPriority = i + 1;
  const upperPriority = lowerPriority + 26;

  priorityMap.set(lowerLetter, lowerPriority);
  priorityMap.set(upperLetter, upperPriority);
}

/**
 * Finds the intersection between two strings with no duplicates
 */
function findIntersection(items1: string, items2: string): string {
  const intersectionRegex = new RegExp(`[${items2}]`, 'g');

  const intersection = items1
    .match(intersectionRegex)
    .reduce((builtString, matchedLetter) => {
      // Remove duplicates
      if (!builtString.includes(matchedLetter))
        return builtString + matchedLetter;
      return builtString;
    });

  return intersection;
}

/* 
  Part A

Find the sum of the priorities of the items
  that are in both pouches of each backpack.
*/

let sumA = 0;
for (const backpack of backpacks) {
  const pouch1 = backpack.slice(0, backpack.length / 2);
  const pouch2 = backpack.slice(backpack.length / 2);

  const intersection = findIntersection(pouch1, pouch2);

  for (const letter of intersection) {
    sumA += priorityMap.get(letter);
  }
}

console.log('Part A:');
console.log(sumA);

/* 
  Part B 
  
Find the item that is in all backpacks per group of 3.
  sum the prioities of those.
*/

let sumB = 0;
for (let i = 0; i < backpacks.length; i += 3) {
  const [backpack1, backpack2, backpack3] = backpacks.slice(i, i + 3);

  // Find intersection of all 3
  const sharedItem = findIntersection(
    findIntersection(backpack1, backpack2),
    backpack3
  );

  if (sharedItem.length !== 1) throw Error('Intersection did done messed up');

  sumB += priorityMap.get(sharedItem);
}

console.log('Part B:');
console.log(sumB);
