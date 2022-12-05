import * as fs from 'fs';

/*
MY THOUGHTS:
  This challenge was kinda boring. There wasn't much
to set this one apart from other generic coding challenges.
The solution I came up with is boring as well as it is just a bunch
of comparisons.
*/

const elfAssignmentsRaw = fs.readFileSync('./inputs/day4.txt', 'utf8');

/*
  Part A

Find how many pairs of ranges have one set containing another
*/

let interContainedPairs = 0;

// Each pair is a set of 2 ranges, a-b,c-d
const elfPairs = elfAssignmentsRaw.split('\n').filter((s) => s !== '');
for (const elfPair of elfPairs) {
  // Each rangeStr is a-b
  // Always: a <= b
  const [range1Str, range2Str] = elfPair.split(',');

  // Make objects from the ranges
  type Range = { lower: number; upper: number };
  const range1: Range = {
    lower: parseInt(range1Str.split('-')[0]),
    upper: parseInt(range1Str.split('-')[1]),
  };
  const range2: Range = {
    lower: parseInt(range2Str.split('-')[0]),
    upper: parseInt(range2Str.split('-')[1]),
  };

  // Test for range1 inside range2
  if (range1.lower >= range2.lower && range1.upper <= range2.upper)
    interContainedPairs++;
  // Test for range2 inside range1
  else if (range2.lower >= range1.lower && range2.upper <= range1.upper)
    interContainedPairs++;
}

console.log('Part A');
console.log(interContainedPairs);

/*
  Part B

Find number of pairs that overlap at all
*/

// Mostly the same as above, but with some additions to find any overlap
let overlappingPairs = 0;
for (const elfPair of elfPairs) {
  // Each rangeStr is a-b
  // Always: a <= b
  const [range1Str, range2Str] = elfPair.split(',');

  // Make objects from the ranges
  type Range = { lower: number; upper: number };
  const range1: Range = {
    lower: parseInt(range1Str.split('-')[0]),
    upper: parseInt(range1Str.split('-')[1]),
  };
  const range2: Range = {
    lower: parseInt(range2Str.split('-')[0]),
    upper: parseInt(range2Str.split('-')[1]),
  };

  // Test for range1 inside range2
  if (range1.lower >= range2.lower && range1.upper <= range2.upper)
    overlappingPairs++;
  // Test for range2 inside range1
  else if (range2.lower >= range1.lower && range2.upper <= range1.upper)
    overlappingPairs++;
  // Test for range 1 less than 2
  // 1 2 3 4 5 . .
  // . . 3 4 5 6 7
  else if (
    range1.lower <= range2.lower &&
    range1.upper >= range2.lower &&
    range1.upper <= range2.upper
  )
    overlappingPairs++;
  // Test for range 2 less than 1
  // . . . . 5 6 7 8
  // 1 2 3 4 5 6 . .
  else if (
    range2.lower <= range1.lower &&
    range2.upper >= range1.lower &&
    range2.upper <= range1.upper
  )
    overlappingPairs++;
}

console.log('Part B');
console.log(overlappingPairs);
