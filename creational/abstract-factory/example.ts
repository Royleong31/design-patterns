/**
 * ABSTRACT FACTORY PATTERN - Example
 *
 * Demonstrates the UI Theme Factory in action.
 */

import {
  Application,
  LightThemeFactory,
  DarkThemeFactory,
  HighContrastThemeFactory,
  getThemeFactory,
  formatComponentList,
} from "./index";

function main() {
  console.log("=".repeat(60));
  console.log("ABSTRACT FACTORY PATTERN - UI Theme System");
  console.log("=".repeat(60));
  console.log();

  // Create application with Light theme
  console.log("1. Creating application with Light theme...");
  const app = new Application(new LightThemeFactory());
  app.createLoginForm();
  console.log();

  console.log("   Rendered components:");
  console.log(formatComponentList(app.renderAll()));
  console.log();

  // Switch to Dark theme
  console.log("2. Switching to Dark theme...");
  app.setTheme(new DarkThemeFactory());
  app.createLoginForm();
  console.log();

  console.log("   Rendered components:");
  console.log(formatComponentList(app.renderAll()));
  console.log();

  // Switch to High Contrast theme
  console.log("3. Switching to High Contrast theme (accessibility)...");
  app.setTheme(new HighContrastThemeFactory());
  app.createLoginForm();
  console.log();

  console.log("   Rendered components:");
  console.log(formatComponentList(app.renderAll()));
  console.log();

  // Demonstrate factory independence
  console.log("4. Creating components with different factories side by side...");
  console.log();

  const lightFactory = getThemeFactory("light");
  const darkFactory = getThemeFactory("dark");
  const hcFactory = getThemeFactory("high-contrast");

  const lightBtn = lightFactory.createButton("Submit");
  const darkBtn = darkFactory.createButton("Submit");
  const hcBtn = hcFactory.createButton("Submit");

  console.log("   Same button, different themes:");
  console.log(`    ${lightBtn.render()}`);
  console.log(`    ${darkBtn.render()}`);
  console.log(`    ${hcBtn.render()}`);
  console.log();

  // Show that components from same factory are consistent
  console.log("5. Verifying style consistency within a theme...");
  console.log();

  const darkInput = darkFactory.createInput("Search...");
  const darkCard = darkFactory.createCard();
  darkCard.setContent("Results", "Your search results...");
  const darkCheckbox = darkFactory.createCheckbox("Include archived");

  console.log("   All Dark theme components share consistent colors:");
  console.log(`    Button bg: ${darkBtn.getStyles().backgroundColor}`);
  console.log(`    Input bg: ${darkInput.getStyles().backgroundColor}`);
  console.log(`    Card bg: ${darkCard.getStyles().backgroundColor}`);
  console.log(`    Checkbox unchecked: ${darkCheckbox.getStyles().uncheckedColor}`);
  console.log();

  // Interactive checkbox demo
  console.log("6. Component interaction demo (checkbox toggle)...");
  const checkbox = lightFactory.createCheckbox("Enable notifications");
  console.log(`   Before: ${checkbox.render()}`);
  checkbox.toggle();
  console.log(`   After:  ${checkbox.render()}`);
  console.log();

  console.log("=".repeat(60));
  console.log("KEY TAKEAWAYS:");
  console.log("- Factory creates families of related objects (button, input, card)");
  console.log("- All products from one factory are guaranteed to be compatible");
  console.log("- Client code works with factories/products via interfaces");
  console.log("- Switching families (themes) is done by swapping the factory");
  console.log("- Adding new themes only requires a new factory implementation");
  console.log("=".repeat(60));
}

main();

