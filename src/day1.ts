import * as fs from 'fs';
import { EOL } from 'os';

/*
MY THOUGHTS:
  It's fine. Nothing special, but it works for the
day 1 challenge. It's literally just adding numbers then
doing simple analysis :/
*/

const calorieDataRaw = fs.readFileSync('./inputs/day1.txt', 'utf8');

const calorieDataLines = calorieDataRaw.split(EOL);

const elfCalories = [0];
let currentElf = 0;
for (const line of calorieDataLines) {
  // Move to next elf when done with current elf
  if (line === '') {
    currentElf++;
    elfCalories[currentElf] = 0;
    continue;
  }

  const cal = parseInt(line);
  elfCalories[currentElf] += cal;
}

const topCal = Math.max(...elfCalories);
console.log(`Part 1: ${topCal}`);

elfCalories.sort((a, b) => b - a);
const topThree = elfCalories.slice(0, 3);
const sumTopThree = topThree.reduce((p, c) => p + c);
console.log(`Part 2: ${sumTopThree}`);
