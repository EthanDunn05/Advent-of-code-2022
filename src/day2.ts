import * as fs from 'fs';

/*
This whole file feels really overcomplicated,
  but I like it and it works so who cares.
*/

enum Play {
  ROCK = 1,
  PAPER = 2,
  SCISSORS = 3,
}

const loseMap = new Map([
  [Play.ROCK, Play.PAPER],
  [Play.PAPER, Play.SCISSORS],
  [Play.SCISSORS, Play.ROCK],
]);

const winMap = new Map([
  [Play.ROCK, Play.SCISSORS],
  [Play.PAPER, Play.ROCK],
  [Play.SCISSORS, Play.PAPER],
]);

enum Result {
  TIE = 3,
  WIN = 6,
  LOSE = 0,
}

// Read data
const inputData = fs.readFileSync('./inputs/day2.txt', 'utf8');
const rounds = inputData.split('\n').filter((r) => r !== '');

/* Part A */

const playMapA = new Map([
  ['A', Play.ROCK],
  ['B', Play.PAPER],
  ['C', Play.SCISSORS],
  ['X', Play.ROCK],
  ['Y', Play.PAPER],
  ['Z', Play.SCISSORS],
]);

function getRoundResult(player: Play, opponent: Play): Result {
  if (player === opponent) return Result.TIE;

  if (loseMap.get(player) === opponent) return Result.LOSE;
  if (loseMap.get(opponent) === player) return Result.WIN;
}

// Calculate score
let sumA = 0;
for (const roundString of rounds) {
  const [opponentPlay, playerPlay] = roundString.split(' ').map((s) => playMapA.get(s));

  const result = getRoundResult(playerPlay, opponentPlay);
  sumA += Number(playerPlay) + Number(result);
}

console.log('Part A');
console.log(sumA);

/* Part B */

const playMapB = new Map([
  ['A', Play.ROCK],
  ['B', Play.PAPER],
  ['C', Play.SCISSORS],
]);

const resultMapB = new Map([
  ['X', Result.LOSE],
  ['Y', Result.TIE],
  ['Z', Result.WIN],
]);

// Returns the Play to achive the needed result
function getPlay(opponent: Play, result: Result): Play {
  switch (result) {
    case Result.WIN:
      return loseMap.get(opponent);
    case Result.TIE:
      return opponent;
    case Result.LOSE:
      return winMap.get(opponent);
  }
}

let sumB = 0;
for (const round of rounds) {
  const opponentPlay = playMapB.get(round.split(' ')[0]);
  const wantedResult = resultMapB.get(round.split(' ')[1]);

  const playerPlay = getPlay(opponentPlay, wantedResult);
  sumB += Number(playerPlay) + Number(wantedResult);
}

console.log('Part B');
console.log(sumB);
