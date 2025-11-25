/**
 * ADAPTER PATTERN
 *
 * Intent: Convert the interface of a class into another interface clients expect.
 * Adapter lets classes work together that couldn't otherwise because of
 * incompatible interfaces.
 *
 * Real-world example: Payment Gateway Integration
 * - Different payment providers (Stripe, PayPal, Square) have different APIs
 * - Our application needs a unified interface to process payments
 * - Adapters wrap each provider to expose a consistent interface
 */

/**
 * Target Interface - The interface our application expects
 * This is what our code will work with
 */
export interface PaymentProcessor {
  processPayment(amount: number, currency: string): Promise<PaymentResult>;
  refund(transactionId: string, amount: number): Promise<RefundResult>;
  getTransactionStatus(transactionId: string): Promise<TransactionStatus>;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  message: string;
  provider: string;
}

export interface RefundResult {
  success: boolean;
  refundId: string;
  message: string;
}

export type TransactionStatus = "pending" | "completed" | "failed" | "refunded";

/**
 * Adaptee 1 - Stripe API (simulated)
 * This is an external library with its own interface
 */
export class StripeAPI {
  async createCharge(params: {
    amount_cents: number;
    currency: string;
    source: string;
  }): Promise<{ id: string; status: string; paid: boolean }> {
    console.log(`  [Stripe] Creating charge: ${params.amount_cents} cents ${params.currency}`);
    // Simulate API call
    await this.delay(100);
    return {
      id: `ch_${this.generateId()}`,
      status: "succeeded",
      paid: true,
    };
  }

  async createRefund(params: {
    charge: string;
    amount_cents: number;
  }): Promise<{ id: string; status: string }> {
    console.log(`  [Stripe] Refunding charge: ${params.charge}`);
    await this.delay(100);
    return {
      id: `re_${this.generateId()}`,
      status: "succeeded",
    };
  }

  async retrieveCharge(chargeId: string): Promise<{ status: string }> {
    console.log(`  [Stripe] Retrieving charge: ${chargeId}`);
    await this.delay(50);
    return { status: "succeeded" };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}

/**
 * Adaptee 2 - PayPal API (simulated)
 * Different interface than Stripe
 */
export class PayPalSDK {
  async executePayment(
    paymentAmount: number,
    currencyCode: string
  ): Promise<{ paymentId: string; state: string }> {
    console.log(`  [PayPal] Executing payment: ${paymentAmount} ${currencyCode}`);
    await this.wait(150);
    return {
      paymentId: `PAY-${this.createReference()}`,
      state: "approved",
    };
  }

  async refundPayment(
    paymentId: string,
    refundAmount: number
  ): Promise<{ refundId: string; state: string }> {
    console.log(`  [PayPal] Refunding payment: ${paymentId}`);
    await this.wait(150);
    return {
      refundId: `REF-${this.createReference()}`,
      state: "completed",
    };
  }

  async getPaymentDetails(paymentId: string): Promise<{ state: string }> {
    console.log(`  [PayPal] Getting payment details: ${paymentId}`);
    await this.wait(75);
    return { state: "approved" };
  }

  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private createReference(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}

/**
 * Adaptee 3 - Square API (simulated)
 * Yet another different interface
 */
export class SquareClient {
  payments = {
    create: async (request: {
      amountMoney: { amount: bigint; currency: string };
      idempotencyKey: string;
    }): Promise<{ result: { payment: { id: string; status: string } } }> => {
      console.log(`  [Square] Creating payment: ${request.amountMoney.amount} ${request.amountMoney.currency}`);
      await this.pause(120);
      return {
        result: {
          payment: {
            id: `sq_${this.makeId()}`,
            status: "COMPLETED",
          },
        },
      };
    },
  };

  refunds = {
    refund: async (request: {
      paymentId: string;
      amountMoney: { amount: bigint; currency: string };
      idempotencyKey: string;
    }): Promise<{ result: { refund: { id: string; status: string } } }> => {
      console.log(`  [Square] Refunding payment: ${request.paymentId}`);
      await this.pause(120);
      return {
        result: {
          refund: {
            id: `sqr_${this.makeId()}`,
            status: "COMPLETED",
          },
        },
      };
    },
  };

  async getPayment(paymentId: string): Promise<{ result: { payment: { status: string } } }> {
    console.log(`  [Square] Getting payment: ${paymentId}`);
    await this.pause(60);
    return {
      result: {
        payment: { status: "COMPLETED" },
      },
    };
  }

  private pause(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private makeId(): string {
    return Math.random().toString(36).substring(2, 12);
  }
}

/**
 * Adapter 1 - Stripe Adapter
 * Adapts StripeAPI to PaymentProcessor interface
 */
export class StripeAdapter implements PaymentProcessor {
  private stripe: StripeAPI;

  constructor(stripeApi: StripeAPI) {
    this.stripe = stripeApi;
  }

  async processPayment(amount: number, currency: string): Promise<PaymentResult> {
    // Convert dollars to cents (Stripe uses smallest currency unit)
    const amountCents = Math.round(amount * 100);

    const charge = await this.stripe.createCharge({
      amount_cents: amountCents,
      currency: currency.toLowerCase(),
      source: "tok_visa", // Simulated token
    });

    return {
      success: charge.paid,
      transactionId: charge.id,
      message: charge.paid ? "Payment successful" : "Payment failed",
      provider: "Stripe",
    };
  }

  async refund(transactionId: string, amount: number): Promise<RefundResult> {
    const amountCents = Math.round(amount * 100);
    const refund = await this.stripe.createRefund({
      charge: transactionId,
      amount_cents: amountCents,
    });

    return {
      success: refund.status === "succeeded",
      refundId: refund.id,
      message: refund.status === "succeeded" ? "Refund successful" : "Refund failed",
    };
  }

  async getTransactionStatus(transactionId: string): Promise<TransactionStatus> {
    const charge = await this.stripe.retrieveCharge(transactionId);
    const statusMap: Record<string, TransactionStatus> = {
      succeeded: "completed",
      pending: "pending",
      failed: "failed",
    };
    return statusMap[charge.status] || "pending";
  }
}

/**
 * Adapter 2 - PayPal Adapter
 * Adapts PayPalSDK to PaymentProcessor interface
 */
export class PayPalAdapter implements PaymentProcessor {
  private paypal: PayPalSDK;

  constructor(paypalSdk: PayPalSDK) {
    this.paypal = paypalSdk;
  }

  async processPayment(amount: number, currency: string): Promise<PaymentResult> {
    const payment = await this.paypal.executePayment(amount, currency.toUpperCase());

    return {
      success: payment.state === "approved",
      transactionId: payment.paymentId,
      message: payment.state === "approved" ? "Payment approved" : "Payment not approved",
      provider: "PayPal",
    };
  }

  async refund(transactionId: string, amount: number): Promise<RefundResult> {
    const refund = await this.paypal.refundPayment(transactionId, amount);

    return {
      success: refund.state === "completed",
      refundId: refund.refundId,
      message: refund.state === "completed" ? "Refund completed" : "Refund pending",
    };
  }

  async getTransactionStatus(transactionId: string): Promise<TransactionStatus> {
    const details = await this.paypal.getPaymentDetails(transactionId);
    const statusMap: Record<string, TransactionStatus> = {
      approved: "completed",
      created: "pending",
      failed: "failed",
      refunded: "refunded",
    };
    return statusMap[details.state] || "pending";
  }
}

/**
 * Adapter 3 - Square Adapter
 * Adapts SquareClient to PaymentProcessor interface
 */
export class SquareAdapter implements PaymentProcessor {
  private square: SquareClient;

  constructor(squareClient: SquareClient) {
    this.square = squareClient;
  }

  async processPayment(amount: number, currency: string): Promise<PaymentResult> {
    // Square uses smallest currency unit as bigint
    const amountSmallest = BigInt(Math.round(amount * 100));

    const response = await this.square.payments.create({
      amountMoney: { amount: amountSmallest, currency: currency.toUpperCase() },
      idempotencyKey: this.generateIdempotencyKey(),
    });

    const payment = response.result.payment;
    return {
      success: payment.status === "COMPLETED",
      transactionId: payment.id,
      message: payment.status === "COMPLETED" ? "Payment completed" : "Payment processing",
      provider: "Square",
    };
  }

  async refund(transactionId: string, amount: number): Promise<RefundResult> {
    const amountSmallest = BigInt(Math.round(amount * 100));

    const response = await this.square.refunds.refund({
      paymentId: transactionId,
      amountMoney: { amount: amountSmallest, currency: "USD" },
      idempotencyKey: this.generateIdempotencyKey(),
    });

    const refund = response.result.refund;
    return {
      success: refund.status === "COMPLETED",
      refundId: refund.id,
      message: refund.status === "COMPLETED" ? "Refund completed" : "Refund processing",
    };
  }

  async getTransactionStatus(transactionId: string): Promise<TransactionStatus> {
    const response = await this.square.getPayment(transactionId);
    const statusMap: Record<string, TransactionStatus> = {
      COMPLETED: "completed",
      PENDING: "pending",
      FAILED: "failed",
    };
    return statusMap[response.result.payment.status] || "pending";
  }

  private generateIdempotencyKey(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2)}`;
  }
}

