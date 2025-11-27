/**
 * LAMBDA - Functional Programming Approach (Arrow Functions)
 *
 * Lambda expressions (arrow functions in JS/TS) are anonymous functions
 * that can be created inline without the need for classes or interfaces.
 *
 * Benefits:
 * - Concise syntax
 * - Lexical `this` binding
 * - Can be passed as arguments easily
 * - First-class functions
 * - Closures capture surrounding scope
 *
 * Arrow function syntax:
 * - (params) => expression
 * - (params) => { statements }
 * - param => expression (single parameter)
 */

// Example 1: Basic Lambda Expressions
// ===================================

// Simple lambdas
const add = (a: number, b: number): number => a + b;
const multiply = (a: number, b: number): number => a * b;
const square = (x: number): number => x * x;
const double = (x: number): number => x * 2;
const isEven = (x: number): boolean => x % 2 === 0;
const isPositive = (x: number): boolean => x > 0;
const toString = <T>(x: T): string => String(x);
const identity = <T>(x: T): T => x;

// Lambdas with multiple statements
const factorial = (n: number): number => {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
};

// Higher-order functions returning lambdas
const greaterThan = (threshold: number) => (x: number): boolean => x > threshold;
const lessThan = (threshold: number) => (x: number): boolean => x < threshold;
const between = (min: number, max: number) => (x: number): boolean => x >= min && x <= max;
const addN = (n: number) => (x: number): number => x + n;
const multiplyBy = (n: number) => (x: number): number => x * n;

// Example 2: Collection Operations with Lambdas
// =============================================

// Inline lambdas with array methods
const processNumbers = (numbers: number[]): void => {
  // Filter with inline lambda
  const evens = numbers.filter((n) => n % 2 === 0);
  console.log(`Evens: [${evens}]`);

  // Map with inline lambda
  const doubled = numbers.map((n) => n * 2);
  console.log(`Doubled: [${doubled}]`);

  // Reduce with inline lambda
  const sum = numbers.reduce((acc, n) => acc + n, 0);
  console.log(`Sum: ${sum}`);

  // Sort with inline lambda
  const sorted = [...numbers].sort((a, b) => b - a);
  console.log(`Descending: [${sorted}]`);

  // Chaining with inline lambdas
  const result = numbers
    .filter((n) => n % 2 === 0)
    .map((n) => n * 2)
    .reduce((acc, n) => acc + n, 0);
  console.log(`Sum of doubled evens: ${result}`);
};

// Functional collection utilities using lambdas
const map = <T, R>(arr: T[], fn: (item: T) => R): R[] => arr.map(fn);
const filter = <T>(arr: T[], predicate: (item: T) => boolean): T[] => arr.filter(predicate);
const reduce = <T, R>(arr: T[], reducer: (acc: R, item: T) => R, initial: R): R =>
  arr.reduce(reducer, initial);
const find = <T>(arr: T[], predicate: (item: T) => boolean): T | undefined => arr.find(predicate);
const some = <T>(arr: T[], predicate: (item: T) => boolean): boolean => arr.some(predicate);
const every = <T>(arr: T[], predicate: (item: T) => boolean): boolean => arr.every(predicate);

// Example 3: Event Handling with Lambdas
// ======================================

type EventHandler<T> = (event: T) => void;

interface ClickEvent {
  x: number;
  y: number;
  button: string;
}

interface KeyEvent {
  key: string;
  ctrlKey: boolean;
  altKey: boolean;
}

// Event emitter using lambdas
const createEventEmitter = <T>() => {
  const handlers: Array<EventHandler<T>> = [];

  return {
    on: (handler: EventHandler<T>) => {
      handlers.push(handler);
      // Return unsubscribe function (also a lambda)
      return () => {
        const index = handlers.indexOf(handler);
        if (index !== -1) handlers.splice(index, 1);
      };
    },
    emit: (event: T) => handlers.forEach((handler) => handler(event)),
  };
};

// Example 4: Callbacks and Promises with Lambdas
// ==============================================

// Callback-style async (using lambdas)
const fetchDataCallback = (
  url: string,
  onSuccess: (data: string) => void,
  onError: (error: Error) => void
): void => {
  setTimeout(() => {
    if (Math.random() > 0.1) {
      onSuccess(`Data from ${url}`);
    } else {
      onError(new Error("Failed to fetch"));
    }
  }, 100);
};

// Promise-style async (using lambdas)
const fetchDataPromise = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) {
        resolve(`Data from ${url}`);
      } else {
        reject(new Error("Failed to fetch"));
      }
    }, 100);
  });

// Async/await with lambdas
const fetchMultiple = async (urls: string[]): Promise<string[]> => {
  const results = await Promise.all(urls.map((url) => fetchDataPromise(url)));
  return results;
};

// Example 5: Closures with Lambdas
// ================================

// Counter using closure
const createCounter = (initial: number = 0) => {
  let count = initial;
  return {
    increment: () => ++count,
    decrement: () => --count,
    get: () => count,
    reset: () => (count = initial),
  };
};

// Memoization using closure
const memoize = <T extends (...args: unknown[]) => unknown>(fn: T): T => {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      cache.set(key, fn(...args) as ReturnType<T>);
    }
    return cache.get(key)!;
  }) as T;
};

// Debounce using closure
const debounce = <T extends (...args: unknown[]) => void>(fn: T, delay: number): T => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return ((...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
};

// Throttle using closure
const throttle = <T extends (...args: unknown[]) => void>(fn: T, limit: number): T => {
  let lastCall = 0;

  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  }) as T;
};

// Example 6: Function Composition with Lambdas
// ============================================

// Compose: right to left
const compose =
  <T>(...fns: Array<(arg: T) => T>) =>
  (x: T): T =>
    fns.reduceRight((acc, fn) => fn(acc), x);

// Pipe: left to right
const pipe =
  <T>(...fns: Array<(arg: T) => T>) =>
  (x: T): T =>
    fns.reduce((acc, fn) => fn(acc), x);

// Example compositions
const addOne = (x: number) => x + 1;
const triple = (x: number) => x * 3;
const negate = (x: number) => -x;

const composed = compose(addOne, triple, double); // addOne(triple(double(x)))
const piped = pipe(double, triple, addOne); // addOne(triple(double(x)))

// Example 7: Validation with Lambdas
// ==================================

type Validator<T> = (value: T) => string | null;

// Validator factories (return lambdas)
const required: Validator<string> = (value) =>
  value.trim() === "" ? "Value is required" : null;

const minLength =
  (min: number): Validator<string> =>
  (value) =>
    value.length < min ? `Must be at least ${min} characters` : null;

const maxLength =
  (max: number): Validator<string> =>
  (value) =>
    value.length > max ? `Must be at most ${max} characters` : null;

const matches =
  (pattern: RegExp, message: string): Validator<string> =>
  (value) =>
    !pattern.test(value) ? message : null;

const minValue =
  (min: number): Validator<number> =>
  (value) =>
    value < min ? `Must be at least ${min}` : null;

const maxValue =
  (max: number): Validator<number> =>
  (value) =>
    value > max ? `Must be at most ${max}` : null;

// Combine validators
const combineValidators =
  <T>(...validators: Array<Validator<T>>) =>
  (value: T): string[] =>
    validators.map((v) => v(value)).filter((error): error is string => error !== null);

// Pre-built validators using lambdas
const validateEmail = combineValidators(
  required,
  minLength(5),
  matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
);

const validatePassword = combineValidators(
  required,
  minLength(8),
  matches(/[A-Z]/, "Must contain uppercase"),
  matches(/[a-z]/, "Must contain lowercase"),
  matches(/[0-9]/, "Must contain number")
);

// Example 8: Strategy Pattern with Lambdas
// ========================================

type SortStrategy<T> = (items: T[]) => T[];

// Sort strategies as lambdas
const ascendingSort: SortStrategy<number> = (items) => [...items].sort((a, b) => a - b);
const descendingSort: SortStrategy<number> = (items) => [...items].sort((a, b) => b - a);
const randomSort: SortStrategy<number> = (items) => [...items].sort(() => Math.random() - 0.5);

// Sort by property (returns lambda)
const sortByProperty =
  <T, K extends keyof T>(key: K, descending = false): SortStrategy<T> =>
  (items) =>
    [...items].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return descending ? -comparison : comparison;
    });

// Example 9: Factory Functions with Lambdas
// =========================================

interface User {
  id: number;
  name: string;
  email: string;
}

// Factory as lambda
const createUser = (() => {
  let nextId = 1;
  return (name: string, email: string): User => ({
    id: nextId++,
    name,
    email,
  });
})();

// UUID factory as lambda
const createUUID = (): string =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

// Random number factory
const createRandomInRange = (min: number, max: number) => (): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Example 10: Command Pattern with Lambdas
// ========================================

type Command = {
  execute: () => void;
  undo: () => void;
};

// Text editor with command support
const createTextEditor = () => {
  let content = "";

  return {
    getContent: () => content,
    setContent: (newContent: string) => (content = newContent),
    append: (text: string) => (content += text),
    deleteLast: (count: number) => {
      const deleted = content.slice(-count);
      content = content.slice(0, -count);
      return deleted;
    },
  };
};

// Command factory using lambdas
const createAppendCommand = (
  editor: ReturnType<typeof createTextEditor>,
  text: string
): Command => ({
  execute: () => editor.append(text),
  undo: () => editor.deleteLast(text.length),
});

const createDeleteCommand = (
  editor: ReturnType<typeof createTextEditor>,
  count: number
): Command => {
  let deleted = "";
  return {
    execute: () => (deleted = editor.deleteLast(count)),
    undo: () => editor.append(deleted),
  };
};

// Demonstration
// =============

function demonstrateLambdas(): void {
  console.log("=== FP Lambda (Arrow Functions) Demonstration ===\n");

  // Basic lambdas
  console.log("1. Basic Lambda Expressions:");
  console.log(`add(2, 3) = ${add(2, 3)}`);
  console.log(`square(4) = ${square(4)}`);
  console.log(`isEven(5) = ${isEven(5)}`);
  console.log(`greaterThan(5)(7) = ${greaterThan(5)(7)}`);
  console.log(`between(1, 10)(5) = ${between(1, 10)(5)}`);

  // Collection operations
  console.log("\n2. Collection Operations with Inline Lambdas:");
  processNumbers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  // Event handling
  console.log("\n3. Event Handling with Lambdas:");
  const clickEmitter = createEventEmitter<ClickEvent>();

  // Add handlers using inline lambdas
  const unsubscribe1 = clickEmitter.on((e) => console.log(`Click at (${e.x}, ${e.y})`));
  const unsubscribe2 = clickEmitter.on((e) => console.log(`Button: ${e.button}`));

  clickEmitter.emit({ x: 100, y: 200, button: "left" });

  // Unsubscribe one handler
  unsubscribe1();
  console.log("After unsubscribing first handler:");
  clickEmitter.emit({ x: 150, y: 250, button: "right" });

  // Closures
  console.log("\n4. Closures with Lambdas:");
  const counter = createCounter(0);
  console.log(`Initial: ${counter.get()}`);
  console.log(`After increment: ${counter.increment()}`);
  console.log(`After increment: ${counter.increment()}`);
  console.log(`After decrement: ${counter.decrement()}`);

  // Memoization
  console.log("\n5. Memoization with Lambdas:");
  let callCount = 0;
  const expensiveFunction = (n: number): number => {
    callCount++;
    console.log(`  Computing for ${n}...`);
    return n * n;
  };
  const memoized = memoize(expensiveFunction);

  console.log(`memoized(5) = ${memoized(5)}`);
  console.log(`memoized(5) = ${memoized(5)} (cached)`);
  console.log(`memoized(6) = ${memoized(6)}`);
  console.log(`Total calls: ${callCount}`);

  // Function composition
  console.log("\n6. Function Composition with Lambdas:");
  console.log(`compose(addOne, triple, double)(5) = ${composed(5)}`);
  console.log(`pipe(double, triple, addOne)(5) = ${piped(5)}`);

  // Validation
  console.log("\n7. Validation with Lambdas:");
  console.log(`validateEmail("test@example.com"): [${validateEmail("test@example.com")}]`);
  console.log(`validateEmail("invalid"): [${validateEmail("invalid")}]`);
  console.log(`validatePassword("Abc12345"): [${validatePassword("Abc12345")}]`);
  console.log(`validatePassword("weak"): [${validatePassword("weak")}]`);

  // Strategy pattern
  console.log("\n8. Strategy Pattern with Lambdas:");
  const numbers = [5, 2, 8, 1, 9, 3];
  console.log(`Original: [${numbers}]`);
  console.log(`Ascending: [${ascendingSort(numbers)}]`);
  console.log(`Descending: [${descendingSort(numbers)}]`);

  const users = [
    { name: "Charlie", age: 30 },
    { name: "Alice", age: 25 },
    { name: "Bob", age: 35 },
  ];
  const sortByAge = sortByProperty<(typeof users)[0], "age">("age");
  console.log(`Sorted by age: ${JSON.stringify(sortByAge(users))}`);

  // Factory functions
  console.log("\n9. Factory Functions with Lambdas:");
  const user1 = createUser("Alice", "alice@example.com");
  const user2 = createUser("Bob", "bob@example.com");
  console.log(`User 1: ${JSON.stringify(user1)}`);
  console.log(`User 2: ${JSON.stringify(user2)}`);
  console.log(`UUID: ${createUUID()}`);

  const randomDice = createRandomInRange(1, 6);
  console.log(`Random dice rolls: ${randomDice()}, ${randomDice()}, ${randomDice()}`);

  // Command pattern
  console.log("\n10. Command Pattern with Lambdas:");
  const editor = createTextEditor();
  const commands: Command[] = [];

  const appendHello = createAppendCommand(editor, "Hello ");
  appendHello.execute();
  commands.push(appendHello);
  console.log(`After append "Hello ": "${editor.getContent()}"`);

  const appendWorld = createAppendCommand(editor, "World!");
  appendWorld.execute();
  commands.push(appendWorld);
  console.log(`After append "World!": "${editor.getContent()}"`);

  // Undo using lambda
  const lastCommand = commands.pop();
  lastCommand?.undo();
  console.log(`After undo: "${editor.getContent()}"`);
}

demonstrateLambdas();

export {
  // Basic lambdas
  add,
  multiply,
  square,
  double,
  isEven,
  isPositive,
  toString,
  identity,
  factorial,
  greaterThan,
  lessThan,
  between,
  addN,
  multiplyBy,
  // Collection utilities
  map,
  filter,
  reduce,
  find,
  some,
  every,
  processNumbers,
  // Event handling
  createEventEmitter,
  // Async
  fetchDataCallback,
  fetchDataPromise,
  fetchMultiple,
  // Closures
  createCounter,
  memoize,
  debounce,
  throttle,
  // Composition
  compose,
  pipe,
  addOne,
  triple,
  negate,
  composed,
  piped,
  // Validation
  required,
  minLength,
  maxLength,
  matches,
  minValue,
  maxValue,
  combineValidators,
  validateEmail,
  validatePassword,
  // Strategy
  ascendingSort,
  descendingSort,
  randomSort,
  sortByProperty,
  // Factory
  createUser,
  createUUID,
  createRandomInRange,
  // Command
  createTextEditor,
  createAppendCommand,
  createDeleteCommand,
};

export type { EventHandler, ClickEvent, KeyEvent, Validator, SortStrategy, Command, User };

