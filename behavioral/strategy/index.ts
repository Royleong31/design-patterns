/**
 * STRATEGY PATTERN
 *
 * Intent: Define a family of algorithms, encapsulate each one, and make them
 * interchangeable. Strategy lets the algorithm vary independently from clients
 * that use it.
 *
 * Real-world example: Payment Processing
 * - An e-commerce checkout supports multiple payment methods
 * - Each payment method (credit card, PayPal, crypto) has different logic
 * - The checkout system can switch between strategies at runtime
 * - New payment methods can be added without changing the checkout code
 */

/**
 * Payment details shared across strategies
 */
export interface PaymentDetails {
  amount: number;
  currency: string;
  orderId: string;
  customerEmail: string;
}

/**
 * Result of a payment operation
 */
export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  message: string;
  processingFee: number;
  netAmount: number;
}

/**
 * Strategy Interface - Payment Strategy
 * All payment strategies must implement this interface
 */
export interface PaymentStrategy {
  readonly name: string;
  readonly feePercentage: number;
  pay(details: PaymentDetails): Promise<PaymentResponse>;
  validate(details: PaymentDetails): boolean;
  getDescription(): string;
}

/**
 * Concrete Strategy - Credit Card Payment
 */
export class CreditCardStrategy implements PaymentStrategy {
  readonly name = "Credit Card";
  readonly feePercentage = 2.9; // 2.9% + $0.30 typical

  private cardNumber: string;
  private expiryDate: string;
  private cvv: string;
  private cardholderName: string;

  constructor(
    cardNumber: string,
    expiryDate: string,
    cvv: string,
    cardholderName: string
  ) {
    this.cardNumber = cardNumber;
    this.expiryDate = expiryDate;
    this.cvv = cvv;
    this.cardholderName = cardholderName;
  }

  async pay(details: PaymentDetails): Promise<PaymentResponse> {
    console.log(`  💳 [Credit Card] Processing $${details.amount.toFixed(2)}...`);
    console.log(`     Card: **** **** **** ${this.cardNumber.slice(-4)}`);
    console.log(`     Cardholder: ${this.cardholderName}`);

    // Simulate processing time
    await this.delay(500);

    const fee = (details.amount * this.feePercentage) / 100 + 0.3;
    const netAmount = details.amount - fee;

    console.log(`     Processing fee: $${fee.toFixed(2)} (${this.feePercentage}% + $0.30)`);

    return {
      success: true,
      transactionId: `cc_${this.generateId()}`,
      message: "Payment approved",
      processingFee: fee,
      netAmount,
    };
  }

  validate(details: PaymentDetails): boolean {
    // Basic validation
    if (this.cardNumber.length < 13 || this.cardNumber.length > 19) {
      return false;
    }
    if (!/^\d{3,4}$/.test(this.cvv)) {
      return false;
    }
    return details.amount > 0;
  }

  getDescription(): string {
    return `Pay with Credit Card ending in ${this.cardNumber.slice(-4)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}

/**
 * Concrete Strategy - PayPal Payment
 */
export class PayPalStrategy implements PaymentStrategy {
  readonly name = "PayPal";
  readonly feePercentage = 3.49;

  private email: string;
  private isLoggedIn: boolean = false;

  constructor(email: string) {
    this.email = email;
  }

  async pay(details: PaymentDetails): Promise<PaymentResponse> {
    console.log(`  🅿️ [PayPal] Processing $${details.amount.toFixed(2)}...`);
    console.log(`     Account: ${this.email}`);

    // Simulate OAuth flow
    if (!this.isLoggedIn) {
      console.log(`     Authenticating with PayPal...`);
      await this.delay(300);
      this.isLoggedIn = true;
    }

    await this.delay(400);

    const fee = (details.amount * this.feePercentage) / 100 + 0.49;
    const netAmount = details.amount - fee;

    console.log(`     Processing fee: $${fee.toFixed(2)} (${this.feePercentage}% + $0.49)`);

    return {
      success: true,
      transactionId: `PP-${this.generateId().toUpperCase()}`,
      message: "Payment completed via PayPal",
      processingFee: fee,
      netAmount,
    };
  }

  validate(details: PaymentDetails): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email) && details.amount > 0;
  }

  getDescription(): string {
    return `Pay with PayPal (${this.email})`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 12);
  }
}

/**
 * Concrete Strategy - Cryptocurrency Payment
 */
export class CryptoStrategy implements PaymentStrategy {
  readonly name = "Cryptocurrency";
  readonly feePercentage = 1.0; // Lower fees typically

  private walletAddress: string;
  private cryptoType: "BTC" | "ETH" | "USDC";
  private exchangeRate: number;

  constructor(
    walletAddress: string,
    cryptoType: "BTC" | "ETH" | "USDC",
    exchangeRate: number
  ) {
    this.walletAddress = walletAddress;
    this.cryptoType = cryptoType;
    this.exchangeRate = exchangeRate;
  }

  async pay(details: PaymentDetails): Promise<PaymentResponse> {
    const cryptoAmount = details.amount / this.exchangeRate;

    console.log(`  ₿ [Crypto] Processing $${details.amount.toFixed(2)}...`);
    console.log(`     Amount in ${this.cryptoType}: ${cryptoAmount.toFixed(8)}`);
    console.log(`     Wallet: ${this.walletAddress.substring(0, 10)}...`);

    // Simulate blockchain confirmation
    console.log(`     Waiting for blockchain confirmation...`);
    await this.delay(800);

    const fee = (details.amount * this.feePercentage) / 100;
    const netAmount = details.amount - fee;

    console.log(`     Network fee: $${fee.toFixed(2)} (${this.feePercentage}%)`);

    return {
      success: true,
      transactionId: `0x${this.generateTxHash()}`,
      message: `Payment of ${cryptoAmount.toFixed(8)} ${this.cryptoType} confirmed`,
      processingFee: fee,
      netAmount,
    };
  }

  validate(details: PaymentDetails): boolean {
    // Basic wallet address validation
    if (this.cryptoType === "BTC") {
      return this.walletAddress.length >= 26 && details.amount > 0;
    }
    return this.walletAddress.startsWith("0x") && details.amount > 0;
  }

  getDescription(): string {
    return `Pay with ${this.cryptoType} to ${this.walletAddress.substring(0, 10)}...`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private generateTxHash(): string {
    return [...Array(64)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");
  }
}

/**
 * Concrete Strategy - Bank Transfer (ACH)
 */
export class BankTransferStrategy implements PaymentStrategy {
  readonly name = "Bank Transfer";
  readonly feePercentage = 0.8; // Very low fees

  private routingNumber: string;
  private accountNumber: string;
  private accountName: string;

  constructor(routingNumber: string, accountNumber: string, accountName: string) {
    this.routingNumber = routingNumber;
    this.accountNumber = accountNumber;
    this.accountName = accountName;
  }

  async pay(details: PaymentDetails): Promise<PaymentResponse> {
    console.log(`  🏦 [Bank Transfer] Processing $${details.amount.toFixed(2)}...`);
    console.log(`     Account: ****${this.accountNumber.slice(-4)}`);
    console.log(`     Name: ${this.accountName}`);

    // Bank transfers are slower
    console.log(`     Initiating ACH transfer...`);
    await this.delay(600);

    const fee = (details.amount * this.feePercentage) / 100;
    const netAmount = details.amount - fee;

    console.log(`     Processing fee: $${fee.toFixed(2)} (${this.feePercentage}%)`);
    console.log(`     Note: Transfer will complete in 1-3 business days`);

    return {
      success: true,
      transactionId: `ACH-${this.generateId()}`,
      message: "Bank transfer initiated (1-3 business days)",
      processingFee: fee,
      netAmount,
    };
  }

  validate(details: PaymentDetails): boolean {
    return (
      this.routingNumber.length === 9 &&
      this.accountNumber.length >= 4 &&
      details.amount > 0
    );
  }

  getDescription(): string {
    return `Pay via Bank Transfer (****${this.accountNumber.slice(-4)})`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private generateId(): string {
    return Date.now().toString(36).toUpperCase();
  }
}

/**
 * Concrete Strategy - Apple Pay
 */
export class ApplePayStrategy implements PaymentStrategy {
  readonly name = "Apple Pay";
  readonly feePercentage = 2.9;

  private deviceId: string;

  constructor(deviceId: string) {
    this.deviceId = deviceId;
  }

  async pay(details: PaymentDetails): Promise<PaymentResponse> {
    console.log(`  🍎 [Apple Pay] Processing $${details.amount.toFixed(2)}...`);
    console.log(`     Requesting Face ID / Touch ID authentication...`);

    await this.delay(400);
    console.log(`     ✓ Authenticated`);

    await this.delay(200);

    const fee = (details.amount * this.feePercentage) / 100 + 0.3;
    const netAmount = details.amount - fee;

    console.log(`     Processing fee: $${fee.toFixed(2)} (${this.feePercentage}% + $0.30)`);

    return {
      success: true,
      transactionId: `APPLE-${this.generateId().toUpperCase()}`,
      message: "Payment approved via Apple Pay",
      processingFee: fee,
      netAmount,
    };
  }

  validate(details: PaymentDetails): boolean {
    return this.deviceId.length > 0 && details.amount > 0;
  }

  getDescription(): string {
    return "Pay with Apple Pay";
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 10);
  }
}

/**
 * Context - Shopping Cart / Checkout System
 * Uses a payment strategy to process payments
 */
export class ShoppingCart {
  private items: { name: string; price: number; quantity: number }[] = [];
  private paymentStrategy: PaymentStrategy | null = null;
  private customerEmail: string;

  constructor(customerEmail: string) {
    this.customerEmail = customerEmail;
  }

  addItem(name: string, price: number, quantity: number = 1): void {
    this.items.push({ name, price, quantity });
  }

  removeItem(name: string): void {
    this.items = this.items.filter((item) => item.name !== name);
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getItems(): { name: string; price: number; quantity: number }[] {
    return [...this.items];
  }

  /**
   * Set the payment strategy - can be changed at runtime
   */
  setPaymentStrategy(strategy: PaymentStrategy): void {
    this.paymentStrategy = strategy;
    console.log(`  🔄 Payment method set to: ${strategy.name}`);
  }

  getPaymentStrategy(): PaymentStrategy | null {
    return this.paymentStrategy;
  }

  /**
   * Process checkout using the current strategy
   */
  async checkout(): Promise<PaymentResponse | null> {
    if (!this.paymentStrategy) {
      console.log("  ❌ Error: No payment method selected!");
      return null;
    }

    if (this.items.length === 0) {
      console.log("  ❌ Error: Cart is empty!");
      return null;
    }

    const total = this.getTotal();
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;

    const paymentDetails: PaymentDetails = {
      amount: total,
      currency: "USD",
      orderId,
      customerEmail: this.customerEmail,
    };

    // Validate payment details
    if (!this.paymentStrategy.validate(paymentDetails)) {
      console.log("  ❌ Error: Payment validation failed!");
      return null;
    }

    console.log(`\n  📦 Order ${orderId}`);
    console.log(`  📧 Customer: ${this.customerEmail}`);
    console.log(`  💵 Total: $${total.toFixed(2)}`);
    console.log();

    // Process payment using the strategy
    const result = await this.paymentStrategy.pay(paymentDetails);

    if (result.success) {
      this.items = []; // Clear cart after successful payment
    }

    return result;
  }

  /**
   * Display available payment options
   */
  static displayPaymentOptions(strategies: PaymentStrategy[]): void {
    console.log("\nAvailable payment methods:");
    strategies.forEach((strategy, index) => {
      console.log(`  ${index + 1}. ${strategy.getDescription()}`);
      console.log(`     Fee: ${strategy.feePercentage}%`);
    });
  }
}

