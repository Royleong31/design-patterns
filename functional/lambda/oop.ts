/**
 * LAMBDA - OOP Approach (Anonymous Classes & Interfaces)
 *
 * In traditional OOP (especially Java-style), anonymous functions were achieved through:
 * - Anonymous inner classes implementing interfaces
 * - Named classes for each behavior variation
 * - Verbose callback patterns
 *
 * This approach:
 * - Requires interface definitions
 * - More verbose and ceremonial
 * - Type-safe but with more boilerplate
 * - Common in Java before Java 8 lambdas
 *
 * Note: TypeScript/JavaScript natively supports arrow functions,
 * but this file demonstrates the "old school" OOP approach for comparison.
 */

// Example 1: Callback Interfaces (Java-style)
// ===========================================

// Define interfaces for each callback type
interface Predicate<T> {
  test(value: T): boolean;
}

interface Function<T, R> {
  apply(value: T): R;
}

interface Consumer<T> {
  accept(value: T): void;
}

interface Supplier<T> {
  get(): T;
}

interface BiFunction<T, U, R> {
  apply(t: T, u: U): R;
}

interface Comparator<T> {
  compare(a: T, b: T): number;
}

interface Runnable {
  run(): void;
}

// Anonymous class implementations
class EvenNumberPredicate implements Predicate<number> {
  test(value: number): boolean {
    return value % 2 === 0;
  }
}

class PositiveNumberPredicate implements Predicate<number> {
  test(value: number): boolean {
    return value > 0;
  }
}

class DoubleFunction implements Function<number, number> {
  apply(value: number): number {
    return value * 2;
  }
}

class SquareFunction implements Function<number, number> {
  apply(value: number): number {
    return value * value;
  }
}

class ToStringFunction<T> implements Function<T, string> {
  apply(value: T): string {
    return String(value);
  }
}

class PrintConsumer<T> implements Consumer<T> {
  accept(value: T): void {
    console.log(value);
  }
}

class AscendingComparator implements Comparator<number> {
  compare(a: number, b: number): number {
    return a - b;
  }
}

class DescendingComparator implements Comparator<number> {
  compare(a: number, b: number): number {
    return b - a;
  }
}

// Example 2: Collection Operations with Interfaces
// ================================================

class OOPCollection<T> {
  private items: T[];

  constructor(items: T[]) {
    this.items = [...items];
  }

  // Requires a Predicate object
  filter(predicate: Predicate<T>): OOPCollection<T> {
    const result: T[] = [];
    for (const item of this.items) {
      if (predicate.test(item)) {
        result.push(item);
      }
    }
    return new OOPCollection(result);
  }

  // Requires a Function object
  map<R>(mapper: Function<T, R>): OOPCollection<R> {
    const result: R[] = [];
    for (const item of this.items) {
      result.push(mapper.apply(item));
    }
    return new OOPCollection(result);
  }

  // Requires a BiFunction object
  reduce<R>(reducer: BiFunction<R, T, R>, initial: R): R {
    let accumulator = initial;
    for (const item of this.items) {
      accumulator = reducer.apply(accumulator, item);
    }
    return accumulator;
  }

  // Requires a Consumer object
  forEach(consumer: Consumer<T>): void {
    for (const item of this.items) {
      consumer.accept(item);
    }
  }

  // Requires a Comparator object
  sort(comparator: Comparator<T>): OOPCollection<T> {
    const sorted = [...this.items].sort((a, b) => comparator.compare(a, b));
    return new OOPCollection(sorted);
  }

  // Requires a Predicate object
  find(predicate: Predicate<T>): T | undefined {
    for (const item of this.items) {
      if (predicate.test(item)) {
        return item;
      }
    }
    return undefined;
  }

  // Requires a Predicate object
  some(predicate: Predicate<T>): boolean {
    for (const item of this.items) {
      if (predicate.test(item)) {
        return true;
      }
    }
    return false;
  }

  // Requires a Predicate object
  every(predicate: Predicate<T>): boolean {
    for (const item of this.items) {
      if (!predicate.test(item)) {
        return false;
      }
    }
    return true;
  }

  toArray(): T[] {
    return [...this.items];
  }
}

// Example 3: Event Handlers with Interfaces
// =========================================

interface EventHandler<T> {
  handle(event: T): void;
}

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

// Named handler classes
class LoggingClickHandler implements EventHandler<ClickEvent> {
  handle(event: ClickEvent): void {
    console.log(`Click at (${event.x}, ${event.y}) with ${event.button} button`);
  }
}

class LoggingKeyHandler implements EventHandler<KeyEvent> {
  handle(event: KeyEvent): void {
    console.log(`Key pressed: ${event.key}, ctrl: ${event.ctrlKey}, alt: ${event.altKey}`);
  }
}

class EventEmitter<T> {
  private handlers: Array<EventHandler<T>> = [];

  addHandler(handler: EventHandler<T>): void {
    this.handlers.push(handler);
  }

  removeHandler(handler: EventHandler<T>): void {
    const index = this.handlers.indexOf(handler);
    if (index !== -1) {
      this.handlers.splice(index, 1);
    }
  }

  emit(event: T): void {
    for (const handler of this.handlers) {
      handler.handle(event);
    }
  }
}

// Example 4: Strategy Pattern with Interfaces
// ===========================================

interface SortStrategy<T> {
  sort(items: T[]): T[];
}

interface ValidationStrategy<T> {
  validate(value: T): boolean;
  getErrorMessage(): string;
}

// Concrete sort strategies
class BubbleSortStrategy implements SortStrategy<number> {
  sort(items: number[]): number[] {
    const arr = [...items];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }
}

class QuickSortStrategy implements SortStrategy<number> {
  sort(items: number[]): number[] {
    return [...items].sort((a, b) => a - b);
  }
}

// Concrete validation strategies
class MinLengthValidation implements ValidationStrategy<string> {
  private minLength: number;

  constructor(minLength: number) {
    this.minLength = minLength;
  }

  validate(value: string): boolean {
    return value.length >= this.minLength;
  }

  getErrorMessage(): string {
    return `Value must be at least ${this.minLength} characters`;
  }
}

class EmailValidation implements ValidationStrategy<string> {
  private pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  validate(value: string): boolean {
    return this.pattern.test(value);
  }

  getErrorMessage(): string {
    return "Invalid email format";
  }
}

class RangeValidation implements ValidationStrategy<number> {
  private min: number;
  private max: number;

  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;
  }

  validate(value: number): boolean {
    return value >= this.min && value <= this.max;
  }

  getErrorMessage(): string {
    return `Value must be between ${this.min} and ${this.max}`;
  }
}

// Example 5: Callback-based Async Operations
// ==========================================

interface Callback<T> {
  onSuccess(result: T): void;
  onError(error: Error): void;
}

interface AsyncOperation<T> {
  execute(callback: Callback<T>): void;
}

// Named callback implementations
class LoggingCallback<T> implements Callback<T> {
  onSuccess(result: T): void {
    console.log("Success:", result);
  }

  onError(error: Error): void {
    console.error("Error:", error.message);
  }
}

class DataFetchOperation implements AsyncOperation<string> {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  execute(callback: Callback<string>): void {
    // Simulated async operation
    setTimeout(() => {
      if (Math.random() > 0.1) {
        callback.onSuccess(`Data from ${this.url}`);
      } else {
        callback.onError(new Error("Failed to fetch data"));
      }
    }, 100);
  }
}

// Example 6: Factory with Interfaces
// ==================================

interface Factory<T> {
  create(): T;
}

interface ParameterizedFactory<T, P> {
  create(params: P): T;
}

interface User {
  id: number;
  name: string;
  email: string;
}

class UserFactory implements ParameterizedFactory<User, { name: string; email: string }> {
  private nextId = 1;

  create(params: { name: string; email: string }): User {
    return {
      id: this.nextId++,
      name: params.name,
      email: params.email,
    };
  }
}

class RandomNumberFactory implements Factory<number> {
  create(): number {
    return Math.random();
  }
}

class UUIDFactory implements Factory<string> {
  create(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

// Example 7: Command Pattern with Interfaces
// ==========================================

interface Command {
  execute(): void;
  undo(): void;
}

class TextEditor {
  private content: string = "";

  getContent(): string {
    return this.content;
  }

  setContent(content: string): void {
    this.content = content;
  }

  append(text: string): void {
    this.content += text;
  }

  deleteLast(count: number): string {
    const deleted = this.content.slice(-count);
    this.content = this.content.slice(0, -count);
    return deleted;
  }
}

class AppendCommand implements Command {
  private editor: TextEditor;
  private text: string;

  constructor(editor: TextEditor, text: string) {
    this.editor = editor;
    this.text = text;
  }

  execute(): void {
    this.editor.append(this.text);
  }

  undo(): void {
    this.editor.deleteLast(this.text.length);
  }
}

class DeleteCommand implements Command {
  private editor: TextEditor;
  private count: number;
  private deleted: string = "";

  constructor(editor: TextEditor, count: number) {
    this.editor = editor;
    this.count = count;
  }

  execute(): void {
    this.deleted = this.editor.deleteLast(this.count);
  }

  undo(): void {
    this.editor.append(this.deleted);
  }
}

// Demonstration
// =============

function demonstrateOOPAnonymousClasses(): void {
  console.log("=== OOP Anonymous Classes/Interfaces Demonstration ===\n");

  // Collection with interface-based callbacks
  console.log("1. Collection Operations with Interfaces:");
  const numbers = new OOPCollection([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  // Must create class instances for each operation
  const evens = numbers.filter(new EvenNumberPredicate());
  console.log(`Even numbers: [${evens.toArray()}]`);

  const doubled = numbers.map(new DoubleFunction());
  console.log(`Doubled: [${doubled.toArray()}]`);

  const sorted = numbers.sort(new DescendingComparator());
  console.log(`Descending: [${sorted.toArray()}]`);

  // Anonymous class inline (verbose)
  const greaterThan5 = numbers.filter({
    test(value: number): boolean {
      return value > 5;
    },
  });
  console.log(`Greater than 5: [${greaterThan5.toArray()}]`);

  // Event Handlers
  console.log("\n2. Event Handlers with Interfaces:");
  const clickEmitter = new EventEmitter<ClickEvent>();
  clickEmitter.addHandler(new LoggingClickHandler());
  clickEmitter.emit({ x: 100, y: 200, button: "left" });

  // Anonymous handler inline
  clickEmitter.addHandler({
    handle(event: ClickEvent): void {
      console.log(`Custom handler: ${event.button} click`);
    },
  });
  clickEmitter.emit({ x: 150, y: 250, button: "right" });

  // Strategy Pattern
  console.log("\n3. Strategy Pattern with Interfaces:");
  const unsorted = [5, 2, 8, 1, 9, 3];
  const bubbleSort = new BubbleSortStrategy();
  const quickSort = new QuickSortStrategy();

  console.log(`Bubble sort: [${bubbleSort.sort(unsorted)}]`);
  console.log(`Quick sort: [${quickSort.sort(unsorted)}]`);

  // Validation
  console.log("\n4. Validation with Interfaces:");
  const emailValidator = new EmailValidation();
  const lengthValidator = new MinLengthValidation(5);
  const rangeValidator = new RangeValidation(1, 100);

  console.log(`"test@example.com" is valid email: ${emailValidator.validate("test@example.com")}`);
  console.log(`"invalid" is valid email: ${emailValidator.validate("invalid")}`);
  console.log(`"hi" has min length 5: ${lengthValidator.validate("hi")}`);
  console.log(`50 is in range 1-100: ${rangeValidator.validate(50)}`);

  // Factory Pattern
  console.log("\n5. Factory Pattern with Interfaces:");
  const userFactory = new UserFactory();
  const uuidFactory = new UUIDFactory();

  const user1 = userFactory.create({ name: "Alice", email: "alice@example.com" });
  const user2 = userFactory.create({ name: "Bob", email: "bob@example.com" });
  console.log(`User 1: ${JSON.stringify(user1)}`);
  console.log(`User 2: ${JSON.stringify(user2)}`);
  console.log(`UUID: ${uuidFactory.create()}`);

  // Command Pattern
  console.log("\n6. Command Pattern with Interfaces:");
  const editor = new TextEditor();
  const commands: Command[] = [];

  const appendHello = new AppendCommand(editor, "Hello ");
  const appendWorld = new AppendCommand(editor, "World!");

  appendHello.execute();
  commands.push(appendHello);
  console.log(`After append "Hello ": "${editor.getContent()}"`);

  appendWorld.execute();
  commands.push(appendWorld);
  console.log(`After append "World!": "${editor.getContent()}"`);

  // Undo
  const lastCommand = commands.pop();
  lastCommand?.undo();
  console.log(`After undo: "${editor.getContent()}"`);
}

demonstrateOOPAnonymousClasses();

export {
  // Interfaces
  Predicate,
  Function,
  Consumer,
  Supplier,
  BiFunction,
  Comparator,
  Runnable,
  EventHandler,
  SortStrategy,
  ValidationStrategy,
  Callback,
  AsyncOperation,
  Factory,
  ParameterizedFactory,
  Command,
  // Implementations
  EvenNumberPredicate,
  PositiveNumberPredicate,
  DoubleFunction,
  SquareFunction,
  ToStringFunction,
  PrintConsumer,
  AscendingComparator,
  DescendingComparator,
  OOPCollection,
  LoggingClickHandler,
  LoggingKeyHandler,
  EventEmitter,
  BubbleSortStrategy,
  QuickSortStrategy,
  MinLengthValidation,
  EmailValidation,
  RangeValidation,
  LoggingCallback,
  DataFetchOperation,
  UserFactory,
  RandomNumberFactory,
  UUIDFactory,
  TextEditor,
  AppendCommand,
  DeleteCommand,
};

export type { ClickEvent, KeyEvent, User };

