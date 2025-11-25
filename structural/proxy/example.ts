/**
 * PROXY PATTERN - Example
 *
 * Demonstrates various proxy types for image loading.
 */

import {
  HighResolutionImage,
  LazyImageProxy,
  ProtectedImageProxy,
  LoggingImageProxy,
  CachingImageProxy,
  ImageGallery,
  formatImageInfo,
  User,
} from "./index";

function main() {
  console.log("=".repeat(60));
  console.log("PROXY PATTERN - Image Loading System");
  console.log("=".repeat(60));
  console.log();

  // 1. Demonstrate Virtual (Lazy) Proxy
  console.log("1. VIRTUAL PROXY (Lazy Loading)");
  console.log("-".repeat(40));
  console.log();

  console.log("   Creating lazy proxies (images NOT loaded yet):");
  const lazyImage1 = new LazyImageProxy("photo_1920_1080.jpg");
  const lazyImage2 = new LazyImageProxy("banner_3840_2160.png", 3840, 2160);
  console.log();

  console.log("   Getting info (still not loaded):");
  console.log(formatImageInfo(lazyImage1.getInfo()));
  console.log(`   Is loaded? ${lazyImage1.isLoaded()}`);
  console.log();

  console.log("   Now displaying (triggers load):");
  lazyImage1.display();
  console.log();

  console.log(`   Is loaded now? ${lazyImage1.isLoaded()}`);
  console.log();

  // 2. Demonstrate Protection Proxy
  console.log("2. PROTECTION PROXY (Access Control)");
  console.log("-".repeat(40));
  console.log();

  const sensitiveImage = new LazyImageProxy("confidential_1280_720.jpg", 1280, 720);
  const protectedImage = new ProtectedImageProxy(sensitiveImage, ["admin", "editor"]);

  const guestUser: User = { id: "u1", name: "Guest User", role: "guest" };
  const adminUser: User = { id: "u2", name: "Admin User", role: "admin" };

  console.log("   Attempting access without authentication:");
  protectedImage.display();
  console.log();

  console.log("   Attempting access as guest:");
  protectedImage.setUser(guestUser);
  protectedImage.display();
  console.log();

  console.log("   Attempting access as admin:");
  protectedImage.setUser(adminUser);
  protectedImage.display();
  console.log();

  console.log("   Access log:");
  protectedImage.getAccessLog().forEach((log) => {
    const status = log.allowed ? "✓" : "✗";
    console.log(`   ${status} ${log.userId}: ${log.action}`);
  });
  console.log();

  // 3. Demonstrate Logging Proxy
  console.log("3. LOGGING PROXY");
  console.log("-".repeat(40));
  console.log();

  const imageToLog = new LazyImageProxy("tracked_800_600.jpg", 800, 600);
  const loggedImage = new LoggingImageProxy(imageToLog);

  loggedImage.getInfo();
  loggedImage.display();
  loggedImage.getInfo();

  console.log();
  console.log(`   Total operations logged: ${loggedImage.getOperationCount()}`);
  console.log();

  // 4. Demonstrate Caching Proxy
  console.log("4. CACHING PROXY");
  console.log("-".repeat(40));
  console.log();

  CachingImageProxy.clearCache();

  const cachedImage1 = new CachingImageProxy("shared_1024_768.jpg", 1024, 768);
  const cachedImage2 = new CachingImageProxy("shared_1024_768.jpg", 1024, 768); // Same file

  console.log("   First access (cache miss):");
  cachedImage1.display();
  console.log();

  console.log("   Second access to same file (cache hit):");
  cachedImage2.display();
  console.log();

  console.log(`   Cache size: ${CachingImageProxy.getCacheSize()}`);
  console.log(`   Cached files: ${CachingImageProxy.getCachedFilenames().join(", ")}`);
  console.log();

  // 5. Compare Real vs Proxy
  console.log("5. COMPARISON: Real Image vs Proxy");
  console.log("-".repeat(40));
  console.log();

  console.log("   Creating real image (loads immediately):");
  const realImage = new HighResolutionImage("direct_640_480.jpg");
  console.log();

  console.log("   Creating lazy proxy (no load yet):");
  const proxyImage = new LazyImageProxy("deferred_640_480.jpg", 640, 480);
  console.log();

  console.log("   Memory efficient: proxy defers expensive operations");
  console.log();

  // 6. Gallery with mixed proxies
  console.log("6. GALLERY WITH LAZY PROXIES");
  console.log("-".repeat(40));

  const gallery = new ImageGallery("Vacation Photos");
  gallery.addImage(new LazyImageProxy("beach_1920_1080.jpg"));
  gallery.addImage(new LazyImageProxy("mountain_1920_1080.jpg"));
  gallery.addImage(new LazyImageProxy("city_1920_1080.jpg"));

  console.log(`   Added ${gallery.getImageCount()} images to gallery`);
  console.log(`   Loaded: ${gallery.getLoadedCount()} / ${gallery.getImageCount()}`);
  console.log();

  console.log("   Displaying gallery (loads images on demand):");
  gallery.displayAll();
  console.log();

  console.log(`   After display - Loaded: ${gallery.getLoadedCount()} / ${gallery.getImageCount()}`);
  console.log();

  console.log("=".repeat(60));
  console.log("KEY TAKEAWAYS:");
  console.log("- Proxy provides the same interface as the real object");
  console.log("- Virtual Proxy: Defers expensive operations (lazy loading)");
  console.log("- Protection Proxy: Controls access based on permissions");
  console.log("- Logging Proxy: Adds logging without changing the subject");
  console.log("- Caching Proxy: Avoids repeated expensive operations");
  console.log("- Proxies can be stacked/composed for multiple behaviors");
  console.log("=".repeat(60));
}

main();

