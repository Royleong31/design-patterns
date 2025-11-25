/**
 * BUILDER PATTERN
 *
 * Intent: Separate the construction of a complex object from its representation
 * so that the same construction process can create different representations.
 *
 * Real-world example: Meal Order Builder
 * - A burger can have many optional ingredients
 * - The order of adding ingredients matters
 * - We want a fluent interface for building meals
 * - Different meal combos can be created with the same builder
 */

/**
 * Product - The complex object being built
 */
export interface Burger {
  bun: string;
  patty: string;
  cheese?: string;
  vegetables: string[];
  sauces: string[];
  extras: string[];
}

export interface Meal {
  burger: Burger;
  drink?: { name: string; size: string };
  side?: { name: string; size: string };
  price: number;
}

/**
 * Builder Interface
 * Defines all possible building steps
 */
export interface MealBuilder {
  reset(): this;
  setBun(type: string): this;
  setPatty(type: string): this;
  addCheese(type: string): this;
  addVegetable(vegetable: string): this;
  addSauce(sauce: string): this;
  addExtra(extra: string): this;
  addDrink(name: string, size: string): this;
  addSide(name: string, size: string): this;
  build(): Meal;
}

/**
 * Concrete Builder - Standard Meal Builder
 * Implements the builder interface with specific logic
 */
export class StandardMealBuilder implements MealBuilder {
  private burger: Burger;
  private drink?: { name: string; size: string };
  private side?: { name: string; size: string };
  private basePrice: number = 5.99;

  constructor() {
    this.burger = this.getDefaultBurger();
  }

  private getDefaultBurger(): Burger {
    return {
      bun: "sesame",
      patty: "beef",
      vegetables: [],
      sauces: [],
      extras: [],
    };
  }

  reset(): this {
    this.burger = this.getDefaultBurger();
    this.drink = undefined;
    this.side = undefined;
    this.basePrice = 5.99;
    return this;
  }

  setBun(type: string): this {
    this.burger.bun = type;
    return this;
  }

  setPatty(type: string): this {
    this.burger.patty = type;
    if (type === "wagyu") {
      this.basePrice += 5.0;
    } else if (type === "plant-based") {
      this.basePrice += 1.5;
    }
    return this;
  }

  addCheese(type: string): this {
    this.burger.cheese = type;
    this.basePrice += 0.75;
    return this;
  }

  addVegetable(vegetable: string): this {
    this.burger.vegetables.push(vegetable);
    return this;
  }

  addSauce(sauce: string): this {
    this.burger.sauces.push(sauce);
    return this;
  }

  addExtra(extra: string): this {
    this.burger.extras.push(extra);
    this.basePrice += 0.5;
    return this;
  }

  addDrink(name: string, size: string): this {
    this.drink = { name, size };
    const drinkPrices: Record<string, number> = {
      small: 1.5,
      medium: 2.0,
      large: 2.5,
    };
    this.basePrice += drinkPrices[size] || 2.0;
    return this;
  }

  addSide(name: string, size: string): this {
    this.side = { name, size };
    const sidePrices: Record<string, number> = {
      small: 2.0,
      medium: 2.75,
      large: 3.5,
    };
    this.basePrice += sidePrices[size] || 2.75;
    return this;
  }

  build(): Meal {
    const meal: Meal = {
      burger: { ...this.burger },
      price: Math.round(this.basePrice * 100) / 100,
    };

    if (this.drink) {
      meal.drink = { ...this.drink };
    }

    if (this.side) {
      meal.side = { ...this.side };
    }

    // Reset for the next build
    this.reset();

    return meal;
  }
}

/**
 * Director - Knows how to build common meal configurations
 * The Director is optional but useful for creating predefined products
 */
export class MealDirector {
  private builder: MealBuilder;

  constructor(builder: MealBuilder) {
    this.builder = builder;
  }

  setBuilder(builder: MealBuilder): void {
    this.builder = builder;
  }

  /**
   * Classic Burger Meal - The basic combo
   */
  makeClassicMeal(): Meal {
    return this.builder
      .reset()
      .setBun("sesame")
      .setPatty("beef")
      .addCheese("american")
      .addVegetable("lettuce")
      .addVegetable("tomato")
      .addVegetable("onion")
      .addSauce("ketchup")
      .addSauce("mustard")
      .addDrink("cola", "medium")
      .addSide("fries", "medium")
      .build();
  }

  /**
   * Deluxe Burger Meal - Premium ingredients
   */
  makeDeluxeMeal(): Meal {
    return this.builder
      .reset()
      .setBun("brioche")
      .setPatty("wagyu")
      .addCheese("swiss")
      .addVegetable("arugula")
      .addVegetable("caramelized onion")
      .addVegetable("tomato")
      .addSauce("truffle aioli")
      .addExtra("bacon")
      .addExtra("avocado")
      .addDrink("craft lemonade", "large")
      .addSide("sweet potato fries", "large")
      .build();
  }

  /**
   * Veggie Meal - Plant-based option
   */
  makeVeggieMeal(): Meal {
    return this.builder
      .reset()
      .setBun("whole wheat")
      .setPatty("plant-based")
      .addCheese("vegan cheddar")
      .addVegetable("lettuce")
      .addVegetable("tomato")
      .addVegetable("pickles")
      .addVegetable("grilled mushrooms")
      .addSauce("vegan mayo")
      .addSauce("BBQ sauce")
      .addDrink("iced tea", "medium")
      .addSide("onion rings", "medium")
      .build();
  }

  /**
   * Kids Meal - Smaller portions
   */
  makeKidsMeal(): Meal {
    return this.builder
      .reset()
      .setBun("plain")
      .setPatty("beef")
      .addCheese("american")
      .addSauce("ketchup")
      .addDrink("apple juice", "small")
      .addSide("fries", "small")
      .build();
  }
}

/**
 * Helper function to format a meal for display
 */
export function formatMeal(meal: Meal): string {
  const lines: string[] = [];

  lines.push("🍔 BURGER:");
  lines.push(`   Bun: ${meal.burger.bun}`);
  lines.push(`   Patty: ${meal.burger.patty}`);
  if (meal.burger.cheese) {
    lines.push(`   Cheese: ${meal.burger.cheese}`);
  }
  if (meal.burger.vegetables.length > 0) {
    lines.push(`   Vegetables: ${meal.burger.vegetables.join(", ")}`);
  }
  if (meal.burger.sauces.length > 0) {
    lines.push(`   Sauces: ${meal.burger.sauces.join(", ")}`);
  }
  if (meal.burger.extras.length > 0) {
    lines.push(`   Extras: ${meal.burger.extras.join(", ")}`);
  }

  if (meal.drink) {
    lines.push(`🥤 DRINK: ${meal.drink.name} (${meal.drink.size})`);
  }

  if (meal.side) {
    lines.push(`🍟 SIDE: ${meal.side.name} (${meal.side.size})`);
  }

  lines.push(`💰 TOTAL: $${meal.price.toFixed(2)}`);

  return lines.join("\n");
}

