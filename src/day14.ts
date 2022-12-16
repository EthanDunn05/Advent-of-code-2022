import { readFileSync } from 'fs';
import { AbstractVector, Vector } from 'vector2d';

/*
MY THOUGHTS:
  Well, exams are getting me behind. I hoped that wouldn't
happen, but oh well. Pretty fun challenge. Not much to say at this point
since I have exams, but I'll see what else I can get done today and
over the weekend. 
*/

const input = readFileSync('./inputs/day14.txt', 'utf-8')
    .split('\n')
    .filter((s) => s !== '');

enum GridObjects {
  ROCK,
  SAND,
  SAND_GEN,
  AIR = undefined,
}

const SAND_GEN_POS = new Vector(500, 0);

function createMap(): GridObjects[][] {
  // Anything undefined is air
  // Defined [x][y]
  const map: GridObjects[][] = [];
  map[SAND_GEN_POS.x] = [GridObjects.SAND_GEN];

  /**
   * Read the input and create a map based on the input
   */
  for (const line of input) {
    const rockPoints = line.split(' -> ').map((pointStr) => {
      const [x, y] = pointStr.split(',').map((s) => parseInt(s));

      return new Vector(x, y);
    });

    for (let i = 1; i < rockPoints.length; i++) {
      const point1 = rockPoints[i - 1];
      const point2 = rockPoints[i];

      // Vertical
      if (point1.x === point2.x) {
        const x = point1.x;
        const from = Math.min(point1.y, point2.y);
        const to = Math.max(point1.y, point2.y);

        for (let y = from; y <= to; y++) {
          if (!map[x]) map[x] = [];
          map[x][y] = GridObjects.ROCK;
        }
      }

      // Horizontal
      if (point1.y === point2.y) {
        const y = point1.y;
        const from = Math.min(point1.x, point2.x);
        const to = Math.max(point1.x, point2.x);

        for (let x = from; x <= to; x++) {
          if (!map[x]) map[x] = [];
          map[x][y] = GridObjects.ROCK;
        }
      }
    }
  }

  return map;
}

function isAboveVoid(map: GridObjects[][], position: AbstractVector): boolean {
  // Cecks if there is nothing below the pos
  const stuffBellow = map[position.x].slice(position.y - 1);
  return stuffBellow.length === 0;
}

// Drop the sand
// Returns if the sand ended up over the abyss
function generateSand(map: GridObjects[][]): boolean {
  const position = SAND_GEN_POS.clone();

  // Returns the dx
  function getMove(): number | undefined {
    if (map[position.x][position.y + 1] === GridObjects.AIR) {
      return 0;
    }

    if (!map[position.x - 1]) map[position.x - 1] = [];
    if (map[position.x - 1][position.y + 1] === GridObjects.AIR) {
      return -1;
    }

    if (!map[position.x + 1]) map[position.x + 1] = [];
    if (map[position.x + 1][position.y + 1] === GridObjects.AIR) {
      return 1;
    }

    return undefined;
  }

  while (getMove() !== undefined) {
    const dx = getMove();

    position.x += dx;
    position.y++;

    if (isAboveVoid(map, position)) return false;
  }

  if (position.equals(SAND_GEN_POS)) return false;

  map[position.x][position.y] = GridObjects.SAND;
  return true;
}

/*
Part A
  Generate sand untill it falls into the abyss.
Count how many that took.
*/
let countA = 0;

const mapA = createMap();

while (generateSand(mapA)) {
  countA++;
}

console.log('Part A');
console.log(countA);

/*
Part B
  Turns out there's not an infinite abyss below the
cave rocks... Sad. Also unfortunately it's the floor
I'm stanging on. How much sand does it take to block
the generatior.
*/

const mapB = createMap();

// Floor is two places below the lowest point
const floorPos =
  Math.max(...mapB.map((col) => col.length).filter((n) => !isNaN(n))) + 1;
const floorWidth = floorPos * 2;

// Triangles :)
//   The bottom of the triangle can only be twice the height
// since this is an equilateral triangle (kinda).
const leftPos = SAND_GEN_POS.x - floorWidth / 2 - 1;
const rightPos = SAND_GEN_POS.x + floorWidth / 2 + 1;
for (let i = leftPos; i < rightPos; i++) {
  if (!mapB[i]) mapB[i] = [];
  mapB[i][floorPos] = GridObjects.ROCK;
}

// Off by one because it doesn't count the last sand
let countB = 1;

while (generateSand(mapB)) {
  countB++;
}

console.log('Part B');
console.log(countB);
