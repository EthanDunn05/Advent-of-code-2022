import * as fs from 'fs'
import { EOL } from 'os';

const calorieDataRaw = fs.readFileSync('./inputs/day1.txt', 'utf8');

const calorieDataLines = calorieDataRaw.split(EOL)

let elfCalories = [0];
let currentElf = 0;
for(let line of calorieDataLines) {
    // Move to next elf when done with current elf
    if(line === '') {
        currentElf++;
        elfCalories[currentElf] = 0;
        continue;
    }

    let cal = parseInt(line);
    elfCalories[currentElf] += cal;
}

let topCal = Math.max(...elfCalories);
console.log(`Part 1: ${topCal}`);

elfCalories.sort((a, b) => b - a);
let topThree = elfCalories.slice(0, 3)
let sumTopThree = topThree.reduce((p, c, i) => p + c);
console.log(`Part 2: ${sumTopThree}`);

debugger