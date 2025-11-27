/**
 * RECURSION - OOP Approach (Loops with Mutable State)
 *
 * In traditional OOP, iteration is typically done using:
 * - for loops with mutable counters
 * - while loops with mutable conditions
 * - forEach with side effects
 * - Iterators with mutable state
 *
 * This approach:
 * - Relies on mutable variables
 * - Has explicit control flow
 * - Can be more performant (no call stack overhead)
 * - Is familiar to most programmers
 */

// Example 1: Factorial with Loop
// ==============================

class FactorialCalculator {
  // Using a for loop with mutable accumulator
  calculate(n: number): number {
    if (n < 0) throw new Error("Factorial not defined for negative numbers");
    if (n === 0 || n === 1) return 1;

    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  // Using a while loop
  calculateWithWhile(n: number): number {
    if (n < 0) throw new Error("Factorial not defined for negative numbers");

    let result = 1;
    let i = n;
    while (i > 1) {
      result *= i;
      i--;
    }
    return result;
  }
}

// Example 2: Fibonacci with Loop
// ==============================

class FibonacciCalculator {
  // Iterative approach with mutable variables
  calculate(n: number): number {
    if (n < 0) throw new Error("Fibonacci not defined for negative numbers");
    if (n <= 1) return n;

    let prev = 0;
    let curr = 1;

    for (let i = 2; i <= n; i++) {
      const next = prev + curr;
      prev = curr;
      curr = next;
    }

    return curr;
  }

  // Generate sequence
  generateSequence(count: number): number[] {
    const sequence: number[] = [];

    if (count <= 0) return sequence;

    let prev = 0;
    let curr = 1;

    for (let i = 0; i < count; i++) {
      if (i === 0) {
        sequence.push(0);
      } else if (i === 1) {
        sequence.push(1);
      } else {
        const next = prev + curr;
        prev = curr;
        curr = next;
        sequence.push(curr);
      }
    }

    return sequence;
  }
}

// Example 3: Array Operations with Loops
// ======================================

class ArrayProcessor {
  // Sum with for loop
  sum(arr: number[]): number {
    let total = 0;
    for (let i = 0; i < arr.length; i++) {
      total += arr[i];
    }
    return total;
  }

  // Product with for loop
  product(arr: number[]): number {
    let result = 1;
    for (const num of arr) {
      result *= num;
    }
    return result;
  }

  // Find max with loop
  max(arr: number[]): number | undefined {
    if (arr.length === 0) return undefined;

    let maxVal = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > maxVal) {
        maxVal = arr[i];
      }
    }
    return maxVal;
  }

  // Find min with loop
  min(arr: number[]): number | undefined {
    if (arr.length === 0) return undefined;

    let minVal = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < minVal) {
        minVal = arr[i];
      }
    }
    return minVal;
  }

  // Reverse with loop (mutating)
  reverse(arr: number[]): number[] {
    const result: number[] = [];
    for (let i = arr.length - 1; i >= 0; i--) {
      result.push(arr[i]);
    }
    return result;
  }

  // Flatten nested arrays with loop
  flatten(arr: unknown[]): unknown[] {
    const result: unknown[] = [];
    const stack = [...arr];

    while (stack.length > 0) {
      const item = stack.pop();
      if (Array.isArray(item)) {
        stack.push(...item);
      } else {
        result.unshift(item);
      }
    }

    return result;
  }

  // Map with for loop
  map<T, R>(arr: T[], fn: (item: T) => R): R[] {
    const result: R[] = [];
    for (const item of arr) {
      result.push(fn(item));
    }
    return result;
  }

  // Filter with for loop
  filter<T>(arr: T[], predicate: (item: T) => boolean): T[] {
    const result: T[] = [];
    for (const item of arr) {
      if (predicate(item)) {
        result.push(item);
      }
    }
    return result;
  }

  // Reduce with for loop
  reduce<T, R>(arr: T[], reducer: (acc: R, item: T) => R, initial: R): R {
    let accumulator = initial;
    for (const item of arr) {
      accumulator = reducer(accumulator, item);
    }
    return accumulator;
  }
}

// Example 4: Tree Traversal with Stack (Iterative)
// ================================================

interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
}

class BinaryTreeProcessor {
  // Depth-first traversal using stack (iterative)
  depthFirstValues(root: TreeNode | undefined): number[] {
    if (!root) return [];

    const result: number[] = [];
    const stack: TreeNode[] = [root];

    while (stack.length > 0) {
      const current = stack.pop()!;
      result.push(current.value);

      // Push right first so left is processed first
      if (current.right) stack.push(current.right);
      if (current.left) stack.push(current.left);
    }

    return result;
  }

  // Breadth-first traversal using queue (iterative)
  breadthFirstValues(root: TreeNode | undefined): number[] {
    if (!root) return [];

    const result: number[] = [];
    const queue: TreeNode[] = [root];

    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current.value);

      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }

    return result;
  }

  // Find value using stack (iterative)
  contains(root: TreeNode | undefined, target: number): boolean {
    if (!root) return false;

    const stack: TreeNode[] = [root];

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (current.value === target) return true;

      if (current.right) stack.push(current.right);
      if (current.left) stack.push(current.left);
    }

    return false;
  }

  // Sum all values using stack (iterative)
  sumValues(root: TreeNode | undefined): number {
    if (!root) return 0;

    let sum = 0;
    const stack: TreeNode[] = [root];

    while (stack.length > 0) {
      const current = stack.pop()!;
      sum += current.value;

      if (current.right) stack.push(current.right);
      if (current.left) stack.push(current.left);
    }

    return sum;
  }

  // Count nodes using stack (iterative)
  countNodes(root: TreeNode | undefined): number {
    if (!root) return 0;

    let count = 0;
    const stack: TreeNode[] = [root];

    while (stack.length > 0) {
      const current = stack.pop()!;
      count++;

      if (current.right) stack.push(current.right);
      if (current.left) stack.push(current.left);
    }

    return count;
  }
}

// Example 5: String Operations with Loops
// =======================================

class StringProcessor {
  // Reverse string with loop
  reverse(str: string): string {
    let result = "";
    for (let i = str.length - 1; i >= 0; i--) {
      result += str[i];
    }
    return result;
  }

  // Check palindrome with loop
  isPalindrome(str: string): boolean {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
    let left = 0;
    let right = cleaned.length - 1;

    while (left < right) {
      if (cleaned[left] !== cleaned[right]) {
        return false;
      }
      left++;
      right--;
    }

    return true;
  }

  // Count occurrences with loop
  countOccurrences(str: string, char: string): number {
    let count = 0;
    for (const c of str) {
      if (c === char) {
        count++;
      }
    }
    return count;
  }

  // Find all indices with loop
  findAllIndices(str: string, substr: string): number[] {
    const indices: number[] = [];
    let index = str.indexOf(substr);

    while (index !== -1) {
      indices.push(index);
      index = str.indexOf(substr, index + 1);
    }

    return indices;
  }
}

// Example 6: Graph Traversal with Loops
// =====================================

type Graph = Map<string, string[]>;

class GraphProcessor {
  // Depth-first traversal using stack (iterative)
  depthFirstTraversal(graph: Graph, start: string): string[] {
    const result: string[] = [];
    const visited = new Set<string>();
    const stack: string[] = [start];

    while (stack.length > 0) {
      const current = stack.pop()!;

      if (visited.has(current)) continue;
      visited.add(current);
      result.push(current);

      const neighbors = graph.get(current) || [];
      for (let i = neighbors.length - 1; i >= 0; i--) {
        if (!visited.has(neighbors[i])) {
          stack.push(neighbors[i]);
        }
      }
    }

    return result;
  }

  // Breadth-first traversal using queue (iterative)
  breadthFirstTraversal(graph: Graph, start: string): string[] {
    const result: string[] = [];
    const visited = new Set<string>();
    const queue: string[] = [start];

    visited.add(start);

    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);

      const neighbors = graph.get(current) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    return result;
  }

  // Find path using BFS with loop
  findPath(graph: Graph, start: string, end: string): string[] | null {
    if (start === end) return [start];

    const visited = new Set<string>();
    const queue: Array<{ node: string; path: string[] }> = [
      { node: start, path: [start] },
    ];

    visited.add(start);

    while (queue.length > 0) {
      const { node, path } = queue.shift()!;
      const neighbors = graph.get(node) || [];

      for (const neighbor of neighbors) {
        if (neighbor === end) {
          return [...path, neighbor];
        }

        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push({ node: neighbor, path: [...path, neighbor] });
        }
      }
    }

    return null;
  }
}

// Example 7: Mathematical Operations with Loops
// =============================================

class MathOperations {
  // Power with loop
  power(base: number, exponent: number): number {
    if (exponent === 0) return 1;

    let result = 1;
    const absExp = Math.abs(exponent);

    for (let i = 0; i < absExp; i++) {
      result *= base;
    }

    return exponent < 0 ? 1 / result : result;
  }

  // GCD with loop (Euclidean algorithm)
  gcd(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);

    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }

    return a;
  }

  // LCM with loop
  lcm(a: number, b: number): number {
    return Math.abs(a * b) / this.gcd(a, b);
  }

  // Is prime with loop
  isPrime(n: number): boolean {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;

    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      if (n % i === 0) return false;
    }

    return true;
  }

  // Generate primes with sieve (loop-based)
  generatePrimes(limit: number): number[] {
    if (limit < 2) return [];

    const sieve: boolean[] = new Array(limit + 1).fill(true);
    sieve[0] = sieve[1] = false;

    for (let i = 2; i <= Math.sqrt(limit); i++) {
      if (sieve[i]) {
        for (let j = i * i; j <= limit; j += i) {
          sieve[j] = false;
        }
      }
    }

    const primes: number[] = [];
    for (let i = 2; i <= limit; i++) {
      if (sieve[i]) primes.push(i);
    }

    return primes;
  }
}

// Demonstration
// =============

function demonstrateLoops(): void {
  console.log("=== OOP Loops (Iterative) Demonstration ===\n");

  // Factorial
  console.log("1. Factorial with Loops:");
  const factorial = new FactorialCalculator();
  console.log(`factorial(5) = ${factorial.calculate(5)}`);
  console.log(`factorial(10) = ${factorial.calculate(10)}`);

  // Fibonacci
  console.log("\n2. Fibonacci with Loops:");
  const fibonacci = new FibonacciCalculator();
  console.log(`fibonacci(10) = ${fibonacci.calculate(10)}`);
  console.log(`fibonacci sequence(10): [${fibonacci.generateSequence(10)}]`);

  // Array Operations
  console.log("\n3. Array Operations with Loops:");
  const arrayProcessor = new ArrayProcessor();
  const numbers = [1, 2, 3, 4, 5];
  console.log(`sum([${numbers}]) = ${arrayProcessor.sum(numbers)}`);
  console.log(`product([${numbers}]) = ${arrayProcessor.product(numbers)}`);
  console.log(`max([${numbers}]) = ${arrayProcessor.max(numbers)}`);
  console.log(`reverse([${numbers}]) = [${arrayProcessor.reverse(numbers)}]`);

  const nested = [1, [2, 3], [4, [5, 6]]];
  console.log(`flatten(${JSON.stringify(nested)}) = [${arrayProcessor.flatten(nested)}]`);

  // Tree Traversal
  console.log("\n4. Tree Traversal with Stack/Queue:");
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

  const treeProcessor = new BinaryTreeProcessor();
  console.log(`DFS: [${treeProcessor.depthFirstValues(tree)}]`);
  console.log(`BFS: [${treeProcessor.breadthFirstValues(tree)}]`);
  console.log(`sum: ${treeProcessor.sumValues(tree)}`);
  console.log(`contains(5): ${treeProcessor.contains(tree, 5)}`);
  console.log(`contains(10): ${treeProcessor.contains(tree, 10)}`);

  // String Operations
  console.log("\n5. String Operations with Loops:");
  const stringProcessor = new StringProcessor();
  console.log(`reverse("hello") = "${stringProcessor.reverse("hello")}"`);
  console.log(`isPalindrome("racecar") = ${stringProcessor.isPalindrome("racecar")}`);
  console.log(`isPalindrome("hello") = ${stringProcessor.isPalindrome("hello")}`);
  console.log(`countOccurrences("mississippi", "s") = ${stringProcessor.countOccurrences("mississippi", "s")}`);

  // Graph Traversal
  console.log("\n6. Graph Traversal with Loops:");
  const graph: Graph = new Map([
    ["A", ["B", "C"]],
    ["B", ["D", "E"]],
    ["C", ["F"]],
    ["D", []],
    ["E", ["F"]],
    ["F", []],
  ]);

  const graphProcessor = new GraphProcessor();
  console.log(`DFS from A: [${graphProcessor.depthFirstTraversal(graph, "A")}]`);
  console.log(`BFS from A: [${graphProcessor.breadthFirstTraversal(graph, "A")}]`);
  console.log(`Path A->F: [${graphProcessor.findPath(graph, "A", "F")}]`);

  // Math Operations
  console.log("\n7. Math Operations with Loops:");
  const math = new MathOperations();
  console.log(`power(2, 10) = ${math.power(2, 10)}`);
  console.log(`gcd(48, 18) = ${math.gcd(48, 18)}`);
  console.log(`lcm(4, 6) = ${math.lcm(4, 6)}`);
  console.log(`isPrime(17) = ${math.isPrime(17)}`);
  console.log(`isPrime(18) = ${math.isPrime(18)}`);
  console.log(`primes up to 30: [${math.generatePrimes(30)}]`);
}

demonstrateLoops();

export {
  FactorialCalculator,
  FibonacciCalculator,
  ArrayProcessor,
  BinaryTreeProcessor,
  StringProcessor,
  GraphProcessor,
  MathOperations,
};

export type { TreeNode, Graph };

