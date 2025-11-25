/**
 * COMPOSITE PATTERN - Example
 *
 * Demonstrates the File System composite in action.
 */

import {
  Directory,
  File,
  createSampleFileSystem,
  formatSize,
  formatStats,
} from "./index";

function main() {
  console.log("=".repeat(60));
  console.log("COMPOSITE PATTERN - File System");
  console.log("=".repeat(60));
  console.log();

  // Create a sample file system
  console.log("1. Creating sample file system structure...");
  const root = createSampleFileSystem();
  console.log();

  // Print the entire tree
  console.log("2. Printing directory tree:");
  root.print("   ");
  console.log();

  // Get directory statistics
  console.log("3. Directory statistics:");
  const stats = root.getStats();
  console.log(formatStats(stats));
  console.log();

  // Demonstrate uniform treatment of files and directories
  console.log("4. Uniform treatment - getSize() works on both:");
  const srcDir = root.getChildren().find((c) => c.getName() === "src");
  const packageJson = root.getChildren().find((c) => c.getName() === "package.json");

  if (srcDir && packageJson) {
    console.log(`   src/ (directory): ${formatSize(srcDir.getSize())}`);
    console.log(`   package.json (file): ${formatSize(packageJson.getSize())}`);
  }
  console.log();

  // Search functionality
  console.log("5. Searching for 'index'...");
  const searchResults = root.search("index");
  console.log(`   Found ${searchResults.length} matches:`);
  searchResults.forEach((node) => {
    console.log(`   - ${node.getPath()} (${node.getType()})`);
  });
  console.log();

  // Find files by extension
  console.log("6. Finding all .tsx files...");
  if (root instanceof Directory) {
    const tsxFiles = root.findByExtension("tsx");
    console.log(`   Found ${tsxFiles.length} TypeScript React files:`);
    tsxFiles.forEach((file) => {
      console.log(`   - ${file.getPath()} (${formatSize(file.getSize())})`);
    });
  }
  console.log();

  // Add new content dynamically
  console.log("7. Adding new directory and files...");
  const testsDir = new Directory("tests");
  testsDir.add(new File("Button.test.tsx", 1024));
  testsDir.add(new File("Card.test.tsx", 768));
  testsDir.add(new File("setup.ts", 256));
  root.add(testsDir);

  console.log("   Added tests/ directory with 3 files");
  console.log(`   New total size: ${formatSize(root.getSize())}`);
  console.log();

  // Print updated tree
  console.log("8. Updated directory tree:");
  root.print("   ");
  console.log();

  // Demonstrate recursive operations on nested structure
  console.log("9. Getting all files recursively...");
  if (root instanceof Directory) {
    const allFiles = root.getAllFiles();
    console.log(`   Total files in project: ${allFiles.length}`);
    console.log(`   Largest file: ${findLargestFile(allFiles)}`);
    console.log(`   Smallest file: ${findSmallestFile(allFiles)}`);
  }
  console.log();

  // Show path building
  console.log("10. Path construction:");
  if (root instanceof Directory) {
    const deepFile = root.findByExtension("tsx")[0];
    if (deepFile) {
      console.log(`   File: ${deepFile.getName()}`);
      console.log(`   Full path: ${deepFile.getPath()}`);
    }
  }
  console.log();

  console.log("=".repeat(60));
  console.log("KEY TAKEAWAYS:");
  console.log("- Files (leaves) and Directories (composites) share same interface");
  console.log("- getSize() works uniformly - files return size, dirs sum children");
  console.log("- Tree operations (search, print) naturally recurse through structure");
  console.log("- Clients can treat individual objects and compositions the same way");
  console.log("- New components can be added without changing existing code");
  console.log("=".repeat(60));
}

/**
 * Helper to find the largest file
 */
function findLargestFile(files: File[]): string {
  if (files.length === 0) return "none";
  const largest = files.reduce((max, f) => (f.getSize() > max.getSize() ? f : max));
  return `${largest.getName()} (${formatSize(largest.getSize())})`;
}

/**
 * Helper to find the smallest file
 */
function findSmallestFile(files: File[]): string {
  if (files.length === 0) return "none";
  const smallest = files.reduce((min, f) => (f.getSize() < min.getSize() ? f : min));
  return `${smallest.getName()} (${formatSize(smallest.getSize())})`;
}

main();

