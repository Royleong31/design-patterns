/**
 * BUILDER PATTERN - Example
 *
 * Demonstrates the Meal Builder pattern in action.
 */

import {
  StandardMealBuilder,
  MealDirector,
  formatMeal,
} from "./index";

function main() {
  console.log("=".repeat(60));
  console.log("BUILDER PATTERN - Meal Order Builder");
  console.log("=".repeat(60));
  console.log();

  const builder = new StandardMealBuilder();
  const director = new MealDirector(builder);

  // 1. Using the Director for predefined meals
  console.log("1. Predefined Meals (using Director)");
  console.log("-".repeat(40));
  console.log();

  console.log(">>> Classic Meal:");
  const classicMeal = director.makeClassicMeal();
  console.log(formatMeal(classicMeal));
  console.log();

  console.log(">>> Deluxe Meal:");
  const deluxeMeal = director.makeDeluxeMeal();
  console.log(formatMeal(deluxeMeal));
  console.log();

  console.log(">>> Veggie Meal:");
  const veggieMeal = director.makeVeggieMeal();
  console.log(formatMeal(veggieMeal));
  console.log();

  console.log(">>> Kids Meal:");
  const kidsMeal = director.makeKidsMeal();
  console.log(formatMeal(kidsMeal));
  console.log();

  // 2. Custom meal using the builder directly
  console.log("=".repeat(60));
  console.log("2. Custom Meal (using Builder directly)");
  console.log("-".repeat(40));
  console.log();

  console.log(">>> Building a custom double bacon cheeseburger...");
  const customMeal = builder
    .reset()
    .setBun("pretzel")
    .setPatty("beef")
    .addCheese("cheddar")
    .addCheese("pepper jack") // Double cheese!
    .addVegetable("lettuce")
    .addVegetable("jalapeños")
    .addSauce("chipotle mayo")
    .addSauce("hot sauce")
    .addExtra("bacon")
    .addExtra("fried egg")
    .addDrink("milkshake", "large")
    .addSide("loaded fries", "large")
    .build();

  console.log(formatMeal(customMeal));
  console.log();

  // 3. Building multiple items with the same builder
  console.log("=".repeat(60));
  console.log("3. Multiple Orders (reusing the builder)");
  console.log("-".repeat(40));
  console.log();

  // Simple burger only
  const burgerOnly = builder
    .setBun("sesame")
    .setPatty("beef")
    .addCheese("american")
    .addSauce("special sauce")
    .build();

  console.log(">>> Burger only (no drink/side):");
  console.log(formatMeal(burgerOnly));
  console.log();

  // Drink and side only (hypothetically getting a veggie side meal)
  const sideOrder = builder
    .setBun("lettuce wrap")
    .setPatty("plant-based")
    .addVegetable("tomato")
    .addVegetable("avocado")
    .addDrink("green smoothie", "medium")
    .build();

  console.log(">>> Health-conscious option:");
  console.log(formatMeal(sideOrder));
  console.log();

  console.log("=".repeat(60));
  console.log("KEY TAKEAWAYS:");
  console.log("- Builder separates construction from representation");
  console.log("- Fluent interface allows method chaining");
  console.log("- Director encapsulates common construction sequences");
  console.log("- Same builder can create different products");
  console.log("- Complex objects built step-by-step");
  console.log("=".repeat(60));
}

main();

