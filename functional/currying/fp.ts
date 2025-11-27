/**
 * CURRYING - Functional Programming Approach
 *
 * Currying is the technique of transforming a function with multiple arguments
 * into a sequence of functions, each taking a single argument.
 *
 * f(a, b, c) becomes f(a)(b)(c)
 *
 * Benefits of currying:
 * - Create specialized functions from general ones
 * - Enable partial application naturally
 * - Facilitate function composition
 * - Improve code reuse
 * - Enable point-free programming style
 */

// Basic Currying Examples
// =======================

// Non-curried function
const addNonCurried = (a: number, b: number, c: number): number => a + b + c;

// Curried version - each call returns a new function
const addCurried =
  (a: number) =>
  (b: number) =>
  (c: number): number =>
    a + b + c;

// Generic curry utility for 2-argument functions
const curry2 =
  <A, B, R>(fn: (a: A, b: B) => R) =>
  (a: A) =>
  (b: B): R =>
    fn(a, b);

// Generic curry utility for 3-argument functions
const curry3 =
  <A, B, C, R>(fn: (a: A, b: B, c: C) => R) =>
  (a: A) =>
  (b: B) =>
  (c: C): R =>
    fn(a, b, c);

// Example 1: Curried Math Operations
// ==================================

const add = (a: number) => (b: number): number => a + b;
const subtract = (a: number) => (b: number): number => b - a;
const multiply = (a: number) => (b: number): number => a * b;
const divide = (a: number) => (b: number): number => b / a;
const power = (exp: number) => (base: number): number => Math.pow(base, exp);
const modulo = (divisor: number) => (n: number): number => n % divisor;

// Specialized functions created through currying
const add10 = add(10);
const double = multiply(2);
const triple = multiply(3);
const square = power(2);
const cube = power(3);
const isEven = (n: number): boolean => modulo(2)(n) === 0;
const isOdd = (n: number): boolean => modulo(2)(n) !== 0;

// Example 2: Curried String Operations
// ====================================

const concat = (a: string) => (b: string): string => a + b;
const split = (separator: string) => (str: string): string[] => str.split(separator);
const join = (separator: string) => (arr: string[]): string => arr.join(separator);
const replace = (search: string) => (replacement: string) => (str: string): string =>
  str.replace(search, replacement);
const replaceAll = (search: string) => (replacement: string) => (str: string): string =>
  str.replaceAll(search, replacement);
const padStart = (length: number) => (char: string) => (str: string): string =>
  str.padStart(length, char);
const padEnd = (length: number) => (char: string) => (str: string): string =>
  str.padEnd(length, char);
const slice = (start: number) => (end: number) => (str: string): string =>
  str.slice(start, end);

// Specialized string functions
const addPrefix = concat;
const addSuffix = (suffix: string) => (str: string): string => str + suffix;
const splitByComma = split(",");
const splitBySpace = split(" ");
const joinWithComma = join(", ");
const joinWithSpace = join(" ");
const padTo10 = padStart(10)("0");

// Example 3: Curried Array Operations
// ===================================

const map =
  <A, B>(fn: (item: A) => B) =>
  (arr: readonly A[]): B[] =>
    arr.map(fn);

const filter =
  <A>(predicate: (item: A) => boolean) =>
  (arr: readonly A[]): A[] =>
    arr.filter(predicate);

const reduce =
  <A, B>(reducer: (acc: B, item: A) => B) =>
  (initial: B) =>
  (arr: readonly A[]): B =>
    arr.reduce(reducer, initial);

const find =
  <A>(predicate: (item: A) => boolean) =>
  (arr: readonly A[]): A | undefined =>
    arr.find(predicate);

const some =
  <A>(predicate: (item: A) => boolean) =>
  (arr: readonly A[]): boolean =>
    arr.some(predicate);

const every =
  <A>(predicate: (item: A) => boolean) =>
  (arr: readonly A[]): boolean =>
    arr.every(predicate);

const take =
  <A>(count: number) =>
  (arr: readonly A[]): A[] =>
    arr.slice(0, count);

const drop =
  <A>(count: number) =>
  (arr: readonly A[]): A[] =>
    arr.slice(count);

const sortBy =
  <A, B>(fn: (item: A) => B) =>
  (arr: readonly A[]): A[] =>
    [...arr].sort((a, b) => {
      const aVal = fn(a);
      const bVal = fn(b);
      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
      return 0;
    });

// Specialized array functions
const doubleAll = map(double);
const squareAll = map(square);
const filterEven = filter(isEven);
const filterOdd = filter(isOdd);
const sum = reduce<number, number>((acc, n) => acc + n)(0);
const product = reduce<number, number>((acc, n) => acc * n)(1);
const take5 = take(5);
const drop3 = drop(3);

// Example 4: Curried Comparison and Predicates
// ============================================

const equals =
  <A>(a: A) =>
  (b: A): boolean =>
    a === b;

const greaterThan = (threshold: number) => (n: number): boolean => n > threshold;
const lessThan = (threshold: number) => (n: number): boolean => n < threshold;
const greaterOrEqual = (threshold: number) => (n: number): boolean => n >= threshold;
const lessOrEqual = (threshold: number) => (n: number): boolean => n <= threshold;
const between = (min: number) => (max: number) => (n: number): boolean =>
  n >= min && n <= max;

const hasProperty =
  <K extends string>(key: K) =>
  <T extends Record<string, unknown>>(obj: T): boolean =>
    key in obj;

const propEquals =
  <K extends string>(key: K) =>
  <V>(value: V) =>
  <T extends Record<K, V>>(obj: T): boolean =>
    obj[key] === value;

// Specialized predicates
const isPositive = greaterThan(0);
const isNegative = lessThan(0);
const isAdult = greaterOrEqual(18);
const isValidPercentage = between(0)(100);

// Example 5: Curried Object Operations
// ====================================

const prop =
  <K extends string>(key: K) =>
  <T extends Record<K, unknown>>(obj: T): T[K] =>
    obj[key];

const setProp =
  <K extends string>(key: K) =>
  <V>(value: V) =>
  <T extends Record<string, unknown>>(obj: T): T & Record<K, V> => ({
    ...obj,
    [key]: value,
  });

const pick =
  <K extends string>(...keys: K[]) =>
  <T extends Record<K, unknown>>(obj: T): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
      if (key in obj) {
        result[key] = obj[key];
      }
    }
    return result;
  };

const omit =
  <K extends string>(...keys: K[]) =>
  <T extends Record<string, unknown>>(obj: T): Omit<T, K> => {
    const result = { ...obj };
    for (const key of keys) {
      delete (result as Record<string, unknown>)[key];
    }
    return result as Omit<T, K>;
  };

// Example 6: Curried Formatting Functions
// =======================================

const formatCurrency =
  (currency: string) =>
  (decimals: number) =>
  (amount: number): string =>
    `${currency}${amount.toFixed(decimals)}`;

const formatDate =
  (locale: string) =>
  (options: Intl.DateTimeFormatOptions) =>
  (date: Date): string =>
    date.toLocaleDateString(locale, options);

const formatNumber =
  (locale: string) =>
  (options: Intl.NumberFormatOptions) =>
  (n: number): string =>
    n.toLocaleString(locale, options);

// Specialized formatters
const formatUSD = formatCurrency("$")(2);
const formatEUR = formatCurrency("€")(2);
const formatPercent = (n: number): string => `${(n * 100).toFixed(1)}%`;

const formatUSDate = formatDate("en-US")({ year: "numeric", month: "long", day: "numeric" });
const formatISODate = (date: Date): string => date.toISOString().split("T")[0];

// Example 7: Curried Validation
// =============================

type Validator<T> = (value: T) => string | null;

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
  (pattern: RegExp) =>
  (message: string): Validator<string> =>
  (value) =>
    !pattern.test(value) ? message : null;

const minNum =
  (min: number): Validator<number> =>
  (value) =>
    value < min ? `Must be at least ${min}` : null;

const maxNum =
  (max: number): Validator<number> =>
  (value) =>
    value > max ? `Must be at most ${max}` : null;

// Combine validators
const combineValidators =
  <T>(...validators: Array<Validator<T>>) =>
  (value: T): string[] =>
    validators.map((v) => v(value)).filter((error): error is string => error !== null);

// Specialized validators
const validateEmail = combineValidators(
  required,
  minLength(5),
  matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)("Invalid email format")
);

const validatePassword = combineValidators(
  required,
  minLength(8),
  maxLength(100),
  matches(/[A-Z]/)("Must contain uppercase letter"),
  matches(/[a-z]/)("Must contain lowercase letter"),
  matches(/[0-9]/)("Must contain number")
);

// Example 8: Curried Logger
// =========================

type LogLevel = "debug" | "info" | "warn" | "error";

const createLogger =
  (prefix: string) =>
  (includeTimestamp: boolean) =>
  (level: LogLevel) =>
  (message: string): void => {
    let formatted = "";
    if (includeTimestamp) {
      formatted += `[${new Date().toISOString()}] `;
    }
    if (prefix) {
      formatted += `[${prefix}] `;
    }
    formatted += `${level.toUpperCase()}: ${message}`;

    switch (level) {
      case "debug":
        console.debug(formatted);
        break;
      case "info":
        console.info(formatted);
        break;
      case "warn":
        console.warn(formatted);
        break;
      case "error":
        console.error(formatted);
        break;
    }
  };

// Specialized loggers through currying
const appLogger = createLogger("APP")(true);
const appDebug = appLogger("debug");
const appInfo = appLogger("info");
const appWarn = appLogger("warn");
const appError = appLogger("error");

const simpleLogger = createLogger("")(false);
const simpleInfo = simpleLogger("info");

// Example 9: Curried HTTP Request Builder (Functional)
// ====================================================

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type RequestConfig = Readonly<{
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  body?: unknown;
}>;

const createRequest =
  (method: HttpMethod) =>
  (url: string) =>
  (headers: Record<string, string>) =>
  (body?: unknown): RequestConfig => ({
    method,
    url,
    headers,
    body,
  });

// Specialized request creators
const get = createRequest("GET");
const post = createRequest("POST");
const put = createRequest("PUT");
const del = createRequest("DELETE");

// Further specialization
const getJson = (url: string) => get(url)({ Accept: "application/json" })();
const postJson = (url: string) => (data: unknown) =>
  post(url)({ "Content-Type": "application/json" })(data);

// Demonstration
// =============

function demonstrateCurrying(): void {
  console.log("=== FP Currying Demonstration ===\n");

  // Basic currying
  console.log("1. Basic Currying:");
  console.log(`addCurried(1)(2)(3) = ${addCurried(1)(2)(3)}`);
  console.log(`add10(5) = ${add10(5)}`);
  console.log(`double(7) = ${double(7)}`);
  console.log(`square(4) = ${square(4)}`);

  // Array operations
  console.log("\n2. Curried Array Operations:");
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  console.log(`Original: [${numbers}]`);
  console.log(`doubleAll: [${doubleAll(numbers)}]`);
  console.log(`filterEven: [${filterEven(numbers)}]`);
  console.log(`sum: ${sum(numbers)}`);

  // Chaining curried functions
  const processNumbers = (nums: number[]) =>
    sum(doubleAll(filterEven(nums)));
  console.log(`sum(doubleAll(filterEven(numbers))): ${processNumbers(numbers)}`);

  // String operations
  console.log("\n3. Curried String Operations:");
  const words = "hello,world,foo,bar";
  console.log(`Original: "${words}"`);
  console.log(`splitByComma: [${splitByComma(words)}]`);
  console.log(`joinWithSpace(splitByComma(...)): "${joinWithSpace(splitByComma(words))}"`);
  console.log(`padTo10("42"): "${padTo10("42")}"`);

  // Predicates
  console.log("\n4. Curried Predicates:");
  console.log(`isPositive(5): ${isPositive(5)}`);
  console.log(`isPositive(-3): ${isPositive(-3)}`);
  console.log(`isAdult(21): ${isAdult(21)}`);
  console.log(`isAdult(15): ${isAdult(15)}`);
  console.log(`isValidPercentage(50): ${isValidPercentage(50)}`);
  console.log(`isValidPercentage(150): ${isValidPercentage(150)}`);

  // Formatting
  console.log("\n5. Curried Formatters:");
  console.log(`formatUSD(1234.567): ${formatUSD(1234.567)}`);
  console.log(`formatEUR(1234.567): ${formatEUR(1234.567)}`);
  console.log(`formatPercent(0.756): ${formatPercent(0.756)}`);
  console.log(`formatUSDate(new Date()): ${formatUSDate(new Date())}`);

  // Validation
  console.log("\n6. Curried Validation:");
  console.log(`validateEmail("test@example.com"): [${validateEmail("test@example.com")}]`);
  console.log(`validateEmail("invalid"): [${validateEmail("invalid")}]`);
  console.log(`validatePassword("Abc12345"): [${validatePassword("Abc12345")}]`);
  console.log(`validatePassword("weak"): [${validatePassword("weak")}]`);

  // Logger
  console.log("\n7. Curried Logger:");
  appDebug("This is a debug message");
  appInfo("This is an info message");
  appWarn("This is a warning");
  appError("This is an error");
  simpleInfo("Simple info without prefix or timestamp");

  // HTTP Requests
  console.log("\n8. Curried HTTP Request Builder:");
  const getUsersRequest = getJson("https://api.example.com/users");
  console.log("GET users request:", getUsersRequest);

  const createUserRequest = postJson("https://api.example.com/users")({
    name: "John",
    email: "john@example.com",
  });
  console.log("POST user request:", createUserRequest);

  // Object operations
  console.log("\n9. Curried Object Operations:");
  const user = { name: "Alice", age: 30, email: "alice@example.com" };
  console.log(`Original: ${JSON.stringify(user)}`);
  console.log(`prop("name")(user): ${prop("name")(user)}`);
  console.log(`setProp("age")(31)(user): ${JSON.stringify(setProp("age")(31)(user))}`);
  console.log(`pick("name", "email")(user): ${JSON.stringify(pick("name", "email")(user))}`);
  console.log(`omit("email")(user): ${JSON.stringify(omit("email")(user))}`);
}

demonstrateCurrying();

export {
  // Curry utilities
  curry2,
  curry3,
  // Math
  add,
  subtract,
  multiply,
  divide,
  power,
  modulo,
  add10,
  double,
  triple,
  square,
  cube,
  isEven,
  isOdd,
  // String
  concat,
  split,
  join,
  replace,
  replaceAll,
  padStart,
  padEnd,
  slice,
  addPrefix,
  addSuffix,
  splitByComma,
  splitBySpace,
  joinWithComma,
  joinWithSpace,
  padTo10,
  // Array
  map,
  filter,
  reduce,
  find,
  some,
  every,
  take,
  drop,
  sortBy,
  doubleAll,
  squareAll,
  filterEven,
  filterOdd,
  sum,
  product,
  take5,
  drop3,
  // Predicates
  equals,
  greaterThan,
  lessThan,
  greaterOrEqual,
  lessOrEqual,
  between,
  hasProperty,
  propEquals,
  isPositive,
  isNegative,
  isAdult,
  isValidPercentage,
  // Object
  prop,
  setProp,
  pick,
  omit,
  // Formatting
  formatCurrency,
  formatDate,
  formatNumber,
  formatUSD,
  formatEUR,
  formatPercent,
  formatUSDate,
  formatISODate,
  // Validation
  required,
  minLength,
  maxLength,
  matches,
  minNum,
  maxNum,
  combineValidators,
  validateEmail,
  validatePassword,
  // Logger
  createLogger,
  appLogger,
  appDebug,
  appInfo,
  appWarn,
  appError,
  simpleLogger,
  simpleInfo,
  // HTTP
  createRequest,
  get,
  post,
  put,
  del,
  getJson,
  postJson,
};

export type { Validator, LogLevel, HttpMethod, RequestConfig };

