/**
 * ABSTRACT FACTORY PATTERN
 *
 * Intent: Provide an interface for creating families of related or dependent objects
 * without specifying their concrete classes.
 *
 * Real-world example: UI Theme System
 * - An application supports multiple themes (Light, Dark, High Contrast)
 * - Each theme provides a consistent family of UI components (buttons, inputs, cards)
 * - Components from the same theme work together visually
 * - Switching themes swaps all components at once for consistency
 */

/**
 * Abstract Product - Button
 */
export interface Button {
  render(): string;
  onClick(handler: () => void): void;
  getStyles(): ButtonStyles;
}

export interface ButtonStyles {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  hoverColor: string;
  borderRadius: number;
  padding: string;
}

/**
 * Abstract Product - Input Field
 */
export interface Input {
  render(): string;
  getValue(): string;
  setValue(value: string): void;
  getStyles(): InputStyles;
}

export interface InputStyles {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  focusBorderColor: string;
  placeholderColor: string;
  borderRadius: number;
}

/**
 * Abstract Product - Card
 */
export interface Card {
  render(): string;
  setContent(title: string, body: string): void;
  getStyles(): CardStyles;
}

export interface CardStyles {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  shadowColor: string;
  borderRadius: number;
  padding: string;
}

/**
 * Abstract Product - Checkbox
 */
export interface Checkbox {
  render(): string;
  isChecked(): boolean;
  toggle(): void;
  getStyles(): CheckboxStyles;
}

export interface CheckboxStyles {
  uncheckedColor: string;
  checkedColor: string;
  checkmarkColor: string;
  borderColor: string;
  size: number;
}

/**
 * Abstract Factory - UI Component Factory
 */
export interface UIComponentFactory {
  readonly themeName: string;
  createButton(label: string): Button;
  createInput(placeholder: string): Input;
  createCard(): Card;
  createCheckbox(label: string): Checkbox;
}

// =============================================================================
// LIGHT THEME IMPLEMENTATION
// =============================================================================

class LightButton implements Button {
  private label: string;
  private clickHandler: (() => void) | null = null;
  private styles: ButtonStyles = {
    backgroundColor: "#ffffff",
    textColor: "#1a1a2e",
    borderColor: "#e0e0e0",
    hoverColor: "#f5f5f5",
    borderRadius: 6,
    padding: "10px 20px",
  };

  constructor(label: string) {
    this.label = label;
  }

  render(): string {
    return `[Light Button: "${this.label}"] bg:${this.styles.backgroundColor} text:${this.styles.textColor}`;
  }

  onClick(handler: () => void): void {
    this.clickHandler = handler;
  }

  getStyles(): ButtonStyles {
    return this.styles;
  }
}

class LightInput implements Input {
  private placeholder: string;
  private value: string = "";
  private styles: InputStyles = {
    backgroundColor: "#ffffff",
    textColor: "#333333",
    borderColor: "#cccccc",
    focusBorderColor: "#4a90d9",
    placeholderColor: "#999999",
    borderRadius: 4,
  };

  constructor(placeholder: string) {
    this.placeholder = placeholder;
  }

  render(): string {
    return `[Light Input: "${this.placeholder}"] bg:${this.styles.backgroundColor} border:${this.styles.borderColor}`;
  }

  getValue(): string {
    return this.value;
  }

  setValue(value: string): void {
    this.value = value;
  }

  getStyles(): InputStyles {
    return this.styles;
  }
}

class LightCard implements Card {
  private title: string = "";
  private body: string = "";
  private styles: CardStyles = {
    backgroundColor: "#ffffff",
    textColor: "#333333",
    borderColor: "#e8e8e8",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 8,
    padding: "16px",
  };

  render(): string {
    return `[Light Card: "${this.title}"] bg:${this.styles.backgroundColor} shadow:${this.styles.shadowColor}`;
  }

  setContent(title: string, body: string): void {
    this.title = title;
    this.body = body;
  }

  getStyles(): CardStyles {
    return this.styles;
  }
}

class LightCheckbox implements Checkbox {
  private label: string;
  private checked: boolean = false;
  private styles: CheckboxStyles = {
    uncheckedColor: "#ffffff",
    checkedColor: "#4a90d9",
    checkmarkColor: "#ffffff",
    borderColor: "#cccccc",
    size: 18,
  };

  constructor(label: string) {
    this.label = label;
  }

  render(): string {
    const icon = this.checked ? "☑" : "☐";
    return `[Light Checkbox: ${icon} "${this.label}"] checked-bg:${this.styles.checkedColor}`;
  }

  isChecked(): boolean {
    return this.checked;
  }

  toggle(): void {
    this.checked = !this.checked;
  }

  getStyles(): CheckboxStyles {
    return this.styles;
  }
}

/**
 * Concrete Factory - Light Theme Factory
 */
export class LightThemeFactory implements UIComponentFactory {
  readonly themeName = "Light";

  createButton(label: string): Button {
    return new LightButton(label);
  }

  createInput(placeholder: string): Input {
    return new LightInput(placeholder);
  }

  createCard(): Card {
    return new LightCard();
  }

  createCheckbox(label: string): Checkbox {
    return new LightCheckbox(label);
  }
}

// =============================================================================
// DARK THEME IMPLEMENTATION
// =============================================================================

class DarkButton implements Button {
  private label: string;
  private clickHandler: (() => void) | null = null;
  private styles: ButtonStyles = {
    backgroundColor: "#2d2d2d",
    textColor: "#e0e0e0",
    borderColor: "#444444",
    hoverColor: "#3d3d3d",
    borderRadius: 6,
    padding: "10px 20px",
  };

  constructor(label: string) {
    this.label = label;
  }

  render(): string {
    return `[Dark Button: "${this.label}"] bg:${this.styles.backgroundColor} text:${this.styles.textColor}`;
  }

  onClick(handler: () => void): void {
    this.clickHandler = handler;
  }

  getStyles(): ButtonStyles {
    return this.styles;
  }
}

class DarkInput implements Input {
  private placeholder: string;
  private value: string = "";
  private styles: InputStyles = {
    backgroundColor: "#1e1e1e",
    textColor: "#e0e0e0",
    borderColor: "#444444",
    focusBorderColor: "#6bb3f8",
    placeholderColor: "#666666",
    borderRadius: 4,
  };

  constructor(placeholder: string) {
    this.placeholder = placeholder;
  }

  render(): string {
    return `[Dark Input: "${this.placeholder}"] bg:${this.styles.backgroundColor} border:${this.styles.borderColor}`;
  }

  getValue(): string {
    return this.value;
  }

  setValue(value: string): void {
    this.value = value;
  }

  getStyles(): InputStyles {
    return this.styles;
  }
}

class DarkCard implements Card {
  private title: string = "";
  private body: string = "";
  private styles: CardStyles = {
    backgroundColor: "#2d2d2d",
    textColor: "#e0e0e0",
    borderColor: "#444444",
    shadowColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 8,
    padding: "16px",
  };

  render(): string {
    return `[Dark Card: "${this.title}"] bg:${this.styles.backgroundColor} shadow:${this.styles.shadowColor}`;
  }

  setContent(title: string, body: string): void {
    this.title = title;
    this.body = body;
  }

  getStyles(): CardStyles {
    return this.styles;
  }
}

class DarkCheckbox implements Checkbox {
  private label: string;
  private checked: boolean = false;
  private styles: CheckboxStyles = {
    uncheckedColor: "#1e1e1e",
    checkedColor: "#6bb3f8",
    checkmarkColor: "#1e1e1e",
    borderColor: "#555555",
    size: 18,
  };

  constructor(label: string) {
    this.label = label;
  }

  render(): string {
    const icon = this.checked ? "☑" : "☐";
    return `[Dark Checkbox: ${icon} "${this.label}"] checked-bg:${this.styles.checkedColor}`;
  }

  isChecked(): boolean {
    return this.checked;
  }

  toggle(): void {
    this.checked = !this.checked;
  }

  getStyles(): CheckboxStyles {
    return this.styles;
  }
}

/**
 * Concrete Factory - Dark Theme Factory
 */
export class DarkThemeFactory implements UIComponentFactory {
  readonly themeName = "Dark";

  createButton(label: string): Button {
    return new DarkButton(label);
  }

  createInput(placeholder: string): Input {
    return new DarkInput(placeholder);
  }

  createCard(): Card {
    return new DarkCard();
  }

  createCheckbox(label: string): Checkbox {
    return new DarkCheckbox(label);
  }
}

// =============================================================================
// HIGH CONTRAST THEME IMPLEMENTATION
// =============================================================================

class HighContrastButton implements Button {
  private label: string;
  private clickHandler: (() => void) | null = null;
  private styles: ButtonStyles = {
    backgroundColor: "#000000",
    textColor: "#ffff00",
    borderColor: "#ffff00",
    hoverColor: "#333300",
    borderRadius: 0,
    padding: "12px 24px",
  };

  constructor(label: string) {
    this.label = label;
  }

  render(): string {
    return `[HC Button: "${this.label}"] bg:${this.styles.backgroundColor} text:${this.styles.textColor}`;
  }

  onClick(handler: () => void): void {
    this.clickHandler = handler;
  }

  getStyles(): ButtonStyles {
    return this.styles;
  }
}

class HighContrastInput implements Input {
  private placeholder: string;
  private value: string = "";
  private styles: InputStyles = {
    backgroundColor: "#000000",
    textColor: "#ffffff",
    borderColor: "#ffffff",
    focusBorderColor: "#00ffff",
    placeholderColor: "#aaaaaa",
    borderRadius: 0,
  };

  constructor(placeholder: string) {
    this.placeholder = placeholder;
  }

  render(): string {
    return `[HC Input: "${this.placeholder}"] bg:${this.styles.backgroundColor} border:${this.styles.borderColor}`;
  }

  getValue(): string {
    return this.value;
  }

  setValue(value: string): void {
    this.value = value;
  }

  getStyles(): InputStyles {
    return this.styles;
  }
}

class HighContrastCard implements Card {
  private title: string = "";
  private body: string = "";
  private styles: CardStyles = {
    backgroundColor: "#000000",
    textColor: "#ffffff",
    borderColor: "#ffffff",
    shadowColor: "none",
    borderRadius: 0,
    padding: "16px",
  };

  render(): string {
    return `[HC Card: "${this.title}"] bg:${this.styles.backgroundColor} border:${this.styles.borderColor}`;
  }

  setContent(title: string, body: string): void {
    this.title = title;
    this.body = body;
  }

  getStyles(): CardStyles {
    return this.styles;
  }
}

class HighContrastCheckbox implements Checkbox {
  private label: string;
  private checked: boolean = false;
  private styles: CheckboxStyles = {
    uncheckedColor: "#000000",
    checkedColor: "#00ff00",
    checkmarkColor: "#000000",
    borderColor: "#ffffff",
    size: 20,
  };

  constructor(label: string) {
    this.label = label;
  }

  render(): string {
    const icon = this.checked ? "☑" : "☐";
    return `[HC Checkbox: ${icon} "${this.label}"] checked-bg:${this.styles.checkedColor}`;
  }

  isChecked(): boolean {
    return this.checked;
  }

  toggle(): void {
    this.checked = !this.checked;
  }

  getStyles(): CheckboxStyles {
    return this.styles;
  }
}

/**
 * Concrete Factory - High Contrast Theme Factory
 */
export class HighContrastThemeFactory implements UIComponentFactory {
  readonly themeName = "High Contrast";

  createButton(label: string): Button {
    return new HighContrastButton(label);
  }

  createInput(placeholder: string): Input {
    return new HighContrastInput(placeholder);
  }

  createCard(): Card {
    return new HighContrastCard();
  }

  createCheckbox(label: string): Checkbox {
    return new HighContrastCheckbox(label);
  }
}

// =============================================================================
// APPLICATION / CLIENT CODE
// =============================================================================

/**
 * Application class that uses UI components
 * It's decoupled from concrete component implementations
 */
export class Application {
  private factory: UIComponentFactory;
  private components: {
    buttons: Button[];
    inputs: Input[];
    cards: Card[];
    checkboxes: Checkbox[];
  } = { buttons: [], inputs: [], cards: [], checkboxes: [] };

  constructor(factory: UIComponentFactory) {
    this.factory = factory;
    console.log(`  [App] Initialized with ${factory.themeName} theme`);
  }

  /**
   * Switch to a different theme factory
   */
  setTheme(factory: UIComponentFactory): void {
    this.factory = factory;
    this.components = { buttons: [], inputs: [], cards: [], checkboxes: [] };
    console.log(`  [App] Switched to ${factory.themeName} theme`);
  }

  getThemeName(): string {
    return this.factory.themeName;
  }

  /**
   * Create a login form using the current theme
   */
  createLoginForm(): void {
    console.log(`  [App] Creating login form with ${this.factory.themeName} theme...`);

    const card = this.factory.createCard();
    card.setContent("Login", "Please enter your credentials");

    const usernameInput = this.factory.createInput("Username");
    const passwordInput = this.factory.createInput("Password");
    const rememberMe = this.factory.createCheckbox("Remember me");
    const submitBtn = this.factory.createButton("Sign In");

    this.components.cards.push(card);
    this.components.inputs.push(usernameInput, passwordInput);
    this.components.checkboxes.push(rememberMe);
    this.components.buttons.push(submitBtn);
  }

  /**
   * Render all components
   */
  renderAll(): string[] {
    const rendered: string[] = [];

    this.components.cards.forEach((c) => rendered.push(c.render()));
    this.components.inputs.forEach((i) => rendered.push(i.render()));
    this.components.checkboxes.forEach((cb) => rendered.push(cb.render()));
    this.components.buttons.forEach((b) => rendered.push(b.render()));

    return rendered;
  }
}

/**
 * Helper to get a theme factory by name
 */
export function getThemeFactory(theme: "light" | "dark" | "high-contrast"): UIComponentFactory {
  switch (theme) {
    case "light":
      return new LightThemeFactory();
    case "dark":
      return new DarkThemeFactory();
    case "high-contrast":
      return new HighContrastThemeFactory();
  }
}

/**
 * Format component rendering for display
 */
export function formatComponentList(components: string[]): string {
  return components.map((c) => `    ${c}`).join("\n");
}

