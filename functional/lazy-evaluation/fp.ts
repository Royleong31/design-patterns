/**
 * LAZY EVALUATION - Functional Programming Approach
 *
 * Lazy evaluation delays computation until the result is actually needed.
 * In JavaScript/TypeScript, this is achieved through:
 * - Generators (function*)
 * - Iterators
 * - Thunks (functions that wrap computations)
 *
 * Benefits:
 * - Only compute what's needed
 * - Support infinite sequences
 * - Better memory efficiency for large datasets
 * - Can short-circuit when result is found
 */

// Example 1: Lazy Collection with Generators
// ==========================================

// Generator-based lazy operations
function* lazyMap<T, R>(
  iterable: Iterable<T>,
  fn: (item: T) => R
): Generator<R> {
  for (const item of iterable) {
    console.log(`    [Lazy] Mapping: ${item}`);
    yield fn(item);
  }
}

function* lazyFilter<T>(
  iterable: Iterable<T>,
  predicate: (item: T) => boolean
): Generator<T> {
  for (const item of iterable) {
    console.log(`    [Lazy] Filtering: ${item}`);
    if (predicate(item)) {
      yield item;
    }
  }
}

function* lazyTake<T>(iterable: Iterable<T>, n: number): Generator<T> {
  let count = 0;
  for (const item of iterable) {
    if (count >= n) break;
    console.log(`    [Lazy] Taking: ${item}`);
    yield item;
    count++;
  }
}

function* lazySkip<T>(iterable: Iterable<T>, n: number): Generator<T> {
  let count = 0;
  for (const item of iterable) {
    if (count >= n) {
      yield item;
    }
    count++;
  }
}

// Lazy collection class using generators
class LazyCollection<T> {
  private source: Iterable<T>;

  constructor(source: Iterable<T>) {
    this.source = source;
  }

  map<R>(fn: (item: T) => R): LazyCollection<R> {
    return new LazyCollection(lazyMap(this.source, fn));
  }

  filter(predicate: (item: T) => boolean): LazyCollection<T> {
    return new LazyCollection(lazyFilter(this.source, predicate));
  }

  take(n: number): LazyCollection<T> {
    return new LazyCollection(lazyTake(this.source, n));
  }

  skip(n: number): LazyCollection<T> {
    return new LazyCollection(lazySkip(this.source, n));
  }

  // Terminal operation - actually executes the chain
  toArray(): T[] {
    return [...this.source];
  }

  // Terminal operation - gets first item
  first(): T | undefined {
    for (const item of this.source) {
      return item;
    }
    return undefined;
  }

  // Terminal operation - reduces to single value
  reduce<R>(reducer: (acc: R, item: T) => R, initial: R): R {
    let acc = initial;
    for (const item of this.source) {
      acc = reducer(acc, item);
    }
    return acc;
  }

  // Terminal operation - finds first matching
  find(predicate: (item: T) => boolean): T | undefined {
    for (const item of this.source) {
      if (predicate(item)) {
        return item;
      }
    }
    return undefined;
  }

  // Terminal operation - forEach
  forEach(fn: (item: T) => void): void {
    for (const item of this.source) {
      fn(item);
    }
  }
}

// Example 2: Lazy/Infinite Range Generation
// =========================================

// Infinite range generator
function* infiniteRange(start: number = 0, step: number = 1): Generator<number> {
  let current = start;
  while (true) {
    yield current;
    current += step;
  }
}

// Finite range generator
function* range(start: number, end: number, step: number = 1): Generator<number> {
  for (let i = start; i <= end; i += step) {
    yield i;
  }
}

// Lazy even numbers (infinite)
function* evenNumbers(start: number = 0): Generator<number> {
  let current = start % 2 === 0 ? start : start + 1;
  while (true) {
    yield current;
    current += 2;
  }
}

// Lazy prime numbers (infinite)
function* primeNumbers(): Generator<number> {
  const isPrime = (n: number): boolean => {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      if (n % i === 0) return false;
    }
    return true;
  };

  let n = 2;
  while (true) {
    if (isPrime(n)) {
      yield n;
    }
    n++;
  }
}

// Lazy Fibonacci sequence (infinite)
function* fibonacciSequence(): Generator<number> {
  let a = 0;
  let b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// Example 3: Lazy Data Fetching
// =============================

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserDetails extends User {
  profile: string;
  preferences: string[];
}

// Generator that lazily fetches user details
function* lazyUserDetails(users: User[]): Generator<UserDetails> {
  for (const user of users) {
    console.log(`  [Lazy] Fetching details for user ${user.id}...`);
    // Only fetches when requested
    yield {
      ...user,
      profile: `Profile for ${user.name}`,
      preferences: ["pref1", "pref2", "pref3"],
    };
  }
}

// Lazy user service
const createLazyUserService = () => {
  const users: User[] = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
    { id: 3, name: "Charlie", email: "charlie@example.com" },
    { id: 4, name: "Diana", email: "diana@example.com" },
    { id: 5, name: "Eve", email: "eve@example.com" },
  ];

  return {
    // Returns a lazy iterator
    getUsersWithDetails: () => lazyUserDetails(users),

    // Gets first user, only fetches that one
    getFirstUserWithDetails: (): UserDetails | undefined => {
      const iterator = lazyUserDetails(users);
      const result = iterator.next();
      return result.done ? undefined : result.value;
    },

    // Gets users by ids, only fetches those needed
    getUsersByIds: function* (ids: number[]): Generator<UserDetails> {
      for (const user of users) {
        if (ids.includes(user.id)) {
          console.log(`  [Lazy] Fetching details for user ${user.id}...`);
          yield {
            ...user,
            profile: `Profile for ${user.name}`,
            preferences: ["pref1", "pref2", "pref3"],
          };
        }
      }
    },
  };
};

// Example 4: Lazy Computation Chain
// =================================

// Compose lazy operations
const lazyProcess = (numbers: Iterable<number>) => {
  return new LazyCollection(numbers)
    .filter((n) => n % 2 === 0)
    .map((n) => n * 2)
    .map((n) => n + 1)
    .take(5);
};

// Example 5: Lazy File Processing (Simulated)
// ===========================================

interface FileRecord {
  id: number;
  data: string;
  size: number;
}

// Generator that lazily reads records
function* lazyReadRecords(recordCount: number): Generator<FileRecord> {
  console.log(`[Lazy] Starting lazy record reading (${recordCount} available)...`);

  for (let i = 0; i < recordCount; i++) {
    console.log(`  [Lazy] Reading record ${i}...`);
    yield {
      id: i,
      data: `Data for record ${i}`,
      size: Math.floor(Math.random() * 1000),
    };
  }
}

// Find first matching record lazily
function* lazyFindLargeRecords(
  recordCount: number,
  minSize: number
): Generator<FileRecord> {
  for (const record of lazyReadRecords(recordCount)) {
    if (record.size > minSize) {
      yield record;
    }
  }
}

// Example 6: Thunks for Lazy Values
// =================================

// A thunk is a function that wraps a computation
type Thunk<T> = () => T;

// Create a lazy value that's only computed once when accessed
const lazy = <T>(computation: () => T): Thunk<T> => {
  let computed = false;
  let value: T;

  return () => {
    if (!computed) {
      console.log("  [Lazy] Computing value...");
      value = computation();
      computed = true;
    }
    return value;
  };
};

// Lazy record that computes expensive values on demand
const createLazyRecord = (id: number) => {
  const expensiveComputation = lazy(() => {
    console.log(`  [Lazy] Running expensive computation for ${id}...`);
    let result = 0;
    for (let i = 0; i < 1000; i++) {
      result += Math.sin(id * i);
    }
    return result;
  });

  return {
    id,
    // Value is only computed when accessed
    get expensiveValue() {
      return expensiveComputation();
    },
  };
};

// Example 7: Lazy Evaluation with Transducers
// ===========================================

// Transducers compose transformations without creating intermediate arrays
type Reducer<A, B> = (acc: A, item: B) => A;
type Transducer<A, B> = <R>(reducer: Reducer<R, B>) => Reducer<R, A>;

const mapTransducer =
  <A, B>(fn: (item: A) => B): Transducer<A, B> =>
  <R>(reducer: Reducer<R, B>): Reducer<R, A> =>
  (acc, item) =>
    reducer(acc, fn(item));

const filterTransducer =
  <A>(predicate: (item: A) => boolean): Transducer<A, A> =>
  <R>(reducer: Reducer<R, A>): Reducer<R, A> =>
  (acc, item) =>
    predicate(item) ? reducer(acc, item) : acc;

const composeTransducers =
  <A, B, C>(t1: Transducer<A, B>, t2: Transducer<B, C>): Transducer<A, C> =>
  <R>(reducer: Reducer<R, C>): Reducer<R, A> =>
    t1(t2(reducer));

// Apply transducer to array (single pass!)
const transduce = <A, B, R>(
  transducer: Transducer<A, B>,
  reducer: Reducer<R, B>,
  initial: R,
  arr: A[]
): R => arr.reduce(transducer(reducer), initial);

// Example 8: Lazy Pagination
// ==========================

interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Generator-based lazy pagination
function* lazyPaginate<T>(
  source: () => Generator<T>,
  pageSize: number
): Generator<PaginatedResult<T>> {
  let page = 1;
  let items: T[] = [];
  const generator = source();

  while (true) {
    // Collect one page of items
    items = [];
    for (let i = 0; i < pageSize; i++) {
      const result = generator.next();
      if (result.done) {
        if (items.length > 0) {
          yield { items, page, pageSize, hasMore: false };
        }
        return;
      }
      items.push(result.value);
    }

    yield { items, page, pageSize, hasMore: true };
    page++;
  }
}

// Demonstration
// =============

function demonstrateLazyEvaluation(): void {
  console.log("=== FP Lazy Evaluation Demonstration ===\n");

  // Lazy Collection
  console.log("1. Lazy Collection Processing:");
  console.log("   (Notice: Only processes items that are actually needed)\n");

  const collection = new LazyCollection([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const result = collection
    .filter((n) => n % 2 === 0)
    .map((n) => n * 2)
    .take(2)
    .toArray();

  console.log(`\n   Final result: [${result}]`);

  // Infinite Range
  console.log("\n2. Infinite Range (Lazy):");
  console.log("   (Notice: Can work with infinite sequences)\n");

  const firstThreeEvens = [...lazyTake(evenNumbers(1), 3)];
  console.log(`   First 3 even numbers starting from 1: [${firstThreeEvens}]`);

  const firstFivePrimes = [...lazyTake(primeNumbers(), 5)];
  console.log(`   First 5 primes: [${firstFivePrimes}]`);

  const firstTenFib = [...lazyTake(fibonacciSequence(), 10)];
  console.log(`   First 10 Fibonacci: [${firstTenFib}]`);

  // Lazy User Service
  console.log("\n3. Lazy Data Fetching:");
  console.log("   (Notice: Only fetches the user we actually need)\n");

  const userService = createLazyUserService();
  const firstUser = userService.getFirstUserWithDetails();
  console.log(`   First user: ${firstUser?.name}`);

  // Lazy Processing Chain
  console.log("\n4. Lazy Processing Chain:");
  console.log("   (Notice: Only processes items until we have 5)\n");

  const numbers = Array.from({ length: 100 }, (_, i) => i + 1);
  const processed = lazyProcess(numbers).toArray();
  console.log(`\n   Processed (first 5): [${processed}]`);

  const sum = lazyProcess(numbers).reduce((acc, n) => acc + n, 0);
  console.log(`   Sum of first 5: ${sum}`);

  // Lazy File Processing
  console.log("\n5. Lazy File Processing:");
  console.log("   (Notice: Stops reading as soon as we find first match)\n");

  const largeRecords = lazyFindLargeRecords(1000, 900);
  const firstLarge = largeRecords.next().value;
  console.log(`   First large record: ${firstLarge?.id}`);

  // Thunks
  console.log("\n6. Lazy Values with Thunks:");
  console.log("   (Notice: Expensive computation only runs when accessed)\n");

  const record = createLazyRecord(42);
  console.log(`   Record created with id: ${record.id}`);
  console.log("   Accessing expensive value first time:");
  console.log(`   Value: ${record.expensiveValue.toFixed(4)}`);
  console.log("   Accessing expensive value second time (cached):");
  console.log(`   Value: ${record.expensiveValue.toFixed(4)}`);

  // Transducers
  console.log("\n7. Transducers (Single-pass Transformation):");
  console.log("   (Notice: No intermediate arrays created)\n");

  const double = mapTransducer<number, number>((x) => x * 2);
  const isEven = filterTransducer<number>((x) => x % 2 === 0);
  const composed = composeTransducers(isEven, double);

  const transducerResult = transduce(
    composed,
    (acc: number[], x) => [...acc, x],
    [],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  );
  console.log(`   Filter even, then double: [${transducerResult}]`);

  // Lazy Pagination
  console.log("\n8. Lazy Pagination:");
  console.log("   (Notice: Only generates items for requested pages)\n");

  const pages = lazyPaginate(() => range(1, 25), 5);

  console.log("   Getting page 1:");
  const page1 = pages.next().value;
  console.log(`   Items: [${page1?.items}], hasMore: ${page1?.hasMore}`);

  console.log("   Getting page 2:");
  const page2 = pages.next().value;
  console.log(`   Items: [${page2?.items}], hasMore: ${page2?.hasMore}`);
}

demonstrateLazyEvaluation();

export {
  // Generators
  lazyMap,
  lazyFilter,
  lazyTake,
  lazySkip,
  // Lazy collection
  LazyCollection,
  // Range generators
  infiniteRange,
  range,
  evenNumbers,
  primeNumbers,
  fibonacciSequence,
  // User service
  lazyUserDetails,
  createLazyUserService,
  // Processing
  lazyProcess,
  // File processing
  lazyReadRecords,
  lazyFindLargeRecords,
  // Thunks
  lazy,
  createLazyRecord,
  // Transducers
  mapTransducer,
  filterTransducer,
  composeTransducers,
  transduce,
  // Pagination
  lazyPaginate,
};

export type { User, UserDetails, FileRecord, Thunk, Reducer, Transducer, PaginatedResult };

