/**
 * HIGHER-ORDER FUNCTIONS - OOP Approach
 *
 * In OOP, behavior abstraction is typically achieved through:
 * - Strategy Pattern: Define a family of algorithms as classes
 * - Callbacks: Pass objects that implement specific interfaces
 * - Template Method: Define algorithm skeleton in base class
 *
 * This approach requires:
 * - Creating interfaces for each behavior type
 * - Creating concrete classes for each implementation
 * - More boilerplate code
 * - Tight coupling to specific interfaces
 */

// Example 1: Strategy Pattern for Sorting
// =======================================

// Interface for sorting strategy
interface SortStrategy<T> {
  compare(a: T, b: T): number;
}

// Concrete strategies
class AscendingNumberSort implements SortStrategy<number> {
  compare(a: number, b: number): number {
    return a - b;
  }
}

class DescendingNumberSort implements SortStrategy<number> {
  compare(a: number, b: number): number {
    return b - a;
  }
}

class AlphabeticalSort implements SortStrategy<string> {
  compare(a: string, b: string): number {
    return a.localeCompare(b);
  }
}

// Context class that uses the strategy
class Sorter<T> {
  private strategy: SortStrategy<T>;

  constructor(strategy: SortStrategy<T>) {
    this.strategy = strategy;
  }

  setStrategy(strategy: SortStrategy<T>): void {
    this.strategy = strategy;
  }

  sort(items: T[]): T[] {
    return [...items].sort((a, b) => this.strategy.compare(a, b));
  }
}

// Example 2: Strategy Pattern for Filtering
// =========================================

interface FilterStrategy<T> {
  matches(item: T): boolean;
}

class EvenNumberFilter implements FilterStrategy<number> {
  matches(item: number): boolean {
    return item % 2 === 0;
  }
}

class PositiveNumberFilter implements FilterStrategy<number> {
  matches(item: number): boolean {
    return item > 0;
  }
}

class LongStringFilter implements FilterStrategy<string> {
  private minLength: number;

  constructor(minLength: number) {
    this.minLength = minLength;
  }

  matches(item: string): boolean {
    return item.length >= this.minLength;
  }
}

class Filterer<T> {
  private strategy: FilterStrategy<T>;

  constructor(strategy: FilterStrategy<T>) {
    this.strategy = strategy;
  }

  setStrategy(strategy: FilterStrategy<T>): void {
    this.strategy = strategy;
  }

  filter(items: T[]): T[] {
    return items.filter((item) => this.strategy.matches(item));
  }
}

// Example 3: Strategy Pattern for Transformation
// ==============================================

interface TransformStrategy<T, R> {
  transform(item: T): R;
}

class DoubleTransform implements TransformStrategy<number, number> {
  transform(item: number): number {
    return item * 2;
  }
}

class SquareTransform implements TransformStrategy<number, number> {
  transform(item: number): number {
    return item * item;
  }
}

class StringLengthTransform implements TransformStrategy<string, number> {
  transform(item: string): number {
    return item.length;
  }
}

class Transformer<T, R> {
  private strategy: TransformStrategy<T, R>;

  constructor(strategy: TransformStrategy<T, R>) {
    this.strategy = strategy;
  }

  setStrategy(strategy: TransformStrategy<T, R>): void {
    this.strategy = strategy;
  }

  transform(items: T[]): R[] {
    return items.map((item) => this.strategy.transform(item));
  }
}

// Example 4: Callback Pattern for Event Handling
// ==============================================

interface EventHandler {
  handle(event: AppEvent): void;
}

interface AppEvent {
  type: string;
  timestamp: Date;
  data: unknown;
}

class LoggingHandler implements EventHandler {
  handle(event: AppEvent): void {
    console.log(`[${event.timestamp.toISOString()}] ${event.type}:`, event.data);
  }
}

class MetricsHandler implements EventHandler {
  private eventCounts: Map<string, number> = new Map();

  handle(event: AppEvent): void {
    const count = this.eventCounts.get(event.type) || 0;
    this.eventCounts.set(event.type, count + 1);
  }

  getCounts(): Map<string, number> {
    return new Map(this.eventCounts);
  }
}

class EventEmitter {
  private handlers: EventHandler[] = [];

  addHandler(handler: EventHandler): void {
    this.handlers.push(handler);
  }

  removeHandler(handler: EventHandler): void {
    const index = this.handlers.indexOf(handler);
    if (index !== -1) {
      this.handlers.splice(index, 1);
    }
  }

  emit(type: string, data: unknown): void {
    const event: AppEvent = {
      type,
      timestamp: new Date(),
      data,
    };

    for (const handler of this.handlers) {
      handler.handle(event);
    }
  }
}

// Example 5: Template Method Pattern for Data Processing
// =====================================================

abstract class DataProcessor<T, R> {
  // Template method
  process(items: T[]): R[] {
    const validated = this.validate(items);
    const transformed = this.transformAll(validated);
    return this.postProcess(transformed);
  }

  protected abstract validate(items: T[]): T[];
  protected abstract transformItem(item: T): R;
  protected abstract postProcess(items: R[]): R[];

  private transformAll(items: T[]): R[] {
    return items.map((item) => this.transformItem(item));
  }
}

class NumberProcessor extends DataProcessor<number, number> {
  protected validate(items: number[]): number[] {
    return items.filter((n) => !isNaN(n) && isFinite(n));
  }

  protected transformItem(item: number): number {
    return item * 2;
  }

  protected postProcess(items: number[]): number[] {
    return items.sort((a, b) => a - b);
  }
}

class StringProcessor extends DataProcessor<string, string> {
  protected validate(items: string[]): string[] {
    return items.filter((s) => s.trim().length > 0);
  }

  protected transformItem(item: string): string {
    return item.toUpperCase();
  }

  protected postProcess(items: string[]): string[] {
    return items.sort();
  }
}

// Example 6: Strategy Pattern for Reduction/Aggregation
// =====================================================

interface ReduceStrategy<T, R> {
  getInitialValue(): R;
  reduce(accumulator: R, item: T): R;
}

class SumReducer implements ReduceStrategy<number, number> {
  getInitialValue(): number {
    return 0;
  }

  reduce(accumulator: number, item: number): number {
    return accumulator + item;
  }
}

class ProductReducer implements ReduceStrategy<number, number> {
  getInitialValue(): number {
    return 1;
  }

  reduce(accumulator: number, item: number): number {
    return accumulator * item;
  }
}

class ConcatReducer implements ReduceStrategy<string, string> {
  private separator: string;

  constructor(separator: string = "") {
    this.separator = separator;
  }

  getInitialValue(): string {
    return "";
  }

  reduce(accumulator: string, item: string): string {
    return accumulator ? accumulator + this.separator + item : item;
  }
}

class Reducer<T, R> {
  private strategy: ReduceStrategy<T, R>;

  constructor(strategy: ReduceStrategy<T, R>) {
    this.strategy = strategy;
  }

  reduce(items: T[]): R {
    let result = this.strategy.getInitialValue();
    for (const item of items) {
      result = this.strategy.reduce(result, item);
    }
    return result;
  }
}

// Demonstration
// =============

function demonstrateOOPStrategies(): void {
  console.log("=== OOP Higher-Order Behavior (Strategy Pattern) ===\n");

  // Sorting with Strategy Pattern
  console.log("1. Sorting with Strategy Pattern:");
  const numbers = [5, 2, 8, 1, 9, 3];
  const sorter = new Sorter<number>(new AscendingNumberSort());
  console.log(`Original: [${numbers}]`);
  console.log(`Ascending: [${sorter.sort(numbers)}]`);

  sorter.setStrategy(new DescendingNumberSort());
  console.log(`Descending: [${sorter.sort(numbers)}]`);

  const strings = ["banana", "apple", "cherry"];
  const stringSorter = new Sorter<string>(new AlphabeticalSort());
  console.log(`Alphabetical: [${stringSorter.sort(strings)}]`);

  // Filtering with Strategy Pattern
  console.log("\n2. Filtering with Strategy Pattern:");
  const mixedNumbers = [-3, -1, 0, 1, 2, 3, 4, 5, 6];
  const filterer = new Filterer<number>(new EvenNumberFilter());
  console.log(`Original: [${mixedNumbers}]`);
  console.log(`Even: [${filterer.filter(mixedNumbers)}]`);

  filterer.setStrategy(new PositiveNumberFilter());
  console.log(`Positive: [${filterer.filter(mixedNumbers)}]`);

  // Transformation with Strategy Pattern
  console.log("\n3. Transformation with Strategy Pattern:");
  const nums = [1, 2, 3, 4, 5];
  const transformer = new Transformer<number, number>(new DoubleTransform());
  console.log(`Original: [${nums}]`);
  console.log(`Doubled: [${transformer.transform(nums)}]`);

  transformer.setStrategy(new SquareTransform());
  console.log(`Squared: [${transformer.transform(nums)}]`);

  // Reduction with Strategy Pattern
  console.log("\n4. Reduction with Strategy Pattern:");
  const values = [1, 2, 3, 4, 5];
  const sumReducer = new Reducer<number, number>(new SumReducer());
  console.log(`Sum of [${values}]: ${sumReducer.reduce(values)}`);

  const productReducer = new Reducer<number, number>(new ProductReducer());
  console.log(`Product of [${values}]: ${productReducer.reduce(values)}`);

  const words = ["Hello", "World", "!"];
  const concatReducer = new Reducer<string, string>(new ConcatReducer(" "));
  console.log(`Concat of [${words}]: "${concatReducer.reduce(words)}"`);

  // Event handling with callbacks
  console.log("\n5. Event Handling with Callback Pattern:");
  const emitter = new EventEmitter();
  const logger = new LoggingHandler();
  const metrics = new MetricsHandler();

  emitter.addHandler(logger);
  emitter.addHandler(metrics);

  emitter.emit("user.login", { userId: "123" });
  emitter.emit("user.click", { button: "submit" });
  emitter.emit("user.login", { userId: "456" });

  console.log("Metrics:", Object.fromEntries(metrics.getCounts()));

  // Template Method Pattern
  console.log("\n6. Template Method Pattern:");
  const numberProcessor = new NumberProcessor();
  const rawNumbers = [NaN, 5, 3, Infinity, 1, 4, 2];
  console.log(`Processed numbers: [${numberProcessor.process(rawNumbers)}]`);

  const stringProcessor = new StringProcessor();
  const rawStrings = ["  ", "hello", "world", "", "foo"];
  console.log(`Processed strings: [${stringProcessor.process(rawStrings)}]`);
}

demonstrateOOPStrategies();

export {
  // Sorting
  SortStrategy,
  AscendingNumberSort,
  DescendingNumberSort,
  AlphabeticalSort,
  Sorter,
  // Filtering
  FilterStrategy,
  EvenNumberFilter,
  PositiveNumberFilter,
  LongStringFilter,
  Filterer,
  // Transformation
  TransformStrategy,
  DoubleTransform,
  SquareTransform,
  StringLengthTransform,
  Transformer,
  // Event handling
  EventHandler,
  LoggingHandler,
  MetricsHandler,
  EventEmitter,
  // Template method
  DataProcessor,
  NumberProcessor,
  StringProcessor,
  // Reduction
  ReduceStrategy,
  SumReducer,
  ProductReducer,
  ConcatReducer,
  Reducer,
};

export type { AppEvent };

