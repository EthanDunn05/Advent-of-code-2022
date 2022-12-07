import * as fs from 'fs';

/*
MY THOUGHTS:
  Decently fun challenge. Part B was pretty similar to part A, so much so
that I just made a small tweak to the findMarker() function then called
it again. Finding the first instance of a substring without any duplcate characters
is a really basic so I'm suprised that it appeared here after yesterday's challenge.
  Overall, it's ok but doesn't have much to make it stand out.
*/

const datastream = fs.readFileSync('./inputs/day6.txt', 'utf-8');

/*
  Part A

Find the first instance of four letter that don't repeat.
The answer is the index of the group.
*/

/**
 * Finds the index where the marker ends
 */
function findMarker(datastream: string, lengthOfMarker: number): number | undefined {
  // Start at 4 because we look back at the previous 4 letters
  for (let i = lengthOfMarker; i < datastream.length; i++) {
    const potentialMarker = datastream.slice(i - lengthOfMarker, i);
    
    const duplicatesRemoved = potentialMarker
      .split('')
      .filter((char, index, letters) => {
        return letters.indexOf(char) === index;
      });

    // Test if the slice with duplicates remvoed is the same length as before
    if (potentialMarker.length === duplicatesRemoved.length) {
      return i;
    }
  }
  return undefined;
}

console.log('Part A');
console.log(findMarker(datastream, 4));

/*
  Part B

The same thing, but look for a 14
character long string of unique characters.
*/

console.log('Part B');
console.log(findMarker(datastream, 14));