import { readFileSync } from 'fs';

/*
MY THOUGHTS:
  Not a big fan of part 2. I get that the end result was simple to keep
the worry values managable, but I don't think i would have figured that out
in a reasonable time frame on my own. But besides that, a pretty fun challenge.
  My favorite part was writing the monkey class and input parser. It seems
like this year has a bit more language-based inputs which makes understanding it
at a first look easier, but makes parsing it harder.
  I actually had to run the program outside of the debugger in order to get the
final results because the debugger was too slow to get the end result of the challenge.
  
  I'm not goig to bother cleaning up this mess of a file so deal with it.
*/

/**
 * A class seems like the best way to hold the data
 */
class Monkey {
  items: number[];
  inspectOperation: (old: number) => number;
  throwTargetTest: (worryValue: number) => number;
  monkeys: Monkey[];
  divByCheck: number;

  timesInspected: number;

  constructor(
    startingItems: number[],
    inspectOperation: (old: number) => number,
    throwTargetTest: (worryValue: number) => number,
    monkeys: Monkey[],
    divByCheck: number
  ) {
    this.items = startingItems;
    this.inspectOperation = inspectOperation;
    this.throwTargetTest = throwTargetTest;
    this.monkeys = monkeys;
    this.divByCheck = divByCheck;

    this.timesInspected = 0;
  }

  inspectItem(item: number): number {
    // The monkey inspects the item
    item = this.inspectOperation(item);

    // Item is always an integer
    item = Math.trunc(item);

    this.timesInspected++;

    return item;
  }

  round() {
    while (this.items.length > 0) {
      // Pop an item from the front of the queue
      // Typescript doesn't have a built in queue so this'll do
      let item = this.items[0];
      this.items = this.items.slice(1);

      // Inspect the item
      item = this.inspectItem(item);

      // Thow the item to a new monkey
      const throwTarget = this.throwTargetTest(item);
      this.monkeys[throwTarget].items.push(item);
    }
  }
}

// I'll read the data because why not make things
// harder on myself.
const input = readFileSync('./inputs/day11.txt', 'utf-8');

// Split into the monkey sections
const monkeyDefinitions = input.split('\n\n');

/**
 * Read the monkey sections and create monkey objects from them.
 */
function createMonkeys(
  monkeyDefinitions: string[],
  // Omega cursed function that returns a function
  createInspectFunction: (monkeyOperation: string) => (old: number) => number
): Monkey[] {
  const monkeys: Monkey[] = [];

  for (const definition of monkeyDefinitions) {
    const [
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _header,
      startingItemsDef,
      operationDef,
      testDef,
      trueCaseDef,
      falseCaseDef,
    ] = definition.split('\n');

    // Read the items
    const itemsStr = startingItemsDef.split(': ')[1];
    const items = itemsStr.split(', ').map((s) => parseInt(s));

    // Read the operation

    const monkeyOperation = operationDef.split(': ')[1].replace('new = ', '');

    const operation = createInspectFunction(monkeyOperation);

    // Read the test condition
    const divisbleByNum = parseInt(testDef.split('divisible by ')[1]);
    const trueCaseMonkey = parseInt(trueCaseDef.split('monkey ')[1]);
    const falseCaseMonkey = parseInt(falseCaseDef.split('monkey ')[1]);

    const testOperation = (item: number): number => {
      if (item % divisbleByNum === 0) return trueCaseMonkey;
      else return falseCaseMonkey;
    };

    const newMonkey = new Monkey(
      items,
      operation,
      testOperation,
      monkeys,
      divisbleByNum
    );
    monkeys.push(newMonkey);
  }

  return monkeys;
}

/* 
Part A 
  Find the two monkeys who inspected items the most times
after 20 rounds. Then find the product of the number of times
those two inspected items.
*/

const partAMonkeys = createMonkeys(
  monkeyDefinitions,
  // Oh god, this is so cursed.
  // Also the param is used in the monkey operation, so:
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (monkeyOperation) => (old: number) => {
    let newVal = eval(monkeyOperation) as number;
    newVal /= 3;
    return newVal;
  }
);

// Play the monkey's rounds 20 times
for (let round = 0; round < 20; round++) {
  for (const monkey of partAMonkeys) {
    monkey.round();
  }
}

const inspectedTimes = partAMonkeys.map((m) => m.timesInspected);
inspectedTimes.sort((a, b) => b - a); // Why does my sort not sort by default

console.log('Part A');
console.log(inspectedTimes[0] * inspectedTimes[1]);

/*
Part B
  WHAT
  So... The worry value never goes down, but since we are doing 10k rounds
we need something to stop my computer from dying from the huge numbers...

  Going to be honest, I had to look up some hints to this one.
I had a vague idea, but I didn't have anything concrete
The key is to keep the worry value moded by the LCM of the
monkeys' divisble checks. And since all the checks are prime, we
just take the product.

  This part also is making the createMonkeys() function ultra scuffed
by having a function that returns the monkey's inspect operation function
as a parameter.
*/

// Get the LCM of the monkey divisble checks
const divisbleCheckLCM = partAMonkeys
  .map((m) => m.divByCheck)
  .reduce((prev, cur) => {
    // Primes, so the LCM is the product
    const lcm = prev * cur;
    return lcm;
  }, 1);

const partBMonkeys = createMonkeys(
  monkeyDefinitions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (monkeyOperation) => (old: number) => {
    let newVal = eval(monkeyOperation) as number;

    // Mod by the multiple to keep the value within
    // a reasonable size
    newVal = newVal % divisbleCheckLCM;
    return newVal;
  }
);

// Run the sim
for (let round = 0; round < 10000; round++) {
  for (const monkey of partBMonkeys) {
    monkey.round();
  }
}

const timesInspectedB = partBMonkeys.map((m) => m.timesInspected);
timesInspectedB.sort((a, b) => b - a);

console.log('Part B');
console.log(timesInspectedB[0] * timesInspectedB[1]);
