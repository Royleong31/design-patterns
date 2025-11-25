/**
 * COMPOSITE PATTERN
 *
 * Intent: Compose objects into tree structures to represent part-whole hierarchies.
 * Composite lets clients treat individual objects and compositions of objects uniformly.
 *
 * Real-world example: File System
 * - A file system contains files and directories
 * - Directories can contain files and other directories (recursive)
 * - Both files and directories share common operations (getSize, getName, getPath)
 * - Client code can work with files and directories using the same interface
 */

/**
 * Component Interface - Base interface for both files and directories
 */
export interface FileSystemNode {
  getName(): string;
  getPath(): string;
  getSize(): number;
  getType(): "file" | "directory";
  print(indent?: string): void;
  search(name: string): FileSystemNode[];
  getCreatedAt(): Date;
}

/**
 * Leaf - File
 * Files are leaf nodes - they cannot contain other nodes
 */
export class File implements FileSystemNode {
  private name: string;
  private size: number;
  private extension: string;
  private parent: Directory | null = null;
  private createdAt: Date;

  constructor(name: string, size: number) {
    this.name = name;
    this.size = size;
    this.extension = name.includes(".") ? name.split(".").pop() || "" : "";
    this.createdAt = new Date();
  }

  getName(): string {
    return this.name;
  }

  getPath(): string {
    if (this.parent) {
      return `${this.parent.getPath()}/${this.name}`;
    }
    return this.name;
  }

  getSize(): number {
    return this.size;
  }

  getType(): "file" | "directory" {
    return "file";
  }

  getExtension(): string {
    return this.extension;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  setParent(parent: Directory | null): void {
    this.parent = parent;
  }

  print(indent: string = ""): void {
    console.log(`${indent}📄 ${this.name} (${formatSize(this.size)})`);
  }

  search(name: string): FileSystemNode[] {
    if (this.name.toLowerCase().includes(name.toLowerCase())) {
      return [this];
    }
    return [];
  }
}

/**
 * Composite - Directory
 * Directories can contain files and other directories
 */
export class Directory implements FileSystemNode {
  private name: string;
  private children: FileSystemNode[] = [];
  private parent: Directory | null = null;
  private createdAt: Date;

  constructor(name: string) {
    this.name = name;
    this.createdAt = new Date();
  }

  getName(): string {
    return this.name;
  }

  getPath(): string {
    if (this.parent) {
      return `${this.parent.getPath()}/${this.name}`;
    }
    return this.name;
  }

  /**
   * Size of a directory is the sum of all its contents
   */
  getSize(): number {
    return this.children.reduce((total, child) => total + child.getSize(), 0);
  }

  getType(): "file" | "directory" {
    return "directory";
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  setParent(parent: Directory | null): void {
    this.parent = parent;
  }

  /**
   * Add a child node (file or directory)
   */
  add(node: FileSystemNode): void {
    if (node instanceof File || node instanceof Directory) {
      node.setParent(this);
    }
    this.children.push(node);
  }

  /**
   * Remove a child node
   */
  remove(node: FileSystemNode): boolean {
    const index = this.children.indexOf(node);
    if (index > -1) {
      if (node instanceof File || node instanceof Directory) {
        node.setParent(null);
      }
      this.children.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Get all children
   */
  getChildren(): FileSystemNode[] {
    return [...this.children];
  }

  /**
   * Get count of all items (recursive)
   */
  getItemCount(): number {
    let count = this.children.length;
    for (const child of this.children) {
      if (child instanceof Directory) {
        count += child.getItemCount();
      }
    }
    return count;
  }

  /**
   * Print the directory tree
   */
  print(indent: string = ""): void {
    console.log(`${indent}📁 ${this.name}/ (${formatSize(this.getSize())})`);
    const childIndent = indent + "  ";
    for (const child of this.children) {
      child.print(childIndent);
    }
  }

  /**
   * Search for nodes by name (recursive)
   */
  search(name: string): FileSystemNode[] {
    let results: FileSystemNode[] = [];

    if (this.name.toLowerCase().includes(name.toLowerCase())) {
      results.push(this);
    }

    for (const child of this.children) {
      results = results.concat(child.search(name));
    }

    return results;
  }

  /**
   * Find files by extension (recursive)
   */
  findByExtension(ext: string): File[] {
    const results: File[] = [];

    for (const child of this.children) {
      if (child instanceof File && child.getExtension() === ext) {
        results.push(child);
      } else if (child instanceof Directory) {
        results.push(...child.findByExtension(ext));
      }
    }

    return results;
  }

  /**
   * Get all files (recursive)
   */
  getAllFiles(): File[] {
    const files: File[] = [];

    for (const child of this.children) {
      if (child instanceof File) {
        files.push(child);
      } else if (child instanceof Directory) {
        files.push(...child.getAllFiles());
      }
    }

    return files;
  }

  /**
   * Get directory statistics
   */
  getStats(): DirectoryStats {
    let fileCount = 0;
    let dirCount = 0;
    const extensionCounts: Map<string, number> = new Map();

    const countRecursive = (dir: Directory) => {
      for (const child of dir.getChildren()) {
        if (child instanceof File) {
          fileCount++;
          const ext = child.getExtension() || "no-ext";
          extensionCounts.set(ext, (extensionCounts.get(ext) || 0) + 1);
        } else if (child instanceof Directory) {
          dirCount++;
          countRecursive(child);
        }
      }
    };

    countRecursive(this);

    return {
      totalSize: this.getSize(),
      fileCount,
      directoryCount: dirCount,
      extensionCounts: Object.fromEntries(extensionCounts),
    };
  }
}

/**
 * Directory statistics
 */
export interface DirectoryStats {
  totalSize: number;
  fileCount: number;
  directoryCount: number;
  extensionCounts: Record<string, number>;
}

/**
 * Helper function to format file sizes
 */
export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * Helper to create a sample file structure for demos
 */
export function createSampleFileSystem(): Directory {
  const root = new Directory("project");

  // Source directory
  const src = new Directory("src");
  src.add(new File("index.ts", 2048));
  src.add(new File("app.ts", 4096));
  src.add(new File("utils.ts", 1536));

  const components = new Directory("components");
  components.add(new File("Button.tsx", 1024));
  components.add(new File("Card.tsx", 1280));
  components.add(new File("Modal.tsx", 2048));
  components.add(new File("index.ts", 256));
  src.add(components);

  const hooks = new Directory("hooks");
  hooks.add(new File("useAuth.ts", 768));
  hooks.add(new File("useTheme.ts", 512));
  src.add(hooks);

  // Public directory
  const publicDir = new Directory("public");
  publicDir.add(new File("index.html", 1024));
  publicDir.add(new File("favicon.ico", 4096));

  const images = new Directory("images");
  images.add(new File("logo.png", 24576));
  images.add(new File("hero.jpg", 102400));
  images.add(new File("background.svg", 8192));
  publicDir.add(images);

  // Config files
  root.add(src);
  root.add(publicDir);
  root.add(new File("package.json", 512));
  root.add(new File("tsconfig.json", 384));
  root.add(new File("README.md", 2048));
  root.add(new File(".gitignore", 128));

  return root;
}

/**
 * Format directory stats for display
 */
export function formatStats(stats: DirectoryStats): string {
  const lines = [
    `  📊 Total size: ${formatSize(stats.totalSize)}`,
    `  📄 Files: ${stats.fileCount}`,
    `  📁 Directories: ${stats.directoryCount}`,
    `  📋 File types:`,
  ];

  for (const [ext, count] of Object.entries(stats.extensionCounts)) {
    lines.push(`     .${ext}: ${count} file(s)`);
  }

  return lines.join("\n");
}

