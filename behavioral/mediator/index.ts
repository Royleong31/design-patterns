/**
 * MEDIATOR PATTERN
 *
 * Intent: Define an object that encapsulates how a set of objects interact.
 * Mediator promotes loose coupling by keeping objects from referring to each
 * other explicitly, and lets you vary their interaction independently.
 *
 * Real-world example: Chat Room System
 * - Users communicate through a chat room (mediator) rather than directly
 * - The chat room handles message routing, user management, notifications
 * - Users don't need to know about each other's implementation
 * - Adding features (private messages, mentions) only changes the mediator
 */

/**
 * Mediator Interface - Chat Room
 */
export interface ChatMediator {
  register(user: ChatUser): void;
  sendMessage(message: string, sender: ChatUser, recipient?: ChatUser): void;
  sendPrivateMessage(message: string, sender: ChatUser, recipient: ChatUser): void;
  broadcastMessage(message: string, sender: ChatUser): void;
  getOnlineUsers(): ChatUser[];
  notifyUserJoined(user: ChatUser): void;
  notifyUserLeft(user: ChatUser): void;
}

/**
 * Colleague Interface - Chat User
 */
export abstract class ChatUser {
  protected mediator: ChatMediator | null = null;
  protected name: string;
  protected userId: string;
  protected messages: { from: string; content: string; timestamp: Date; isPrivate: boolean }[] = [];
  protected online: boolean = false;

  constructor(name: string) {
    this.name = name;
    this.userId = `user_${Math.random().toString(36).substring(7)}`;
  }

  setMediator(mediator: ChatMediator): void {
    this.mediator = mediator;
  }

  getName(): string {
    return this.name;
  }

  getUserId(): string {
    return this.userId;
  }

  isOnline(): boolean {
    return this.online;
  }

  setOnline(status: boolean): void {
    this.online = status;
  }

  getMessageCount(): number {
    return this.messages.length;
  }

  getMessages(): { from: string; content: string; timestamp: Date; isPrivate: boolean }[] {
    return [...this.messages];
  }

  // Abstract methods that concrete users must implement
  abstract send(message: string, to?: ChatUser): void;
  abstract receive(message: string, from: ChatUser, isPrivate?: boolean): void;
}

/**
 * Concrete Colleague - Regular User
 */
export class RegularUser extends ChatUser {
  constructor(name: string) {
    super(name);
  }

  send(message: string, to?: ChatUser): void {
    if (!this.mediator) {
      console.log(`  [${this.name}] Not connected to any chat room`);
      return;
    }

    if (to) {
      console.log(`  [${this.name}] Sending private message to ${to.getName()}`);
      this.mediator.sendPrivateMessage(message, this, to);
    } else {
      console.log(`  [${this.name}] Sending message to room`);
      this.mediator.sendMessage(message, this);
    }
  }

  receive(message: string, from: ChatUser, isPrivate: boolean = false): void {
    const prefix = isPrivate ? "🔒 [Private]" : "💬";
    console.log(`  [${this.name}] ${prefix} ${from.getName()}: ${message}`);

    this.messages.push({
      from: from.getName(),
      content: message,
      timestamp: new Date(),
      isPrivate,
    });
  }

  sendBroadcast(message: string): void {
    if (!this.mediator) {
      console.log(`  [${this.name}] Not connected to any chat room`);
      return;
    }
    console.log(`  [${this.name}] Broadcasting message to all users`);
    this.mediator.broadcastMessage(message, this);
  }
}

/**
 * Concrete Colleague - Admin User
 * Has additional capabilities like kicking users, announcements
 */
export class AdminUser extends ChatUser {
  constructor(name: string) {
    super(name);
  }

  send(message: string, to?: ChatUser): void {
    if (!this.mediator) {
      console.log(`  [Admin:${this.name}] Not connected to any chat room`);
      return;
    }

    if (to) {
      console.log(`  [Admin:${this.name}] Sending private message to ${to.getName()}`);
      this.mediator.sendPrivateMessage(message, this, to);
    } else {
      console.log(`  [Admin:${this.name}] Sending message to room`);
      this.mediator.sendMessage(message, this);
    }
  }

  receive(message: string, from: ChatUser, isPrivate: boolean = false): void {
    const prefix = isPrivate ? "🔒 [Private]" : "💬";
    console.log(`  [Admin:${this.name}] ${prefix} ${from.getName()}: ${message}`);

    this.messages.push({
      from: from.getName(),
      content: message,
      timestamp: new Date(),
      isPrivate,
    });
  }

  announce(message: string): void {
    if (!this.mediator) {
      console.log(`  [Admin:${this.name}] Not connected to any chat room`);
      return;
    }
    console.log(`  [Admin:${this.name}] 📢 Making announcement`);
    this.mediator.broadcastMessage(`📢 ANNOUNCEMENT: ${message}`, this);
  }

  listOnlineUsers(): void {
    if (!this.mediator) {
      console.log(`  [Admin:${this.name}] Not connected to any chat room`);
      return;
    }
    const users = this.mediator.getOnlineUsers();
    console.log(`  [Admin:${this.name}] Online users (${users.length}):`);
    users.forEach((u) => console.log(`    - ${u.getName()}`));
  }
}

/**
 * Concrete Colleague - Bot User
 * Automated responses and commands
 */
export class BotUser extends ChatUser {
  private commands: Map<string, (args: string) => string> = new Map();

  constructor(name: string) {
    super(name);
    this.initCommands();
  }

  private initCommands(): void {
    this.commands.set("!help", () => "Available commands: !help, !time, !users, !joke");
    this.commands.set("!time", () => `Current time: ${new Date().toLocaleTimeString()}`);
    this.commands.set("!joke", () => "Why do programmers prefer dark mode? Because light attracts bugs! 🐛");
    this.commands.set("!users", () => {
      if (this.mediator) {
        const count = this.mediator.getOnlineUsers().length;
        return `There are ${count} users online`;
      }
      return "Unable to get user count";
    });
  }

  send(message: string, to?: ChatUser): void {
    if (!this.mediator) return;

    if (to) {
      this.mediator.sendPrivateMessage(message, this, to);
    } else {
      this.mediator.sendMessage(message, this);
    }
  }

  receive(message: string, from: ChatUser, isPrivate: boolean = false): void {
    this.messages.push({
      from: from.getName(),
      content: message,
      timestamp: new Date(),
      isPrivate,
    });

    // Check for commands
    if (message.startsWith("!")) {
      const command = message.split(" ")[0];
      const args = message.substring(command.length).trim();

      if (this.commands.has(command)) {
        const response = this.commands.get(command)!(args);
        console.log(`  [Bot:${this.name}] 🤖 Responding to ${command}`);

        // Reply to the command
        setTimeout(() => {
          this.send(response, isPrivate ? from : undefined);
        }, 100);
      }
    }
  }
}

/**
 * Concrete Mediator - Chat Room
 */
export class ChatRoom implements ChatMediator {
  private name: string;
  private users: Map<string, ChatUser> = new Map();
  private messageHistory: { sender: string; content: string; timestamp: Date }[] = [];

  constructor(name: string) {
    this.name = name;
    console.log(`  [ChatRoom] "${name}" created`);
  }

  getName(): string {
    return this.name;
  }

  register(user: ChatUser): void {
    user.setMediator(this);
    user.setOnline(true);
    this.users.set(user.getUserId(), user);
    console.log(`  [ChatRoom] ${user.getName()} joined the room`);
    this.notifyUserJoined(user);
  }

  unregister(user: ChatUser): void {
    user.setOnline(false);
    this.users.delete(user.getUserId());
    console.log(`  [ChatRoom] ${user.getName()} left the room`);
    this.notifyUserLeft(user);
  }

  sendMessage(message: string, sender: ChatUser, recipient?: ChatUser): void {
    this.messageHistory.push({
      sender: sender.getName(),
      content: message,
      timestamp: new Date(),
    });

    // Send to all other users except sender
    this.users.forEach((user) => {
      if (user.getUserId() !== sender.getUserId()) {
        user.receive(message, sender, false);
      }
    });
  }

  sendPrivateMessage(message: string, sender: ChatUser, recipient: ChatUser): void {
    if (!this.users.has(recipient.getUserId())) {
      console.log(`  [ChatRoom] User ${recipient.getName()} not found`);
      return;
    }
    recipient.receive(message, sender, true);
  }

  broadcastMessage(message: string, sender: ChatUser): void {
    console.log(`  [ChatRoom] 📣 Broadcasting from ${sender.getName()}`);
    this.users.forEach((user) => {
      user.receive(message, sender, false);
    });
  }

  getOnlineUsers(): ChatUser[] {
    return Array.from(this.users.values()).filter((u) => u.isOnline());
  }

  notifyUserJoined(user: ChatUser): void {
    this.users.forEach((u) => {
      if (u.getUserId() !== user.getUserId()) {
        console.log(`  [ChatRoom] Notifying ${u.getName()}: ${user.getName()} has joined`);
      }
    });
  }

  notifyUserLeft(user: ChatUser): void {
    this.users.forEach((u) => {
      console.log(`  [ChatRoom] Notifying ${u.getName()}: ${user.getName()} has left`);
    });
  }

  getMessageHistory(): { sender: string; content: string; timestamp: Date }[] {
    return [...this.messageHistory];
  }

  getUserCount(): number {
    return this.users.size;
  }
}

/**
 * Format user info
 */
export function formatUserInfo(user: ChatUser): string {
  return `  👤 ${user.getName()} (${user.isOnline() ? "🟢 online" : "🔴 offline"}) - ${user.getMessageCount()} messages`;
}

/**
 * Format chat room info
 */
export function formatRoomInfo(room: ChatRoom): string {
  const users = room.getOnlineUsers();
  const history = room.getMessageHistory();
  return [
    `  🏠 Chat Room: ${room.getName()}`,
    `  👥 Users online: ${users.length}`,
    `  💬 Total messages: ${history.length}`,
  ].join("\n");
}

