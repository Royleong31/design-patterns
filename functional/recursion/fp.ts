/**
 * RECURSION - Functional Programming Approach
 *
 * Recursion is a fundamental concept in FP where a function calls itself
 * to solve smaller instances of the same problem.
 *
 * Key concepts:
 * - Base case: The condition that stops recursion
 * - Recursive case: The function calling itself with a smaller problem
 * - Tail recursion: Recursive call is the last operation (can be optimized)
 *
 * Benefits:
 * - No mutable state
 * - Often more elegant and readable
 * - Natural fit for recursive data structures (trees, lists)
 * - Easier to reason about mathematically
 *
 * Note: JavaScript doesn't guarantee tail call optimization (TCO),
 * but we'll show the patterns anyway.
 */

// Example 1: Factorial
// ====================

// Simple recursive factorial
const factorial = (n: number): number => {
  if (n < 0) throw new Error("Factorial not defined for negative numbers");
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
};

// Tail-recursive factorial (with accumulator)
const factorialTailRec = (n: number, acc: number = 1): number => {
  if (n < 0) throw new Error("Factorial not defined for negative numbers");
  if (n === 0 || n === 1) return acc;
  return factorialTailRec(n - 1, n * acc);
};

// Example 2: Fibonacci
// ====================

// Simple recursive fibonacci (inefficient - exponential time)
const fibonacciSimple = (n: number): number => {
  if (n < 0) throw new Error("Fibonacci not defined for negative numbers");
  if (n <= 1) return n;
  return fibonacciSimple(n - 1) + fibonacciSimple(n - 2);
};

// Tail-recursive fibonacci (efficient - linear time)
const fibonacci = (n: number, a: number = 0, b: number = 1): number => {
  if (n < 0) throw new Error("Fibonacci not defined for negative numbers");
  if (n === 0) return a;
  if (n === 1) return b;
  return fibonacci(n - 1, b, a + b);
};

// Generate fibonacci sequence recursively
const fibonacciSequence = (count: number, acc: number[] = []): number[] => {
  if (count <= 0) return acc;
  const n = acc.length;
  const next = n <= 1 ? n : acc[n - 1] + acc[n - 2];
  return fibonacciSequence(count - 1, [...acc, next]);
};

// Example 3: Array Operations (Recursive)
// =======================================

// Recursive sum
const sum = (arr: readonly number[]): number => {
  if (arr.length === 0) return 0;
  const [head, ...tail] = arr;
  return head + sum(tail);
};

// Tail-recursive sum
const sumTailRec = (arr: readonly number[], acc: number = 0): number => {
  if (arr.length === 0) return acc;
  const [head, ...tail] = arr;
  return sumTailRec(tail, acc + head);
};

// Recursive product
const product = (arr: readonly number[]): number => {
  if (arr.length === 0) return 1;
  const [head, ...tail] = arr;
  return head * product(tail);
};

// Recursive max
const max = (arr: readonly number[]): number | undefined => {
  if (arr.length === 0) return undefined;
  if (arr.length === 1) return arr[0];

  const [head, ...tail] = arr;
  const tailMax = max(tail)!;
  return head > tailMax ? head : tailMax;
};

// Recursive min
const min = (arr: readonly number[]): number | undefined => {
  if (arr.length === 0) return undefined;
  if (arr.length === 1) return arr[0];

  const [head, ...tail] = arr;
  const tailMin = min(tail)!;
  return head < tailMin ? head : tailMin;
};

// Recursive length
const length = <T>(arr: readonly T[]): number => {
  if (arr.length === 0) return 0;
  const [, ...tail] = arr;
  return 1 + length(tail);
};

// Recursive reverse
const reverse = <T>(arr: readonly T[]): T[] => {
  if (arr.length === 0) return [];
  const [head, ...tail] = arr;
  return [...reverse(tail), head];
};

// Recursive map
const map = <T, R>(arr: readonly T[], fn: (item: T) => R): R[] => {
  if (arr.length === 0) return [];
  const [head, ...tail] = arr;
  return [fn(head), ...map(tail, fn)];
};

// Recursive filter
const filter = <T>(arr: readonly T[], predicate: (item: T) => boolean): T[] => {
  if (arr.length === 0) return [];
  const [head, ...tail] = arr;
  const filteredTail = filter(tail, predicate);
  return predicate(head) ? [head, ...filteredTail] : filteredTail;
};

// Recursive reduce
const reduce = <T, R>(
  arr: readonly T[],
  reducer: (acc: R, item: T) => R,
  initial: R
): R => {
  if (arr.length === 0) return initial;
  const [head, ...tail] = arr;
  return reduce(tail, reducer, reducer(initial, head));
};

// Recursive flatten
const flatten = (arr: unknown[]): unknown[] => {
  if (arr.length === 0) return [];
  const [head, ...tail] = arr;

  if (Array.isArray(head)) {
    return [...flatten(head), ...flatten(tail)];
  }

  return [head, ...flatten(tail)];
};

// Recursive take
const take = <T>(arr: readonly T[], n: number): T[] => {
  if (n <= 0 || arr.length === 0) return [];
  const [head, ...tail] = arr;
  return [head, ...take(tail, n - 1)];
};

// Recursive drop
const drop = <T>(arr: readonly T[], n: number): T[] => {
  if (n <= 0) return [...arr];
  if (arr.length === 0) return [];
  const [, ...tail] = arr;
  return drop(tail, n - 1);
};

// Recursive find
const find = <T>(arr: readonly T[], predicate: (item: T) => boolean): T | undefined => {
  if (arr.length === 0) return undefined;
  const [head, ...tail] = arr;
  return predicate(head) ? head : find(tail, predicate);
};

// Recursive some
const some = <T>(arr: readonly T[], predicate: (item: T) => boolean): boolean => {
  if (arr.length === 0) return false;
  const [head, ...tail] = arr;
  return predicate(head) || some(tail, predicate);
};

// Recursive every
const every = <T>(arr: readonly T[], predicate: (item: T) => boolean): boolean => {
  if (arr.length === 0) return true;
  const [head, ...tail] = arr;
  return predicate(head) && every(tail, predicate);
};

// Example 4: Tree Operations (Recursive)
// ======================================

type TreeNode = Readonly<{
  value: number;
  left?: TreeNode;
  right?: TreeNode;
}>;

// Recursive depth-first traversal (pre-order)
const depthFirstValues = (node: TreeNode | undefined): number[] => {
  if (!node) return [];
  return [node.value, ...depthFirstValues(node.left), ...depthFirstValues(node.right)];
};

// In-order traversal
const inOrderValues = (node: TreeNode | undefined): number[] => {
  if (!node) return [];
  return [...inOrderValues(node.left), node.value, ...inOrderValues(node.right)];
};

// Post-order traversal
const postOrderValues = (node: TreeNode | undefined): number[] => {
  if (!node) return [];
  return [...postOrderValues(node.left), ...postOrderValues(node.right), node.value];
};

// Recursive tree sum
const treeSum = (node: TreeNode | undefined): number => {
  if (!node) return 0;
  return node.value + treeSum(node.left) + treeSum(node.right);
};

// Recursive tree contains
const treeContains = (node: TreeNode | undefined, target: number): boolean => {
  if (!node) return false;
  if (node.value === target) return true;
  return treeContains(node.left, target) || treeContains(node.right, target);
};

// Recursive tree height
const treeHeight = (node: TreeNode | undefined): number => {
  if (!node) return 0;
  return 1 + Math.max(treeHeight(node.left), treeHeight(node.right));
};

// Recursive tree node count
const treeNodeCount = (node: TreeNode | undefined): number => {
  if (!node) return 0;
  return 1 + treeNodeCount(node.left) + treeNodeCount(node.right);
};

// Recursive tree leaf count
const treeLeafCount = (node: TreeNode | undefined): number => {
  if (!node) return 0;
  if (!node.left && !node.right) return 1;
  return treeLeafCount(node.left) + treeLeafCount(node.right);
};

// Recursive tree max value
const treeMax = (node: TreeNode | undefined): number | undefined => {
  if (!node) return undefined;

  const leftMax = treeMax(node.left);
  const rightMax = treeMax(node.right);

  let maxVal = node.value;
  if (leftMax !== undefined && leftMax > maxVal) maxVal = leftMax;
  if (rightMax !== undefined && rightMax > maxVal) maxVal = rightMax;

  return maxVal;
};

// Recursive tree map
const treeMap = (
  node: TreeNode | undefined,
  fn: (value: number) => number
): TreeNode | undefined => {
  if (!node) return undefined;
  return {
    value: fn(node.value),
    left: treeMap(node.left, fn),
    right: treeMap(node.right, fn),
  };
};

// Example 5: String Operations (Recursive)
// ========================================

// Recursive string reverse
const reverseString = (str: string): string => {
  if (str.length <= 1) return str;
  return reverseString(str.slice(1)) + str[0];
};

// Recursive palindrome check
const isPalindrome = (str: string): boolean => {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (cleaned.length <= 1) return true;
  if (cleaned[0] !== cleaned[cleaned.length - 1]) return false;
  return isPalindrome(cleaned.slice(1, -1));
};

// Recursive count occurrences
const countOccurrences = (str: string, char: string): number => {
  if (str.length === 0) return 0;
  const count = str[0] === char ? 1 : 0;
  return count + countOccurrences(str.slice(1), char);
};

// Example 6: Graph Operations (Recursive)
// =======================================

type Graph = ReadonlyMap<string, readonly string[]>;

// Recursive depth-first traversal
const graphDFS = (
  graph: Graph,
  node: string,
  visited: Set<string> = new Set()
): string[] => {
  if (visited.has(node)) return [];
  visited.add(node);

  const neighbors = graph.get(node) || [];
  const result: string[] = [node];

  for (const neighbor of neighbors) {
    result.push(...graphDFS(graph, neighbor, visited));
  }

  return result;
};

// Recursive path finding
const findPath = (
  graph: Graph,
  start: string,
  end: string,
  visited: Set<string> = new Set()
): string[] | null => {
  if (start === end) return [start];
  if (visited.has(start)) return null;

  visited.add(start);
  const neighbors = graph.get(start) || [];

  for (const neighbor of neighbors) {
    const path = findPath(graph, neighbor, end, visited);
    if (path) return [start, ...path];
  }

  return null;
};

// Recursive all paths finding
const findAllPaths = (
  graph: Graph,
  start: string,
  end: string,
  currentPath: string[] = []
): string[][] => {
  const newPath = [...currentPath, start];

  if (start === end) return [newPath];

  const neighbors = graph.get(start) || [];
  const allPaths: string[][] = [];

  for (const neighbor of neighbors) {
    if (!currentPath.includes(neighbor)) {
      allPaths.push(...findAllPaths(graph, neighbor, end, newPath));
    }
  }

  return allPaths;
};

// Example 7: Mathematical Operations (Recursive)
// ==============================================

// Recursive power
const power = (base: number, exp: number): number => {
  if (exp === 0) return 1;
  if (exp < 0) return 1 / power(base, -exp);
  return base * power(base, exp - 1);
};

// Recursive GCD (Euclidean algorithm)
const gcd = (a: number, b: number): number => {
  a = Math.abs(a);
  b = Math.abs(b);
  if (b === 0) return a;
  return gcd(b, a % b);
};

// Recursive LCM
const lcm = (a: number, b: number): number => Math.abs(a * b) / gcd(a, b);

// Recursive is prime check
const isPrimeHelper = (n: number, divisor: number): boolean => {
  if (divisor > Math.sqrt(n)) return true;
  if (n % divisor === 0) return false;
  return isPrimeHelper(n, divisor + 1);
};

const isPrime = (n: number): boolean => {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  return isPrimeHelper(n, 3);
};

// Recursive sum of digits
const sumOfDigits = (n: number): number => {
  n = Math.abs(n);
  if (n < 10) return n;
  return (n % 10) + sumOfDigits(Math.floor(n / 10));
};

// Recursive digit count
const digitCount = (n: number): number => {
  n = Math.abs(n);
  if (n < 10) return 1;
  return 1 + digitCount(Math.floor(n / 10));
};

// Example 8: Combinatorics (Recursive)
// ====================================

// Recursive permutations
const permutations = <T>(arr: readonly T[]): T[][] => {
  if (arr.length <= 1) return [[...arr]];

  const result: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
    const perms = permutations(remaining);
    for (const perm of perms) {
      result.push([current, ...perm]);
    }
  }

  return result;
};

// Recursive combinations
const combinations = <T>(arr: readonly T[], k: number): T[][] => {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  if (arr.length === k) return [[...arr]];

  const [head, ...tail] = arr;

  // Combinations including head + combinations excluding head
  const withHead = combinations(tail, k - 1).map((combo) => [head, ...combo]);
  const withoutHead = combinations(tail, k);

  return [...withHead, ...withoutHead];
};

// Recursive subsets (power set)
const subsets = <T>(arr: readonly T[]): T[][] => {
  if (arr.length === 0) return [[]];

  const [head, ...tail] = arr;
  const tailSubsets = subsets(tail);

  return [...tailSubsets, ...tailSubsets.map((subset) => [head, ...subset])];
};

// Demonstration
// =============

function demonstrateRecursion(): void {
  console.log("=== FP Recursion Demonstration ===\n");

  // Factorial
  console.log("1. Recursive Factorial:");
  console.log(`factorial(5) = ${factorial(5)}`);
  console.log(`factorialTailRec(10) = ${factorialTailRec(10)}`);

  // Fibonacci
  console.log("\n2. Recursive Fibonacci:");
  console.log(`fibonacci(10) = ${fibonacci(10)}`);
  console.log(`fibonacciSequence(10): [${fibonacciSequence(10)}]`);

  // Array Operations
  console.log("\n3. Recursive Array Operations:");
  const numbers = [1, 2, 3, 4, 5];
  console.log(`sum([${numbers}]) = ${sum(numbers)}`);
  console.log(`product([${numbers}]) = ${product(numbers)}`);
  console.log(`max([${numbers}]) = ${max(numbers)}`);
  console.log(`reverse([${numbers}]) = [${reverse(numbers)}]`);
  console.log(`map(double): [${map(numbers, (x) => x * 2)}]`);
  console.log(`filter(even): [${filter(numbers, (x) => x % 2 === 0)}]`);

  const nested = [1, [2, 3], [4, [5, 6]]];
  console.log(`flatten(${JSON.stringify(nested)}) = [${flatten(nested)}]`);

  // Tree Operations
  console.log("\n4. Recursive Tree Operations:");
  const tree: TreeNode = {
    value: 1,
    left: {
      value: 2,
      left: { value: 4 },
      right: { value: 5 },
    },
    right: {
      value: 3,
      left: { value: 6 },
      right: { value: 7 },
    },
  };

  console.log(`DFS (pre-order): [${depthFirstValues(tree)}]`);
  console.log(`In-order: [${inOrderValues(tree)}]`);
  console.log(`Post-order: [${postOrderValues(tree)}]`);
  console.log(`treeSum: ${treeSum(tree)}`);
  console.log(`treeHeight: ${treeHeight(tree)}`);
  console.log(`treeContains(5): ${treeContains(tree, 5)}`);
  console.log(`treeContains(10): ${treeContains(tree, 10)}`);
  console.log(`treeMax: ${treeMax(tree)}`);
  console.log(`treeLeafCount: ${treeLeafCount(tree)}`);

  // String Operations
  console.log("\n5. Recursive String Operations:");
  console.log(`reverseString("hello") = "${reverseString("hello")}"`);
  console.log(`isPalindrome("racecar") = ${isPalindrome("racecar")}`);
  console.log(`isPalindrome("hello") = ${isPalindrome("hello")}`);
  console.log(`countOccurrences("mississippi", "s") = ${countOccurrences("mississippi", "s")}`);

  // Graph Operations
  console.log("\n6. Recursive Graph Operations:");
  const graph: Graph = new Map([
    ["A", ["B", "C"]],
    ["B", ["D", "E"]],
    ["C", ["F"]],
    ["D", []],
    ["E", ["F"]],
    ["F", []],
  ]);

  console.log(`DFS from A: [${graphDFS(graph, "A")}]`);
  console.log(`Path A->F: [${findPath(graph, "A", "F")}]`);
  console.log(`All paths A->F: ${JSON.stringify(findAllPaths(graph, "A", "F"))}`);

  // Math Operations
  console.log("\n7. Recursive Math Operations:");
  console.log(`power(2, 10) = ${power(2, 10)}`);
  console.log(`gcd(48, 18) = ${gcd(48, 18)}`);
  console.log(`lcm(4, 6) = ${lcm(4, 6)}`);
  console.log(`isPrime(17) = ${isPrime(17)}`);
  console.log(`isPrime(18) = ${isPrime(18)}`);
  console.log(`sumOfDigits(12345) = ${sumOfDigits(12345)}`);
  console.log(`digitCount(12345) = ${digitCount(12345)}`);

  // Combinatorics
  console.log("\n8. Recursive Combinatorics:");
  console.log(`permutations([1,2,3]): ${JSON.stringify(permutations([1, 2, 3]))}`);
  console.log(`combinations([1,2,3,4], 2): ${JSON.stringify(combinations([1, 2, 3, 4], 2))}`);
  console.log(`subsets([1,2,3]): ${JSON.stringify(subsets([1, 2, 3]))}`);
}

demonstrateRecursion();

export {
  // Factorial
  factorial,
  factorialTailRec,
  // Fibonacci
  fibonacciSimple,
  fibonacci,
  fibonacciSequence,
  // Array operations
  sum,
  sumTailRec,
  product,
  max,
  min,
  length,
  reverse,
  map,
  filter,
  reduce,
  flatten,
  take,
  drop,
  find,
  some,
  every,
  // Tree operations
  depthFirstValues,
  inOrderValues,
  postOrderValues,
  treeSum,
  treeContains,
  treeHeight,
  treeNodeCount,
  treeLeafCount,
  treeMax,
  treeMap,
  // String operations
  reverseString,
  isPalindrome,
  countOccurrences,
  // Graph operations
  graphDFS,
  findPath,
  findAllPaths,
  // Math operations
  power,
  gcd,
  lcm,
  isPrime,
  sumOfDigits,
  digitCount,
  // Combinatorics
  permutations,
  combinations,
  subsets,
};

export type { TreeNode, Graph };

