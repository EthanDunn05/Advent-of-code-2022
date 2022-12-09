import { readFileSync } from 'fs';
import { Vector } from 'vector2d';

/*
MY THOUGHS:
  This was a pretty fun challenge. The change from par A to
part B was smooth, and the mechanics behand the rope movement make sense.
Nothing really caused my any big issues, most of the ones that came up were
relatively easy to fix. I decided to use a vector npm package to save myself
some time in making one myself. I really want to avoid using npm packages, but
for something like a Vector that just acts as a wrapper to two numbers, I'm okay with it.
  This challenge overall was quite fun, and I found myself really enjoying the process
as opposed to yesterday's challenge being a slog to ge through.

  Also, I should note that I want to avoid too much OOP abstraction because
I think that hiding the process behid abstraction takes away from
the end code for AoC. I could have abstracted the rope to a class, but
I would rather the underlying data structure be more clear.
*/

const ropeMovements = readFileSync('./inputs/day9.txt', 'utf-8')
  .split('\n')
  .filter((s) => s !== '');

// Directions
const UP = 'U';
const DOWN = 'D';
const LEFT = 'L';
const RIGHT = 'R';
const directionMap = new Map<string, Vector>([
  [UP, new Vector(0, 1)],
  [DOWN, new Vector(0, -1)],
  [LEFT, new Vector(-1, 0)],
  [RIGHT, new Vector(1, 0)],
]);

/*
  The tail of the rope follows the head, lagging behind and following this:
Rope is 2 steps away on a cardinal direction: Move that direction.
Rope is not toucing in any other way: Move diagnally.

  Those instructions end up being the same as moving 1 step
towards the head in each direction that needs to.
*/

/**
 * Follows the leadSegment based on the movement defined in
 * the challenge
 */
function followSegment(leadSegment: Vector, followSegment: Vector) {
  // Find where the tail is with respect to the head.
  const posDifference = leadSegment.clone().subtract(followSegment);

  // If we aren't far enough, just move on
  if (Math.abs(posDifference.x) <= 1 && Math.abs(posDifference.y) <= 1) {
    return;
  }

  // Move ithe tail of the rope
  followSegment.x += Math.sign(posDifference.x);
  followSegment.y += Math.sign(posDifference.y);
}

/*
Part A:
  Get the number of unique positions the rope tail
was at during the movement.
*/

// Rope parts
const ropeHeadA = new Vector(0, 0);
const ropeTailA = new Vector(0, 0);

const tailPathA: string[] = [];

/*
  Follow the movement instructions.
*/
for (const instruction of ropeMovements) {
  const [directionStr, stepsStr] = instruction.split(' ');
  const steps = parseInt(stepsStr);
  const direction = directionMap.get(directionStr);

  for (let step = 0; step < steps; step++) {
    // Move the head
    ropeHeadA.add(direction);

    // Have the tail follow the head
    followSegment(ropeHeadA, ropeTailA);

    // Add the tail pos to the visited locations
    const stringPos = ropeTailA.toString();
    if (!tailPathA.includes(stringPos)) tailPathA.push(stringPos);
  }
}

console.log('Part A');
console.log(tailPathA.length);

/*
Part B:
  Do the same, but with 10 segments now rather than 2
*/

// Manually doing this is easier
const ropeSegmentsB = [
  new Vector(0, 0),
  new Vector(0, 0),
  new Vector(0, 0),
  new Vector(0, 0),
  new Vector(0, 0),
  new Vector(0, 0),
  new Vector(0, 0),
  new Vector(0, 0),
  new Vector(0, 0),
  new Vector(0, 0),
];

const ropePathB: string[] = [];

for (const instruction of ropeMovements) {
  const [directionStr, stepsStr] = instruction.split(' ');
  const steps = parseInt(stepsStr);
  const direction = directionMap.get(directionStr);

  for (let step = 0; step < steps; step++) {
    // Update the head ropeSegment
    ropeSegmentsB[0].add(direction);

    // Follow the leader
    for (let i = 1; i < ropeSegmentsB.length; i++) {
      const leader = ropeSegmentsB[i - 1];
      const follower = ropeSegmentsB[i];

      followSegment(leader, follower);
    }

    // Add the tail pos to the visited locations
    const stringPos = ropeSegmentsB[9].toString();
    if (!ropePathB.includes(stringPos)) ropePathB.push(stringPos);
  }
}

console.log('Part B');
console.log(ropePathB.length);
