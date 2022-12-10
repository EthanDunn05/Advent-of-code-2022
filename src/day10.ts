import { readFileSync } from 'fs';

/*
MY THOUGHS:
  Really fun! Love the concept of reading basic assembly input
then using that from part A to sync the output to a screen.
It really shows how tricky it was to synchronize displaying things when
games were made in assembly and on CRTs. Part B seemed intimidating
at first, but with a small edit to the clock, it wasn't hard.
  I decided to try something new to reuse the command processing by
taking advantage of functional programming. The clockEffect was
the only thing that needed to be messed with since the core of
reading the input was the same across both parts.
*/

const commands = readFileSync('./inputs/day10.txt', 'utf-8')
  .split('\n')
  .filter((s) => s !== '');

/**
 * Processes the input commands
 * @param clockEffect
 * A function that is called every clock cycle.
 * The xRegister and cycle number are passed in so that stuff can be
 * done with the memory.
 */
function runProgram(clockEffect: (xRegister: number, cycle: number) => void) {
  let xRegister = 1;
  let cycle = 0;

  // Called every cycle
  const clock = function () {
    cycle++;
    clockEffect(xRegister, cycle);
  };

  // Go through the lines of the input
  for (let i = 0; i < commands.length; i++) {
    const line = commands[i];
    const parts = line.split(' ');

    // Take 1 cycle for the first part of the command
    const command = parts[0];
    clock();

    if (command === 'noop') continue;

    // Only other option is addx
    // Take another cycle to add to the X Register
    const arg = parseInt(parts[1]);
    clock();
    xRegister += arg;
  }
}

/*
Part A
  Find the product of the cycle and xRegister on the
20th and every 40 cycles after that. Add all those products up.
*/

let signalStrengthSumA = 0;

//   Work on computing the answer to part A
// on the 20th and every 40 cycles after that
runProgram(function (xRegister, cycle) {
  if ((cycle + 20) % 40 === 0) {
    signalStrengthSumA += cycle * xRegister;
  }
});

console.log('Part A');
console.log(signalStrengthSumA);

/*
Part B
  The xRegister is actually the position of a 3 wide sprite.
Each cycle, a pixel is read from sprite and to the screen.
The screen is 40px wide, so every 40 cycles is a new line.
*/

let screen = '';

runProgram(function (spritePos, cycle) {
  // The pixel to look at
  const pixel = (cycle % 40) - 1;

  // For readability on output
  screen += ' ';

  // If the distance between the pixel and the sprite
  // is 1 or less. Effectively makes the sprite 3 wide.
  if (Math.abs(spritePos - pixel) <= 1) {
    // Sprite is visible
    screen += '#';
  } else {
    // Sprite is not visible
    screen += ' ';
  }

  // Move to the next line on cycle 40
  if (cycle % 40 === 0) {
    screen += '\n';
  }
});

console.log('Part B');
console.log(screen);
