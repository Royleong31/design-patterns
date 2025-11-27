/**
 * FUNCTION COMPOSITION - Functional Programming Approach
 *
 * Function composition is combining simple functions to build complex ones.
 * The output of one function becomes the input of the next.
 *
 * Key concepts:
 * - compose: Right-to-left composition (f ∘ g)(x) = f(g(x))
 * - pipe: Left-to-right composition (more readable)
 * - Point-free style: Define functions without mentioning arguments
 *
 * Benefits:
 * - Small, focused, reusable functions
 * - Easy to test each function in isolation
 * - Clear data flow
 * - No intermediate variables needed
 */

// Basic Composition Utilities
// ===========================

// Compose: Right to left - compose(f, g, h)(x) = f(g(h(x)))
const compose =
  <T>(...fns: Array<(arg: T) => T>) =>
  (x: T): T =>
    fns.reduceRight((acc, fn) => fn(acc), x);

// Pipe: Left to right - pipe(f, g, h)(x) = h(g(f(x)))
const pipe =
  <T>(...fns: Array<(arg: T) => T>) =>
  (x: T): T =>
    fns.reduce((acc, fn) => fn(acc), x);

// Type-safe pipe with different types at each step
type Fn<A, B> = (arg: A) => B;

function pipeWith<A, B>(fn1: Fn<A, B>): Fn<A, B>;
function pipeWith<A, B, C>(fn1: Fn<A, B>, fn2: Fn<B, C>): Fn<A, C>;
function pipeWith<A, B, C, D>(
  fn1: Fn<A, B>,
  fn2: Fn<B, C>,
  fn3: Fn<C, D>
): Fn<A, D>;
function pipeWith<A, B, C, D, E>(
  fn1: Fn<A, B>,
  fn2: Fn<B, C>,
  fn3: Fn<C, D>,
  fn4: Fn<D, E>
): Fn<A, E>;
function pipeWith<A, B, C, D, E, F>(
  fn1: Fn<A, B>,
  fn2: Fn<B, C>,
  fn3: Fn<C, D>,
  fn4: Fn<D, E>,
  fn5: Fn<E, F>
): Fn<A, F>;
function pipeWith(...fns: Array<(arg: unknown) => unknown>) {
  return (x: unknown) => fns.reduce((acc, fn) => fn(acc), x);
}

// Example 1: Query Builder with Composition
// =========================================

type Query = Readonly<{
  select: string[];
  from: string;
  where: string[];
  orderBy: { field: string; direction: "ASC" | "DESC" } | null;
  limit: number | null;
  offset: number | null;
}>;

// Create empty query
const createQuery = (): Query => ({
  select: [],
  from: "",
  where: [],
  orderBy: null,
  limit: null,
  offset: null,
});

// Pure functions that transform queries
const select =
  (...fields: string[]) =>
  (query: Query): Query => ({
    ...query,
    select: fields,
  });

const from =
  (table: string) =>
  (query: Query): Query => ({
    ...query,
    from: table,
  });

const where =
  (condition: string) =>
  (query: Query): Query => ({
    ...query,
    where: [...query.where, condition],
  });

const orderBy =
  (field: string, direction: "ASC" | "DESC" = "ASC") =>
  (query: Query): Query => ({
    ...query,
    orderBy: { field, direction },
  });

const limit =
  (count: number) =>
  (query: Query): Query => ({
    ...query,
    limit: count,
  });

const offset =
  (count: number) =>
  (query: Query): Query => ({
    ...query,
    offset: count,
  });

// Build SQL string from query
const buildQuery = (query: Query): string => {
  let sql = `SELECT ${query.select.length > 0 ? query.select.join(", ") : "*"}`;
  sql += ` FROM ${query.from}`;

  if (query.where.length > 0) {
    sql += ` WHERE ${query.where.join(" AND ")}`;
  }

  if (query.orderBy) {
    sql += ` ORDER BY ${query.orderBy.field} ${query.orderBy.direction}`;
  }

  if (query.limit !== null) {
    sql += ` LIMIT ${query.limit}`;
  }

  if (query.offset !== null) {
    sql += ` OFFSET ${query.offset}`;
  }

  return sql;
};

// Compose query building
const buildUserQuery = pipe(
  select("id", "name", "email"),
  from("users"),
  where("age > 18"),
  where("status = 'active'"),
  orderBy("name", "ASC"),
  limit(10),
  offset(20)
);

// Example 2: String Transformations with Composition
// ==================================================

// Pure string transformation functions
const toUpperCase = (s: string): string => s.toUpperCase();
const toLowerCase = (s: string): string => s.toLowerCase();
const trim = (s: string): string => s.trim();
const capitalize = (s: string): string =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

const replace =
  (search: string | RegExp, replacement: string) =>
  (s: string): string =>
    s.replace(search, replacement);

const replaceAll =
  (search: string | RegExp, replacement: string) =>
  (s: string): string =>
    s.replaceAll(search, replacement);

const append =
  (suffix: string) =>
  (s: string): string =>
    s + suffix;

const prepend =
  (prefix: string) =>
  (s: string): string =>
    prefix + s;

const split =
  (separator: string) =>
  (s: string): string[] =>
    s.split(separator);

const join =
  (separator: string) =>
  (arr: string[]): string =>
    arr.join(separator);

// Composed string transformations
const normalizeWhitespace = pipe(
  trim,
  replaceAll(/\s+/g, " ")
);

const toTitleCase = pipeWith(
  split(" "),
  (words: string[]) => words.map(capitalize),
  join(" ")
);

const slugify = pipe(
  toLowerCase,
  trim,
  replaceAll(/\s+/g, "-"),
  replaceAll(/[^a-z0-9-]/g, "")
);

// Example 3: Validation with Composition
// ======================================

type ValidationResult<T> = Readonly<{
  value: T;
  errors: string[];
  isValid: boolean;
}>;

// Create validation result
const createValidation = <T>(value: T): ValidationResult<T> => ({
  value,
  errors: [],
  isValid: true,
});

// Validator combinators
const addError =
  <T>(error: string) =>
  (result: ValidationResult<T>): ValidationResult<T> => ({
    ...result,
    errors: [...result.errors, error],
    isValid: false,
  });

const validateIf =
  <T>(predicate: (value: T) => boolean, error: string) =>
  (result: ValidationResult<T>): ValidationResult<T> =>
    predicate(result.value) ? result : addError<T>(error)(result);

// String validators
const notEmpty = validateIf<string>(
  (s) => s.trim().length > 0,
  "Value must not be empty"
);

const minLength = (min: number) =>
  validateIf<string>(
    (s) => s.length >= min,
    `Value must be at least ${min} characters`
  );

const maxLength = (max: number) =>
  validateIf<string>(
    (s) => s.length <= max,
    `Value must be at most ${max} characters`
  );

const matchesPattern = (pattern: RegExp, message: string) =>
  validateIf<string>((s) => pattern.test(s), message);

// Number validators
const minValue = (min: number) =>
  validateIf<number>((n) => n >= min, `Value must be at least ${min}`);

const maxValue = (max: number) =>
  validateIf<number>((n) => n <= max, `Value must be at most ${max}`);

const isPositive = validateIf<number>((n) => n > 0, "Value must be positive");

const isInteger = validateIf<number>(
  (n) => Number.isInteger(n),
  "Value must be an integer"
);

// Composed validators
const validateEmail = pipe(
  notEmpty,
  minLength(5),
  matchesPattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
);

const validateAge = pipe(minValue(0), maxValue(150), isInteger);

const validatePassword = pipe(
  notEmpty,
  minLength(8),
  maxLength(100),
  matchesPattern(/[A-Z]/, "Must contain uppercase letter"),
  matchesPattern(/[a-z]/, "Must contain lowercase letter"),
  matchesPattern(/[0-9]/, "Must contain number")
);

// Example 4: Data Processing Pipeline
// ===================================

type User = Readonly<{
  id: number;
  name: string;
  email: string;
  age: number;
  active: boolean;
}>;

// Pure array transformation functions
const filterArray =
  <T>(predicate: (item: T) => boolean) =>
  (arr: readonly T[]): T[] =>
    arr.filter(predicate);

const mapArray =
  <T, R>(fn: (item: T) => R) =>
  (arr: readonly T[]): R[] =>
    arr.map(fn);

const sortArray =
  <T>(comparator: (a: T, b: T) => number) =>
  (arr: readonly T[]): T[] =>
    [...arr].sort(comparator);

const takeArray =
  <T>(count: number) =>
  (arr: readonly T[]): T[] =>
    arr.slice(0, count);

const skipArray =
  <T>(count: number) =>
  (arr: readonly T[]): T[] =>
    arr.slice(count);

const reverseArray =
  <T>() =>
  (arr: readonly T[]): T[] =>
    [...arr].reverse();

// User-specific transformations
const activeUsers = filterArray<User>((u) => u.active);
const adults = filterArray<User>((u) => u.age >= 18);
const sortByName = sortArray<User>((a, b) => a.name.localeCompare(b.name));
const sortByAge = sortArray<User>((a, b) => a.age - b.age);
const extractEmails = mapArray<User, string>((u) => u.email);
const extractNames = mapArray<User, string>((u) => u.name);

// Composed data pipelines
const getActiveAdultEmails = pipeWith(
  activeUsers,
  adults,
  sortByName,
  extractEmails
);

const getTop5OldestNames = pipeWith(
  activeUsers,
  sortByAge,
  reverseArray<User>(),
  takeArray<User>(5),
  extractNames
);

// Example 5: Mathematical Composition
// ===================================

// Basic math functions
const add =
  (n: number) =>
  (x: number): number =>
    x + n;

const subtract =
  (n: number) =>
  (x: number): number =>
    x - n;

const multiply =
  (n: number) =>
  (x: number): number =>
    x * n;

const divide =
  (n: number) =>
  (x: number): number =>
    x / n;

const power =
  (n: number) =>
  (x: number): number =>
    Math.pow(x, n);

const negate = (x: number): number => -x;
const abs = (x: number): number => Math.abs(x);
const round = (x: number): number => Math.round(x);
const floor = (x: number): number => Math.floor(x);
const ceil = (x: number): number => Math.ceil(x);

// Composed math operations
const celsiusToFahrenheit = pipe(multiply(9), divide(5), add(32));

const fahrenheitToCelsius = pipe(subtract(32), multiply(5), divide(9));

const percentageOf =
  (total: number) =>
  (part: number): number =>
    pipe(divide(total), multiply(100))(part);

// Example 6: Async Composition
// ============================

// Async pipe
const pipeAsync =
  <T>(...fns: Array<(arg: T) => Promise<T> | T>) =>
  async (x: T): Promise<T> => {
    let result = x;
    for (const fn of fns) {
      result = await fn(result);
    }
    return result;
  };

// Simulated async operations
const fetchUserData = async (userId: string): Promise<User> => {
  // Simulated API call
  return {
    id: parseInt(userId),
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    active: true,
  };
};

const enrichWithProfile = async (user: User): Promise<User & { profile: string }> => {
  // Simulated enrichment
  return { ...user, profile: "Premium" };
};

const formatUserDisplay = (user: User): string => {
  return `${user.name} (${user.email})`;
};

// Demonstration
// =============

function demonstrateFunctionComposition(): void {
  console.log("=== FP Function Composition Demonstration ===\n");

  // Query Builder
  console.log("1. Query Builder with Composition:");
  const query = buildUserQuery(createQuery());
  console.log(buildQuery(query));

  // Alternative: inline composition
  const inlineQuery = pipe(
    select("name", "age"),
    from("employees"),
    where("department = 'IT'"),
    orderBy("age", "DESC"),
    limit(5)
  )(createQuery());
  console.log(buildQuery(inlineQuery));

  // String Transformations
  console.log("\n2. String Transformations:");
  console.log(`normalizeWhitespace("  hello   world  "): "${normalizeWhitespace("  hello   world  ")}"`);
  console.log(`toTitleCase("hello world"): "${toTitleCase("hello world")}"`);
  console.log(`slugify("Hello World! How are you?"): "${slugify("Hello World! How are you?")}"`);

  // Validation
  console.log("\n3. Validation with Composition:");
  const emailResult = validateEmail(createValidation("test@example.com"));
  console.log(`Email validation: ${JSON.stringify(emailResult)}`);

  const badEmailResult = validateEmail(createValidation("invalid"));
  console.log(`Bad email validation: ${JSON.stringify(badEmailResult)}`);

  const passwordResult = validatePassword(createValidation("Abc12345"));
  console.log(`Password validation: ${JSON.stringify(passwordResult)}`);

  const weakPasswordResult = validatePassword(createValidation("weak"));
  console.log(`Weak password validation: ${JSON.stringify(weakPasswordResult)}`);

  // Data Processing
  console.log("\n4. Data Processing Pipeline:");
  const users: User[] = [
    { id: 1, name: "Alice", email: "alice@example.com", age: 30, active: true },
    { id: 2, name: "Bob", email: "bob@example.com", age: 17, active: true },
    { id: 3, name: "Charlie", email: "charlie@example.com", age: 45, active: false },
    { id: 4, name: "Diana", email: "diana@example.com", age: 28, active: true },
    { id: 5, name: "Eve", email: "eve@example.com", age: 55, active: true },
  ];

  console.log(`Active adult emails: ${JSON.stringify(getActiveAdultEmails(users))}`);
  console.log(`Top 5 oldest names: ${JSON.stringify(getTop5OldestNames(users))}`);

  // Math Composition
  console.log("\n5. Mathematical Composition:");
  console.log(`celsiusToFahrenheit(0): ${celsiusToFahrenheit(0)}`);
  console.log(`celsiusToFahrenheit(100): ${celsiusToFahrenheit(100)}`);
  console.log(`fahrenheitToCelsius(32): ${fahrenheitToCelsius(32)}`);
  console.log(`fahrenheitToCelsius(212): ${fahrenheitToCelsius(212)}`);

  const percentage = percentageOf(200);
  console.log(`percentageOf(200)(50): ${percentage(50)}%`);

  // Point-free style examples
  console.log("\n6. Point-Free Style:");
  const numbers = [1, 2, 3, 4, 5];

  // Instead of: numbers.map(x => x * 2)
  const doubled = numbers.map(multiply(2));
  console.log(`Doubled: [${doubled}]`);

  // Composed operations
  const processNumber = pipe(add(10), multiply(2), subtract(5));
  console.log(`processNumber(5) = add(10) -> multiply(2) -> subtract(5) = ${processNumber(5)}`);
}

demonstrateFunctionComposition();

export {
  // Composition utilities
  compose,
  pipe,
  pipeWith,
  pipeAsync,
  // Query builder
  createQuery,
  select,
  from,
  where,
  orderBy,
  limit,
  offset,
  buildQuery,
  buildUserQuery,
  // String transformations
  toUpperCase,
  toLowerCase,
  trim,
  capitalize,
  replace,
  replaceAll,
  append,
  prepend,
  split,
  join,
  normalizeWhitespace,
  toTitleCase,
  slugify,
  // Validation
  createValidation,
  addError,
  validateIf,
  notEmpty,
  minLength,
  maxLength,
  matchesPattern,
  minValue,
  maxValue,
  isPositive,
  isInteger,
  validateEmail,
  validateAge,
  validatePassword,
  // Array operations
  filterArray,
  mapArray,
  sortArray,
  takeArray,
  skipArray,
  reverseArray,
  activeUsers,
  adults,
  sortByName,
  sortByAge,
  extractEmails,
  extractNames,
  getActiveAdultEmails,
  getTop5OldestNames,
  // Math
  add,
  subtract,
  multiply,
  divide,
  power,
  negate,
  abs,
  round,
  floor,
  ceil,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  percentageOf,
  // Async
  fetchUserData,
  enrichWithProfile,
  formatUserDisplay,
};

export type { Query, ValidationResult, User, Fn };

