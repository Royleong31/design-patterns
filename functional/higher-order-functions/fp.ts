/**
 * HIGHER-ORDER FUNCTIONS - Functional Programming Approach
 *
 * A Higher-Order Function (HOF) is a function that:
 * - Takes one or more functions as arguments, OR
 * - Returns a function as its result
 *
 * Benefits of HOFs:
 * - Less boilerplate (no interfaces/classes needed)
 * - More flexible (functions can be created on the fly)
 * - Better composition (functions combine naturally)
 * - More concise and readable code
 *
 * Common HOFs: map, filter, reduce, sort, forEach, find, some, every
 */

// Example 1: Map - Transform each element
// =======================================

// Basic map usage with inline functions
const double = (x: number): number => x * 2;
const square = (x: number): number => x * x;
const toUpperCase = (s: string): string => s.toUpperCase();
const getLength = (s: string): number => s.length;

// Creating a reusable map function (like Array.prototype.map)
const map = <T, R>(arr: readonly T[], fn: (item: T) => R): R[] => {
  return arr.map(fn);
};

// HOF that returns a mapper function
const createMapper = <T, R>(fn: (item: T) => R) => {
  return (arr: readonly T[]): R[] => arr.map(fn);
};

// Example usage:
const doubleAll = createMapper(double);
const squareAll = createMapper(square);

// Example 2: Filter - Select elements that match a predicate
// ==========================================================

// Predicate functions
const isEven = (x: number): boolean => x % 2 === 0;
const isPositive = (x: number): boolean => x > 0;
const isLongString = (minLength: number) => (s: string): boolean =>
  s.length >= minLength;

// Creating a reusable filter function
const filter = <T>(arr: readonly T[], predicate: (item: T) => boolean): T[] => {
  return arr.filter(predicate);
};

// HOF that returns a filter function
const createFilter = <T>(predicate: (item: T) => boolean) => {
  return (arr: readonly T[]): T[] => arr.filter(predicate);
};

// Combining predicates with HOFs
const and =
  <T>(...predicates: Array<(item: T) => boolean>) =>
  (item: T): boolean =>
    predicates.every((p) => p(item));

const or =
  <T>(...predicates: Array<(item: T) => boolean>) =>
  (item: T): boolean =>
    predicates.some((p) => p(item));

const not =
  <T>(predicate: (item: T) => boolean) =>
  (item: T): boolean =>
    !predicate(item);

// Example 3: Reduce - Aggregate elements into a single value
// ==========================================================

// Reducer functions
const sum = (acc: number, x: number): number => acc + x;
const product = (acc: number, x: number): number => acc * x;
const concat = (separator: string) => (acc: string, x: string): string =>
  acc ? acc + separator + x : x;

// Creating a reusable reduce function
const reduce = <T, R>(
  arr: readonly T[],
  reducer: (acc: R, item: T) => R,
  initial: R
): R => {
  return arr.reduce(reducer, initial);
};

// HOF that creates a reducer with initial value
const createReducer = <T, R>(
  reducer: (acc: R, item: T) => R,
  initial: R
) => {
  return (arr: readonly T[]): R => arr.reduce(reducer, initial);
};

// Example usage:
const sumAll = createReducer(sum, 0);
const productAll = createReducer(product, 1);
const joinWithComma = createReducer(concat(", "), "");

// Example 4: Sort - Order elements using a comparator
// ====================================================

// Comparator functions
const ascending = (a: number, b: number): number => a - b;
const descending = (a: number, b: number): number => b - a;
const alphabetical = (a: string, b: string): number => a.localeCompare(b);

// HOF that creates a sort function
const createSorter = <T>(comparator: (a: T, b: T) => number) => {
  return (arr: readonly T[]): T[] => [...arr].sort(comparator);
};

// Sort by property
const sortBy = <T, K extends keyof T>(key: K) => {
  return (arr: readonly T[]): T[] =>
    [...arr].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
      return 0;
    });
};

// Example 5: Compose and Pipe - Combine multiple functions
// ========================================================

// Compose: Right to left function composition
// compose(f, g, h)(x) = f(g(h(x)))
const compose =
  <T>(...fns: Array<(arg: T) => T>) =>
  (x: T): T =>
    fns.reduceRight((acc, fn) => fn(acc), x);

// Pipe: Left to right function composition
// pipe(f, g, h)(x) = h(g(f(x)))
const pipe =
  <T>(...fns: Array<(arg: T) => T>) =>
  (x: T): T =>
    fns.reduce((acc, fn) => fn(acc), x);

// More flexible pipe that handles type changes
type PipeFn<A, B> = (arg: A) => B;

function pipeWith<A, B>(fn1: PipeFn<A, B>): PipeFn<A, B>;
function pipeWith<A, B, C>(fn1: PipeFn<A, B>, fn2: PipeFn<B, C>): PipeFn<A, C>;
function pipeWith<A, B, C, D>(
  fn1: PipeFn<A, B>,
  fn2: PipeFn<B, C>,
  fn3: PipeFn<C, D>
): PipeFn<A, D>;
function pipeWith<A, B, C, D, E>(
  fn1: PipeFn<A, B>,
  fn2: PipeFn<B, C>,
  fn3: PipeFn<C, D>,
  fn4: PipeFn<D, E>
): PipeFn<A, E>;
function pipeWith(...fns: Array<(arg: unknown) => unknown>) {
  return (x: unknown) => fns.reduce((acc, fn) => fn(acc), x);
}

// Example 6: Event Handling with Functions
// ========================================

type EventHandler<T> = (event: T) => void;

type Event = {
  type: string;
  timestamp: Date;
  data: unknown;
};

// HOF that creates an event emitter
const createEventEmitter = <T>() => {
  const handlers: Array<EventHandler<T>> = [];

  return {
    // HOF: takes a function as argument
    subscribe: (handler: EventHandler<T>): (() => void) => {
      handlers.push(handler);
      // Returns a function to unsubscribe
      return () => {
        const index = handlers.indexOf(handler);
        if (index !== -1) handlers.splice(index, 1);
      };
    },
    emit: (event: T): void => {
      handlers.forEach((handler) => handler(event));
    },
  };
};

// HOF that creates a logging handler
const createLogger =
  (prefix: string): EventHandler<Event> =>
  (event) => {
    console.log(`[${prefix}] ${event.type}:`, event.data);
  };

// HOF that creates a metrics handler
const createMetrics = () => {
  const counts = new Map<string, number>();

  const handler: EventHandler<Event> = (event) => {
    counts.set(event.type, (counts.get(event.type) || 0) + 1);
  };

  return {
    handler,
    getCounts: () => new Map(counts),
  };
};

// Example 7: Data Processing Pipeline
// ===================================

// HOF that creates a data processor
const createProcessor = <T, R>(
  validate: (items: T[]) => T[],
  transform: (item: T) => R,
  postProcess: (items: R[]) => R[]
) => {
  return (items: T[]): R[] => {
    const validated = validate(items);
    const transformed = validated.map(transform);
    return postProcess(transformed);
  };
};

// Example processors using the HOF
const processNumbers = createProcessor<number, number>(
  (items) => items.filter((n) => !isNaN(n) && isFinite(n)),
  (n) => n * 2,
  (items) => items.sort((a, b) => a - b)
);

const processStrings = createProcessor<string, string>(
  (items) => items.filter((s) => s.trim().length > 0),
  (s) => s.toUpperCase(),
  (items) => items.sort()
);

// Example 8: Utility HOFs
// =======================

// HOF: Creates a function that applies fn to each element
const forEach =
  <T>(fn: (item: T) => void) =>
  (arr: readonly T[]): void => {
    arr.forEach(fn);
  };

// HOF: Creates a function that finds first matching element
const findWhere =
  <T>(predicate: (item: T) => boolean) =>
  (arr: readonly T[]): T | undefined => {
    return arr.find(predicate);
  };

// HOF: Creates a function that checks if any element matches
const someMatch =
  <T>(predicate: (item: T) => boolean) =>
  (arr: readonly T[]): boolean => {
    return arr.some(predicate);
  };

// HOF: Creates a function that checks if all elements match
const allMatch =
  <T>(predicate: (item: T) => boolean) =>
  (arr: readonly T[]): boolean => {
    return arr.every(predicate);
  };

// HOF: Memoization - caches function results
const memoize = <T extends (...args: unknown[]) => unknown>(fn: T): T => {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as T;
};

// HOF: Debounce - limits how often a function can be called
const debounce = <T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>): void => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// Demonstration
// =============

function demonstrateHOFs(): void {
  console.log("=== FP Higher-Order Functions Demonstration ===\n");

  // Map
  console.log("1. Map - Transform elements:");
  const numbers = [1, 2, 3, 4, 5];
  console.log(`Original: [${numbers}]`);
  console.log(`Doubled: [${numbers.map(double)}]`);
  console.log(`Squared: [${numbers.map(square)}]`);
  console.log(`Using createMapper: [${doubleAll(numbers)}]`);

  // Filter
  console.log("\n2. Filter - Select elements:");
  const mixedNumbers = [-3, -1, 0, 1, 2, 3, 4, 5, 6];
  console.log(`Original: [${mixedNumbers}]`);
  console.log(`Even: [${mixedNumbers.filter(isEven)}]`);
  console.log(`Positive: [${mixedNumbers.filter(isPositive)}]`);
  console.log(`Even AND Positive: [${mixedNumbers.filter(and(isEven, isPositive))}]`);
  console.log(`Even OR Negative: [${mixedNumbers.filter(or(isEven, not(isPositive)))}]`);

  // Reduce
  console.log("\n3. Reduce - Aggregate elements:");
  const values = [1, 2, 3, 4, 5];
  console.log(`Sum of [${values}]: ${values.reduce(sum, 0)}`);
  console.log(`Product of [${values}]: ${values.reduce(product, 1)}`);
  console.log(`Using createReducer: ${sumAll(values)}`);

  const words = ["Hello", "World", "!"];
  console.log(`Join with space: "${words.reduce(concat(" "), "")}"`);

  // Sort
  console.log("\n4. Sort - Order elements:");
  const unsorted = [5, 2, 8, 1, 9, 3];
  console.log(`Original: [${unsorted}]`);
  console.log(`Ascending: [${[...unsorted].sort(ascending)}]`);
  console.log(`Descending: [${[...unsorted].sort(descending)}]`);

  const sortAsc = createSorter(ascending);
  console.log(`Using createSorter: [${sortAsc(unsorted)}]`);

  // Compose and Pipe
  console.log("\n5. Compose and Pipe:");
  const addOne = (x: number): number => x + 1;
  const triple = (x: number): number => x * 3;

  const composed = compose(addOne, triple, double); // addOne(triple(double(x)))
  const piped = pipe(double, triple, addOne); // addOne(triple(double(x)))

  console.log(`compose(addOne, triple, double)(5) = ${composed(5)}`); // 31
  console.log(`pipe(double, triple, addOne)(5) = ${piped(5)}`); // 31

  // Chaining array methods (natural pipe)
  console.log("\n6. Method Chaining (Natural Pipe):");
  const result = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    .filter(isEven)
    .map(square)
    .reduce(sum, 0);
  console.log(`Sum of squares of even numbers 1-10: ${result}`);

  // Event handling
  console.log("\n7. Event Handling with HOFs:");
  const emitter = createEventEmitter<Event>();
  const logger = createLogger("APP");
  const metrics = createMetrics();

  emitter.subscribe(logger);
  const unsubscribe = emitter.subscribe(metrics.handler);

  emitter.emit({ type: "user.login", timestamp: new Date(), data: { userId: "123" } });
  emitter.emit({ type: "user.click", timestamp: new Date(), data: { button: "submit" } });
  emitter.emit({ type: "user.login", timestamp: new Date(), data: { userId: "456" } });

  console.log("Metrics:", Object.fromEntries(metrics.getCounts()));

  // Unsubscribe returns a function
  unsubscribe();

  // Data processing
  console.log("\n8. Data Processing Pipeline:");
  const rawNumbers = [NaN, 5, 3, Infinity, 1, 4, 2];
  console.log(`Processed numbers: [${processNumbers(rawNumbers)}]`);

  const rawStrings = ["  ", "hello", "world", "", "foo"];
  console.log(`Processed strings: [${processStrings(rawStrings)}]`);

  // Utility HOFs
  console.log("\n9. Utility HOFs:");
  const data = [
    { name: "Alice", age: 30 },
    { name: "Bob", age: 25 },
    { name: "Charlie", age: 35 },
  ];

  const findByName = findWhere<(typeof data)[0]>((p) => p.name === "Bob");
  console.log(`Found: ${JSON.stringify(findByName(data))}`);

  const hasAdult = someMatch<(typeof data)[0]>((p) => p.age >= 18);
  console.log(`Has adult: ${hasAdult(data)}`);

  const allAdults = allMatch<(typeof data)[0]>((p) => p.age >= 18);
  console.log(`All adults: ${allAdults(data)}`);

  // Memoization
  console.log("\n10. Memoization:");
  let callCount = 0;
  const expensiveOperation = (n: number): number => {
    callCount++;
    console.log(`  Computing fibonacci(${n})...`);
    if (n <= 1) return n;
    return expensiveOperation(n - 1) + expensiveOperation(n - 2);
  };

  const memoizedFib = memoize((n: number): number => {
    if (n <= 1) return n;
    return memoizedFib(n - 1) + memoizedFib(n - 2);
  });

  console.log(`memoizedFib(10) = ${memoizedFib(10)}`);
  console.log(`memoizedFib(10) again = ${memoizedFib(10)}`); // Instant from cache
}

demonstrateHOFs();

export {
  // Map
  double,
  square,
  toUpperCase,
  getLength,
  map,
  createMapper,
  doubleAll,
  squareAll,
  // Filter
  isEven,
  isPositive,
  isLongString,
  filter,
  createFilter,
  and,
  or,
  not,
  // Reduce
  sum,
  product,
  concat,
  reduce,
  createReducer,
  sumAll,
  productAll,
  joinWithComma,
  // Sort
  ascending,
  descending,
  alphabetical,
  createSorter,
  sortBy,
  // Compose and Pipe
  compose,
  pipe,
  pipeWith,
  // Event handling
  createEventEmitter,
  createLogger,
  createMetrics,
  // Data processing
  createProcessor,
  processNumbers,
  processStrings,
  // Utility HOFs
  forEach,
  findWhere,
  someMatch,
  allMatch,
  memoize,
  debounce,
};

export type { EventHandler, Event, PipeFn };

