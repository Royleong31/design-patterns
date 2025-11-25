/**
 * DECORATOR PATTERN
 *
 * Intent: Attach additional responsibilities to an object dynamically.
 * Decorators provide a flexible alternative to subclassing for extending functionality.
 *
 * Real-world example: Coffee Shop Order System
 * - A base coffee can have various add-ons (milk, sugar, whipped cream, etc.)
 * - Each add-on modifies the price and description
 * - Add-ons can be stacked in any combination
 * - New add-ons can be created without changing existing code
 */

/**
 * Component Interface - The base interface for beverages
 */
export interface Beverage {
  getDescription(): string;
  getCost(): number;
  getCalories(): number;
}

/**
 * Concrete Component - Espresso
 */
export class Espresso implements Beverage {
  getDescription(): string {
    return "Espresso";
  }

  getCost(): number {
    return 2.5;
  }

  getCalories(): number {
    return 5;
  }
}

/**
 * Concrete Component - House Blend Coffee
 */
export class HouseBlend implements Beverage {
  getDescription(): string {
    return "House Blend Coffee";
  }

  getCost(): number {
    return 1.99;
  }

  getCalories(): number {
    return 5;
  }
}

/**
 * Concrete Component - Dark Roast
 */
export class DarkRoast implements Beverage {
  getDescription(): string {
    return "Dark Roast Coffee";
  }

  getCost(): number {
    return 2.25;
  }

  getCalories(): number {
    return 5;
  }
}

/**
 * Concrete Component - Decaf
 */
export class Decaf implements Beverage {
  getDescription(): string {
    return "Decaf Coffee";
  }

  getCost(): number {
    return 2.15;
  }

  getCalories(): number {
    return 5;
  }
}

/**
 * Base Decorator - Abstract class for all condiment decorators
 * This class wraps a Beverage and delegates to it
 */
export abstract class CondimentDecorator implements Beverage {
  protected beverage: Beverage;

  constructor(beverage: Beverage) {
    this.beverage = beverage;
  }

  abstract getDescription(): string;
  abstract getCost(): number;
  abstract getCalories(): number;
}

/**
 * Concrete Decorator - Milk
 */
export class Milk extends CondimentDecorator {
  getDescription(): string {
    return `${this.beverage.getDescription()}, Milk`;
  }

  getCost(): number {
    return this.beverage.getCost() + 0.5;
  }

  getCalories(): number {
    return this.beverage.getCalories() + 50;
  }
}

/**
 * Concrete Decorator - Soy Milk
 */
export class SoyMilk extends CondimentDecorator {
  getDescription(): string {
    return `${this.beverage.getDescription()}, Soy Milk`;
  }

  getCost(): number {
    return this.beverage.getCost() + 0.65;
  }

  getCalories(): number {
    return this.beverage.getCalories() + 30;
  }
}

/**
 * Concrete Decorator - Oat Milk
 */
export class OatMilk extends CondimentDecorator {
  getDescription(): string {
    return `${this.beverage.getDescription()}, Oat Milk`;
  }

  getCost(): number {
    return this.beverage.getCost() + 0.7;
  }

  getCalories(): number {
    return this.beverage.getCalories() + 60;
  }
}

/**
 * Concrete Decorator - Whipped Cream
 */
export class WhippedCream extends CondimentDecorator {
  getDescription(): string {
    return `${this.beverage.getDescription()}, Whipped Cream`;
  }

  getCost(): number {
    return this.beverage.getCost() + 0.6;
  }

  getCalories(): number {
    return this.beverage.getCalories() + 100;
  }
}

/**
 * Concrete Decorator - Mocha (Chocolate)
 */
export class Mocha extends CondimentDecorator {
  getDescription(): string {
    return `${this.beverage.getDescription()}, Mocha`;
  }

  getCost(): number {
    return this.beverage.getCost() + 0.75;
  }

  getCalories(): number {
    return this.beverage.getCalories() + 90;
  }
}

/**
 * Concrete Decorator - Caramel
 */
export class Caramel extends CondimentDecorator {
  getDescription(): string {
    return `${this.beverage.getDescription()}, Caramel`;
  }

  getCost(): number {
    return this.beverage.getCost() + 0.55;
  }

  getCalories(): number {
    return this.beverage.getCalories() + 50;
  }
}

/**
 * Concrete Decorator - Vanilla
 */
export class Vanilla extends CondimentDecorator {
  getDescription(): string {
    return `${this.beverage.getDescription()}, Vanilla`;
  }

  getCost(): number {
    return this.beverage.getCost() + 0.45;
  }

  getCalories(): number {
    return this.beverage.getCalories() + 25;
  }
}

/**
 * Concrete Decorator - Extra Shot (of espresso)
 */
export class ExtraShot extends CondimentDecorator {
  getDescription(): string {
    return `${this.beverage.getDescription()}, Extra Shot`;
  }

  getCost(): number {
    return this.beverage.getCost() + 0.8;
  }

  getCalories(): number {
    return this.beverage.getCalories() + 5;
  }
}

/**
 * Concrete Decorator - Sugar (per packet)
 */
export class Sugar extends CondimentDecorator {
  private packets: number;

  constructor(beverage: Beverage, packets: number = 1) {
    super(beverage);
    this.packets = packets;
  }

  getDescription(): string {
    const packetText = this.packets === 1 ? "Sugar" : `Sugar (${this.packets}x)`;
    return `${this.beverage.getDescription()}, ${packetText}`;
  }

  getCost(): number {
    return this.beverage.getCost(); // Sugar is free!
  }

  getCalories(): number {
    return this.beverage.getCalories() + this.packets * 16;
  }
}

/**
 * Size Decorator - Changes the size and price multiplier
 */
export type Size = "tall" | "grande" | "venti";

export class SizedBeverage extends CondimentDecorator {
  private size: Size;
  private sizeMultipliers: Record<Size, number> = {
    tall: 1,
    grande: 1.3,
    venti: 1.5,
  };

  constructor(beverage: Beverage, size: Size) {
    super(beverage);
    this.size = size;
  }

  getDescription(): string {
    const sizeLabel = this.size.charAt(0).toUpperCase() + this.size.slice(1);
    return `${sizeLabel} ${this.beverage.getDescription()}`;
  }

  getCost(): number {
    return this.beverage.getCost() * this.sizeMultipliers[this.size];
  }

  getCalories(): number {
    return Math.round(this.beverage.getCalories() * this.sizeMultipliers[this.size]);
  }
}

/**
 * Helper function to format a beverage order
 */
export function formatOrder(beverage: Beverage): string {
  return [
    `  📋 ${beverage.getDescription()}`,
    `  💰 $${beverage.getCost().toFixed(2)}`,
    `  🔥 ${beverage.getCalories()} calories`,
  ].join("\n");
}

