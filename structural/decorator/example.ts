/**
 * DECORATOR PATTERN - Example
 *
 * Demonstrates the Coffee Shop decorator pattern in action.
 */

import {
  Espresso,
  HouseBlend,
  DarkRoast,
  Decaf,
  Milk,
  SoyMilk,
  OatMilk,
  WhippedCream,
  Mocha,
  Caramel,
  Vanilla,
  ExtraShot,
  Sugar,
  SizedBeverage,
  formatOrder,
} from "./index";

function main() {
  console.log("=".repeat(60));
  console.log("DECORATOR PATTERN - Coffee Shop Order System");
  console.log("=".repeat(60));
  console.log();

  // 1. Simple orders
  console.log("1. Simple Orders");
  console.log("-".repeat(40));
  console.log();

  // Plain espresso
  console.log(">>> Plain Espresso:");
  const espresso = new Espresso();
  console.log(formatOrder(espresso));
  console.log();

  // Espresso with milk
  console.log(">>> Espresso with Milk:");
  const espressoWithMilk = new Milk(new Espresso());
  console.log(formatOrder(espressoWithMilk));
  console.log();

  // 2. Complex orders with multiple decorators
  console.log("=".repeat(60));
  console.log("2. Complex Orders (Multiple Decorators)");
  console.log("-".repeat(40));
  console.log();

  // Mocha Latte: Espresso + Mocha + Milk + Whipped Cream
  console.log(">>> Mocha Latte:");
  const mochaLatte = new WhippedCream(new Milk(new Mocha(new Espresso())));
  console.log(formatOrder(mochaLatte));
  console.log();

  // Caramel Macchiato: Espresso + Vanilla + Caramel + Milk
  console.log(">>> Caramel Macchiato:");
  const caramelMacchiato = new Milk(new Caramel(new Vanilla(new Espresso())));
  console.log(formatOrder(caramelMacchiato));
  console.log();

  // Double Mocha: Espresso + Double Mocha + Milk + Whipped Cream
  console.log(">>> Double Mocha:");
  const doubleMocha = new WhippedCream(new Milk(new Mocha(new Mocha(new Espresso()))));
  console.log(formatOrder(doubleMocha));
  console.log();

  // 3. Different base beverages
  console.log("=".repeat(60));
  console.log("3. Different Base Beverages");
  console.log("-".repeat(40));
  console.log();

  console.log(">>> House Blend with Soy Milk and Sugar:");
  const houseBlendSoy = new Sugar(new SoyMilk(new HouseBlend()), 2);
  console.log(formatOrder(houseBlendSoy));
  console.log();

  console.log(">>> Dark Roast with Oat Milk and Vanilla:");
  const darkRoastVanilla = new Vanilla(new OatMilk(new DarkRoast()));
  console.log(formatOrder(darkRoastVanilla));
  console.log();

  console.log(">>> Decaf with Milk:");
  const decafMilk = new Milk(new Decaf());
  console.log(formatOrder(decafMilk));
  console.log();

  // 4. Sized beverages
  console.log("=".repeat(60));
  console.log("4. Sized Beverages");
  console.log("-".repeat(40));
  console.log();

  console.log(">>> Tall Espresso with Milk:");
  const tallLatte = new SizedBeverage(new Milk(new Espresso()), "tall");
  console.log(formatOrder(tallLatte));
  console.log();

  console.log(">>> Grande Mocha with Whipped Cream:");
  const grandeMocha = new SizedBeverage(
    new WhippedCream(new Mocha(new Milk(new Espresso()))),
    "grande"
  );
  console.log(formatOrder(grandeMocha));
  console.log();

  console.log(">>> Venti Caramel Macchiato with Extra Shot:");
  const ventiCaramelMacchiato = new SizedBeverage(
    new ExtraShot(new Caramel(new Vanilla(new Milk(new Espresso())))),
    "venti"
  );
  console.log(formatOrder(ventiCaramelMacchiato));
  console.log();

  // 5. Building an order step by step
  console.log("=".repeat(60));
  console.log("5. Building Order Step by Step");
  console.log("-".repeat(40));
  console.log();

  console.log("Starting with Dark Roast...");
  let order = new DarkRoast();
  console.log(formatOrder(order));
  console.log();

  console.log("Adding Oat Milk...");
  let orderWithOatMilk = new OatMilk(order);
  console.log(formatOrder(orderWithOatMilk));
  console.log();

  console.log("Adding Mocha...");
  let orderWithMocha = new Mocha(orderWithOatMilk);
  console.log(formatOrder(orderWithMocha));
  console.log();

  console.log("Adding Whipped Cream...");
  let orderWithWhip = new WhippedCream(orderWithMocha);
  console.log(formatOrder(orderWithWhip));
  console.log();

  console.log("Making it a Venti...");
  let finalOrder = new SizedBeverage(orderWithWhip, "venti");
  console.log(formatOrder(finalOrder));
  console.log();

  console.log("=".repeat(60));
  console.log("KEY TAKEAWAYS:");
  console.log("- Decorators wrap objects to add new behavior");
  console.log("- Each decorator follows the same interface as the component");
  console.log("- Decorators can be stacked in any order");
  console.log("- New decorators can be added without changing existing code");
  console.log("- Provides flexible alternative to subclassing");
  console.log("=".repeat(60));
}

main();

