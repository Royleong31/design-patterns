/**
 * OBSERVER PATTERN
 *
 * Intent: Define a one-to-many dependency between objects so that when one
 * object changes state, all its dependents are notified and updated automatically.
 *
 * Real-world example: Newsletter Subscription System
 * - A blog/news site publishes articles
 * - Subscribers (observers) get notified when new content is published
 * - Different types of subscribers can react differently (email, push, SMS)
 * - Subscribers can subscribe/unsubscribe at any time
 */

/**
 * Event data that gets passed to observers
 */
export interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  publishedAt: Date;
}

export interface NotificationEvent {
  type: "new_article" | "article_updated" | "breaking_news";
  article: Article;
}

/**
 * Observer Interface - Subscribers
 * All observers must implement this interface
 */
export interface Subscriber {
  id: string;
  name: string;
  update(event: NotificationEvent): void;
}

/**
 * Subject Interface - Publisher
 * Defines methods for managing subscribers
 */
export interface Publisher {
  subscribe(subscriber: Subscriber): void;
  unsubscribe(subscriberId: string): void;
  notify(event: NotificationEvent): void;
}

/**
 * Concrete Subject - Newsletter Publisher
 */
export class NewsletterPublisher implements Publisher {
  private subscribers: Map<string, Subscriber> = new Map();
  private articles: Article[] = [];
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  subscribe(subscriber: Subscriber): void {
    this.subscribers.set(subscriber.id, subscriber);
    console.log(`  📧 [${this.name}] ${subscriber.name} subscribed`);
  }

  unsubscribe(subscriberId: string): void {
    const subscriber = this.subscribers.get(subscriberId);
    if (subscriber) {
      this.subscribers.delete(subscriberId);
      console.log(`  📧 [${this.name}] ${subscriber.name} unsubscribed`);
    }
  }

  notify(event: NotificationEvent): void {
    console.log(`  📢 [${this.name}] Notifying ${this.subscribers.size} subscribers...`);
    this.subscribers.forEach((subscriber) => {
      subscriber.update(event);
    });
  }

  /**
   * Business logic - publish a new article
   */
  publishArticle(
    title: string,
    summary: string,
    category: string,
    author: string,
    isBreaking: boolean = false
  ): Article {
    const article: Article = {
      id: `art_${Math.random().toString(36).substring(2, 10)}`,
      title,
      summary,
      category,
      author,
      publishedAt: new Date(),
    };

    this.articles.push(article);
    console.log(`\n  📝 [${this.name}] Published: "${title}"`);

    // Notify all subscribers
    this.notify({
      type: isBreaking ? "breaking_news" : "new_article",
      article,
    });

    return article;
  }

  /**
   * Update an existing article
   */
  updateArticle(articleId: string, updates: Partial<Article>): void {
    const article = this.articles.find((a) => a.id === articleId);
    if (article) {
      Object.assign(article, updates);
      console.log(`\n  ✏️ [${this.name}] Updated: "${article.title}"`);

      this.notify({
        type: "article_updated",
        article,
      });
    }
  }

  getSubscriberCount(): number {
    return this.subscribers.size;
  }
}

/**
 * Concrete Observer - Email Subscriber
 * Receives notifications via email
 */
export class EmailSubscriber implements Subscriber {
  id: string;
  name: string;
  email: string;
  private preferences: Set<string>;

  constructor(name: string, email: string, preferredCategories: string[] = []) {
    this.id = `email_${Math.random().toString(36).substring(2, 8)}`;
    this.name = name;
    this.email = email;
    this.preferences = new Set(preferredCategories);
  }

  update(event: NotificationEvent): void {
    // Filter by preferences if set
    if (this.preferences.size > 0 && !this.preferences.has(event.article.category)) {
      return; // Skip if not in preferred categories
    }

    const emoji = event.type === "breaking_news" ? "🚨" : "📬";
    console.log(
      `    ${emoji} [Email → ${this.email}] ${event.type.toUpperCase()}: "${event.article.title}"`
    );
  }
}

/**
 * Concrete Observer - Push Notification Subscriber
 * Receives push notifications on mobile
 */
export class PushSubscriber implements Subscriber {
  id: string;
  name: string;
  deviceToken: string;
  private onlyBreaking: boolean;

  constructor(name: string, deviceToken: string, onlyBreaking: boolean = false) {
    this.id = `push_${Math.random().toString(36).substring(2, 8)}`;
    this.name = name;
    this.deviceToken = deviceToken;
    this.onlyBreaking = onlyBreaking;
  }

  update(event: NotificationEvent): void {
    // Only notify for breaking news if preference is set
    if (this.onlyBreaking && event.type !== "breaking_news") {
      return;
    }

    const emoji = event.type === "breaking_news" ? "🚨" : "📱";
    console.log(
      `    ${emoji} [Push → ${this.name}'s phone] ${event.type.toUpperCase()}: "${event.article.title}"`
    );
  }
}

/**
 * Concrete Observer - SMS Subscriber
 * Receives SMS notifications (premium feature)
 */
export class SMSSubscriber implements Subscriber {
  id: string;
  name: string;
  phoneNumber: string;

  constructor(name: string, phoneNumber: string) {
    this.id = `sms_${Math.random().toString(36).substring(2, 8)}`;
    this.name = name;
    this.phoneNumber = phoneNumber;
  }

  update(event: NotificationEvent): void {
    // SMS only for breaking news to save costs
    if (event.type !== "breaking_news") {
      return;
    }

    console.log(
      `    🚨 [SMS → ${this.phoneNumber}] BREAKING: "${event.article.title}"`
    );
  }
}

/**
 * Concrete Observer - Slack Webhook Subscriber
 * Posts to a Slack channel
 */
export class SlackSubscriber implements Subscriber {
  id: string;
  name: string;
  webhookUrl: string;
  channel: string;

  constructor(name: string, webhookUrl: string, channel: string) {
    this.id = `slack_${Math.random().toString(36).substring(2, 8)}`;
    this.name = name;
    this.webhookUrl = webhookUrl;
    this.channel = channel;
  }

  update(event: NotificationEvent): void {
    const icon = event.type === "breaking_news" ? "🚨" : "📰";
    console.log(
      `    ${icon} [Slack → #${this.channel}] ${event.type}: "${event.article.title}" by ${event.article.author}`
    );
  }
}

/**
 * Concrete Observer - RSS Feed Subscriber
 * Updates an RSS feed
 */
export class RSSSubscriber implements Subscriber {
  id: string;
  name: string;
  feedUrl: string;

  constructor(feedUrl: string) {
    this.id = `rss_${Math.random().toString(36).substring(2, 8)}`;
    this.name = "RSS Feed";
    this.feedUrl = feedUrl;
  }

  update(event: NotificationEvent): void {
    if (event.type === "article_updated") {
      return; // RSS doesn't track updates
    }

    console.log(
      `    📡 [RSS Feed] Added entry: "${event.article.title}" (${event.article.category})`
    );
  }
}

