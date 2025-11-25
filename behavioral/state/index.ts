/**
 * STATE PATTERN
 *
 * Intent: Allow an object to alter its behavior when its internal state changes.
 * The object will appear to change its class.
 *
 * Real-world example: Order Processing System
 * - An order goes through various states: Pending, Paid, Shipped, Delivered, Cancelled
 * - Each state has different allowed actions and behaviors
 * - The order delegates behavior to its current state object
 * - State transitions are managed by the states themselves
 */

/**
 * Context - Order
 * Maintains a reference to the current state and delegates state-specific behavior
 */
export class Order {
  private state: OrderState;
  private orderId: string;
  private items: { name: string; price: number; quantity: number }[] = [];
  private shippingAddress: string = "";
  private trackingNumber: string | null = null;
  private stateHistory: { state: string; timestamp: Date }[] = [];

  constructor(orderId: string) {
    this.orderId = orderId;
    this.state = new PendingState();
    this.recordStateChange("Pending");
    console.log(`  [Order ${orderId}] Created in Pending state`);
  }

  // State management
  setState(state: OrderState): void {
    this.state = state;
    this.recordStateChange(state.getName());
    console.log(`  [Order ${this.orderId}] State changed to: ${state.getName()}`);
  }

  getState(): OrderState {
    return this.state;
  }

  getStateName(): string {
    return this.state.getName();
  }

  private recordStateChange(stateName: string): void {
    this.stateHistory.push({ state: stateName, timestamp: new Date() });
  }

  getStateHistory(): { state: string; timestamp: Date }[] {
    return [...this.stateHistory];
  }

  // Order data
  getOrderId(): string {
    return this.orderId;
  }

  addItem(name: string, price: number, quantity: number = 1): void {
    this.items.push({ name, price, quantity });
  }

  getItems(): { name: string; price: number; quantity: number }[] {
    return [...this.items];
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  setShippingAddress(address: string): void {
    this.shippingAddress = address;
  }

  getShippingAddress(): string {
    return this.shippingAddress;
  }

  setTrackingNumber(tracking: string): void {
    this.trackingNumber = tracking;
  }

  getTrackingNumber(): string | null {
    return this.trackingNumber;
  }

  // Delegated behaviors - these delegate to the current state
  pay(): void {
    this.state.pay(this);
  }

  ship(): void {
    this.state.ship(this);
  }

  deliver(): void {
    this.state.deliver(this);
  }

  cancel(): void {
    this.state.cancel(this);
  }

  refund(): void {
    this.state.refund(this);
  }
}

/**
 * State Interface - Declares methods for each possible action
 */
export interface OrderState {
  getName(): string;
  pay(order: Order): void;
  ship(order: Order): void;
  deliver(order: Order): void;
  cancel(order: Order): void;
  refund(order: Order): void;
}

/**
 * Concrete State - Pending
 * Order has been created but not yet paid
 */
export class PendingState implements OrderState {
  getName(): string {
    return "Pending";
  }

  pay(order: Order): void {
    if (order.getTotal() <= 0) {
      console.log(`  [Pending] Cannot pay - order is empty`);
      return;
    }
    console.log(`  [Pending] Processing payment of $${order.getTotal().toFixed(2)}...`);
    console.log(`  [Pending] Payment successful!`);
    order.setState(new PaidState());
  }

  ship(order: Order): void {
    console.log(`  [Pending] Cannot ship - order must be paid first`);
  }

  deliver(order: Order): void {
    console.log(`  [Pending] Cannot deliver - order must be shipped first`);
  }

  cancel(order: Order): void {
    console.log(`  [Pending] Cancelling order...`);
    order.setState(new CancelledState());
  }

  refund(order: Order): void {
    console.log(`  [Pending] Cannot refund - order hasn't been paid`);
  }
}

/**
 * Concrete State - Paid
 * Payment received, ready for shipping
 */
export class PaidState implements OrderState {
  getName(): string {
    return "Paid";
  }

  pay(order: Order): void {
    console.log(`  [Paid] Order has already been paid`);
  }

  ship(order: Order): void {
    if (!order.getShippingAddress()) {
      console.log(`  [Paid] Cannot ship - no shipping address provided`);
      return;
    }
    const tracking = `TRK${Date.now().toString(36).toUpperCase()}`;
    order.setTrackingNumber(tracking);
    console.log(`  [Paid] Shipping to: ${order.getShippingAddress()}`);
    console.log(`  [Paid] Tracking number: ${tracking}`);
    order.setState(new ShippedState());
  }

  deliver(order: Order): void {
    console.log(`  [Paid] Cannot deliver - order must be shipped first`);
  }

  cancel(order: Order): void {
    console.log(`  [Paid] Cancelling paid order - initiating refund...`);
    order.setState(new CancelledState());
  }

  refund(order: Order): void {
    console.log(`  [Paid] Processing refund of $${order.getTotal().toFixed(2)}...`);
    console.log(`  [Paid] Refund successful!`);
    order.setState(new RefundedState());
  }
}

/**
 * Concrete State - Shipped
 * Order is in transit
 */
export class ShippedState implements OrderState {
  getName(): string {
    return "Shipped";
  }

  pay(order: Order): void {
    console.log(`  [Shipped] Order has already been paid`);
  }

  ship(order: Order): void {
    console.log(`  [Shipped] Order has already been shipped`);
    console.log(`  [Shipped] Tracking: ${order.getTrackingNumber()}`);
  }

  deliver(order: Order): void {
    console.log(`  [Shipped] Package delivered to: ${order.getShippingAddress()}`);
    order.setState(new DeliveredState());
  }

  cancel(order: Order): void {
    console.log(`  [Shipped] Cannot cancel - order is already in transit`);
    console.log(`  [Shipped] Please wait for delivery and request a return`);
  }

  refund(order: Order): void {
    console.log(`  [Shipped] Cannot refund while in transit`);
    console.log(`  [Shipped] Please wait for delivery and request a return`);
  }
}

/**
 * Concrete State - Delivered
 * Order has been delivered to customer
 */
export class DeliveredState implements OrderState {
  getName(): string {
    return "Delivered";
  }

  pay(order: Order): void {
    console.log(`  [Delivered] Order has already been paid`);
  }

  ship(order: Order): void {
    console.log(`  [Delivered] Order has already been delivered`);
  }

  deliver(order: Order): void {
    console.log(`  [Delivered] Order has already been delivered`);
  }

  cancel(order: Order): void {
    console.log(`  [Delivered] Cannot cancel delivered order`);
    console.log(`  [Delivered] Please request a refund instead`);
  }

  refund(order: Order): void {
    console.log(`  [Delivered] Processing return and refund...`);
    console.log(`  [Delivered] Refund of $${order.getTotal().toFixed(2)} initiated`);
    order.setState(new RefundedState());
  }
}

/**
 * Concrete State - Cancelled
 * Order has been cancelled
 */
export class CancelledState implements OrderState {
  getName(): string {
    return "Cancelled";
  }

  pay(order: Order): void {
    console.log(`  [Cancelled] Cannot pay - order has been cancelled`);
  }

  ship(order: Order): void {
    console.log(`  [Cancelled] Cannot ship - order has been cancelled`);
  }

  deliver(order: Order): void {
    console.log(`  [Cancelled] Cannot deliver - order has been cancelled`);
  }

  cancel(order: Order): void {
    console.log(`  [Cancelled] Order is already cancelled`);
  }

  refund(order: Order): void {
    console.log(`  [Cancelled] No refund needed - order was cancelled before payment`);
  }
}

/**
 * Concrete State - Refunded
 * Order has been refunded
 */
export class RefundedState implements OrderState {
  getName(): string {
    return "Refunded";
  }

  pay(order: Order): void {
    console.log(`  [Refunded] Cannot pay - order has been refunded`);
  }

  ship(order: Order): void {
    console.log(`  [Refunded] Cannot ship - order has been refunded`);
  }

  deliver(order: Order): void {
    console.log(`  [Refunded] Cannot deliver - order has been refunded`);
  }

  cancel(order: Order): void {
    console.log(`  [Refunded] Order is already refunded`);
  }

  refund(order: Order): void {
    console.log(`  [Refunded] Order has already been refunded`);
  }
}

/**
 * Helper to format order info
 */
export function formatOrderInfo(order: Order): string {
  const items = order.getItems();
  const lines = [
    `  📦 Order: ${order.getOrderId()}`,
    `  📊 Status: ${order.getStateName()}`,
    `  💵 Total: $${order.getTotal().toFixed(2)}`,
    `  📍 Ship to: ${order.getShippingAddress() || "Not set"}`,
  ];

  if (order.getTrackingNumber()) {
    lines.push(`  🚚 Tracking: ${order.getTrackingNumber()}`);
  }

  if (items.length > 0) {
    lines.push(`  📋 Items:`);
    items.forEach((item) => {
      lines.push(`     - ${item.name} x${item.quantity} ($${(item.price * item.quantity).toFixed(2)})`);
    });
  }

  return lines.join("\n");
}

/**
 * Format state history
 */
export function formatStateHistory(order: Order): string {
  const history = order.getStateHistory();
  return history
    .map((h, i) => `  ${i + 1}. ${h.state} (${h.timestamp.toLocaleTimeString()})`)
    .join("\n");
}

