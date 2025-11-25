/**
 * PROXY PATTERN
 *
 * Intent: Provide a surrogate or placeholder for another object to control access to it.
 *
 * Real-world example: Image Loading System
 * - High-resolution images are expensive to load and consume memory
 * - A proxy displays a placeholder until the real image is needed
 * - The proxy can also handle caching, access control, and logging
 * - Different proxy types: Virtual (lazy loading), Protection (access control), Logging
 */

/**
 * Subject Interface - Common interface for real images and proxies
 */
export interface Image {
  display(): void;
  getInfo(): ImageInfo;
  isLoaded(): boolean;
}

export interface ImageInfo {
  filename: string;
  width: number;
  height: number;
  format: string;
  sizeBytes: number;
  loadedAt: Date | null;
}

/**
 * Real Subject - The actual high-resolution image
 * This is expensive to create and load
 */
export class HighResolutionImage implements Image {
  private filename: string;
  private width: number;
  private height: number;
  private format: string;
  private sizeBytes: number;
  private pixels: Uint8Array | null = null;
  private loadedAt: Date | null = null;

  constructor(filename: string) {
    this.filename = filename;
    // Parse filename for metadata
    const parts = filename.split("_");
    this.width = parseInt(parts[1]) || 1920;
    this.height = parseInt(parts[2]) || 1080;
    this.format = filename.split(".").pop() || "jpg";
    this.sizeBytes = this.width * this.height * 3; // Approximate RGB size

    // Simulate expensive loading operation
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    console.log(`  [RealImage] Loading ${this.filename}...`);
    console.log(`  [RealImage] Size: ${this.width}x${this.height}`);
    console.log(`  [RealImage] Allocating ${formatBytes(this.sizeBytes)} of memory`);

    // Simulate loading time based on file size
    const loadTime = Math.min(this.sizeBytes / 1000000, 500);
    const start = Date.now();
    while (Date.now() - start < loadTime) {
      // Busy wait to simulate loading
    }

    // Allocate pixel data
    this.pixels = new Uint8Array(Math.min(this.sizeBytes, 1000)); // Limited for demo
    this.loadedAt = new Date();

    console.log(`  [RealImage] ✓ Loaded successfully`);
  }

  display(): void {
    console.log(`  [RealImage] Displaying ${this.filename} at ${this.width}x${this.height}`);
  }

  getInfo(): ImageInfo {
    return {
      filename: this.filename,
      width: this.width,
      height: this.height,
      format: this.format,
      sizeBytes: this.sizeBytes,
      loadedAt: this.loadedAt,
    };
  }

  isLoaded(): boolean {
    return this.pixels !== null;
  }
}

/**
 * Virtual Proxy - Lazy loading proxy
 * Defers loading the real image until it's actually needed
 */
export class LazyImageProxy implements Image {
  private filename: string;
  private realImage: HighResolutionImage | null = null;
  private estimatedWidth: number;
  private estimatedHeight: number;

  constructor(filename: string, estimatedWidth: number = 1920, estimatedHeight: number = 1080) {
    this.filename = filename;
    this.estimatedWidth = estimatedWidth;
    this.estimatedHeight = estimatedHeight;
    console.log(`  [LazyProxy] Created proxy for ${filename} (not loaded yet)`);
  }

  private loadRealImage(): void {
    if (!this.realImage) {
      console.log(`  [LazyProxy] First access - loading real image...`);
      this.realImage = new HighResolutionImage(this.filename);
    }
  }

  display(): void {
    if (!this.realImage) {
      console.log(`  [LazyProxy] Showing placeholder for ${this.filename}`);
      console.log(`  [LazyProxy] ⬜ [Placeholder ${this.estimatedWidth}x${this.estimatedHeight}]`);
      this.loadRealImage();
    }
    this.realImage.display();
  }

  getInfo(): ImageInfo {
    if (this.realImage) {
      return this.realImage.getInfo();
    }
    // Return estimated info without loading
    return {
      filename: this.filename,
      width: this.estimatedWidth,
      height: this.estimatedHeight,
      format: this.filename.split(".").pop() || "jpg",
      sizeBytes: this.estimatedWidth * this.estimatedHeight * 3,
      loadedAt: null,
    };
  }

  isLoaded(): boolean {
    return this.realImage !== null && this.realImage.isLoaded();
  }

  /**
   * Preload the image in the background
   */
  preload(): void {
    if (!this.realImage) {
      console.log(`  [LazyProxy] Preloading ${this.filename}...`);
      this.loadRealImage();
    }
  }
}

/**
 * Protection Proxy - Access control proxy
 * Controls who can access the image based on user permissions
 */
export interface User {
  id: string;
  name: string;
  role: "admin" | "editor" | "viewer" | "guest";
}

export class ProtectedImageProxy implements Image {
  private realImage: Image;
  private currentUser: User | null = null;
  private allowedRoles: Set<string>;
  private accessLog: { userId: string; action: string; timestamp: Date; allowed: boolean }[] = [];

  constructor(image: Image, allowedRoles: string[] = ["admin", "editor", "viewer"]) {
    this.realImage = image;
    this.allowedRoles = new Set(allowedRoles);
  }

  setUser(user: User | null): void {
    this.currentUser = user;
    console.log(`  [ProtectionProxy] User set to: ${user?.name || "none"}`);
  }

  private checkAccess(action: string): boolean {
    const allowed = this.currentUser !== null && this.allowedRoles.has(this.currentUser.role);

    this.accessLog.push({
      userId: this.currentUser?.id || "anonymous",
      action,
      timestamp: new Date(),
      allowed,
    });

    if (!allowed) {
      console.log(`  [ProtectionProxy] ⛔ Access denied for ${action}`);
      if (!this.currentUser) {
        console.log(`  [ProtectionProxy] Reason: No user authenticated`);
      } else {
        console.log(`  [ProtectionProxy] Reason: Role '${this.currentUser.role}' not permitted`);
      }
    }

    return allowed;
  }

  display(): void {
    if (this.checkAccess("display")) {
      console.log(`  [ProtectionProxy] ✓ Access granted to ${this.currentUser!.name}`);
      this.realImage.display();
    }
  }

  getInfo(): ImageInfo {
    // Info is always available
    return this.realImage.getInfo();
  }

  isLoaded(): boolean {
    return this.realImage.isLoaded();
  }

  getAccessLog(): { userId: string; action: string; timestamp: Date; allowed: boolean }[] {
    return [...this.accessLog];
  }
}

/**
 * Logging Proxy - Adds logging to all image operations
 */
export class LoggingImageProxy implements Image {
  private realImage: Image;
  private logs: { operation: string; timestamp: Date; duration?: number }[] = [];

  constructor(image: Image) {
    this.realImage = image;
    this.log("proxy_created");
  }

  private log(operation: string, duration?: number): void {
    this.logs.push({
      operation,
      timestamp: new Date(),
      duration,
    });
    const durationStr = duration !== undefined ? ` (${duration}ms)` : "";
    console.log(`  [LoggingProxy] ${operation}${durationStr}`);
  }

  display(): void {
    const start = Date.now();
    this.realImage.display();
    this.log("display", Date.now() - start);
  }

  getInfo(): ImageInfo {
    const start = Date.now();
    const info = this.realImage.getInfo();
    this.log("getInfo", Date.now() - start);
    return info;
  }

  isLoaded(): boolean {
    return this.realImage.isLoaded();
  }

  getLogs(): { operation: string; timestamp: Date; duration?: number }[] {
    return [...this.logs];
  }

  getOperationCount(): number {
    return this.logs.length;
  }
}

/**
 * Caching Proxy - Caches image data
 */
export class CachingImageProxy implements Image {
  private static cache: Map<string, HighResolutionImage> = new Map();
  private filename: string;
  private estimatedWidth: number;
  private estimatedHeight: number;

  constructor(filename: string, estimatedWidth: number = 1920, estimatedHeight: number = 1080) {
    this.filename = filename;
    this.estimatedWidth = estimatedWidth;
    this.estimatedHeight = estimatedHeight;
  }

  display(): void {
    if (!CachingImageProxy.cache.has(this.filename)) {
      console.log(`  [CachingProxy] Cache miss for ${this.filename}`);
      const image = new HighResolutionImage(this.filename);
      CachingImageProxy.cache.set(this.filename, image);
    } else {
      console.log(`  [CachingProxy] Cache hit for ${this.filename}`);
    }
    CachingImageProxy.cache.get(this.filename)!.display();
  }

  getInfo(): ImageInfo {
    const cached = CachingImageProxy.cache.get(this.filename);
    if (cached) {
      return cached.getInfo();
    }
    return {
      filename: this.filename,
      width: this.estimatedWidth,
      height: this.estimatedHeight,
      format: this.filename.split(".").pop() || "jpg",
      sizeBytes: this.estimatedWidth * this.estimatedHeight * 3,
      loadedAt: null,
    };
  }

  isLoaded(): boolean {
    return CachingImageProxy.cache.has(this.filename);
  }

  static getCacheSize(): number {
    return CachingImageProxy.cache.size;
  }

  static clearCache(): void {
    CachingImageProxy.cache.clear();
    console.log(`  [CachingProxy] Cache cleared`);
  }

  static getCachedFilenames(): string[] {
    return Array.from(CachingImageProxy.cache.keys());
  }
}

/**
 * Image Gallery - Uses images through their common interface
 */
export class ImageGallery {
  private images: Image[] = [];
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  addImage(image: Image): void {
    this.images.push(image);
  }

  displayAll(): void {
    console.log(`\n  🖼️  Gallery: ${this.name}`);
    console.log(`  ${"─".repeat(40)}`);
    this.images.forEach((img, i) => {
      console.log(`\n  Image ${i + 1}:`);
      img.display();
    });
  }

  getImageCount(): number {
    return this.images.length;
  }

  getLoadedCount(): number {
    return this.images.filter((img) => img.isLoaded()).length;
  }
}

/**
 * Helper to format bytes
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Format image info for display
 */
export function formatImageInfo(info: ImageInfo): string {
  const lines = [
    `  📷 ${info.filename}`,
    `  📐 ${info.width}x${info.height} (${info.format})`,
    `  💾 ${formatBytes(info.sizeBytes)}`,
    `  📅 ${info.loadedAt ? `Loaded: ${info.loadedAt.toISOString()}` : "Not loaded"}`,
  ];
  return lines.join("\n");
}

