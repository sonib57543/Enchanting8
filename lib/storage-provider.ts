import fs from "fs";
import path from "path";

export interface StorageProvider {
  saveFile(file: File, subFolder: string): Promise<string>;
  deleteFile(path: string): Promise<void>;
}

export class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), "public", "uploads");
    this.ensureDir(this.uploadDir);
  }

  private ensureDir(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  async saveFile(file: File, subFolder: string): Promise<string> {
    const subDir = path.join(this.uploadDir, subFolder);
    this.ensureDir(subDir);

    const ext = path.extname(file.name) || "";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const filePath = path.join(subDir, safeName);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    return `/uploads/${subFolder}/${safeName}`;
  }

  async deleteFile(filePath: string): Promise<void> {
    // Relative path like /uploads/vendors/image.jpg
    const relativePath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
    const fullPath = path.join(process.cwd(), "public", relativePath);
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
}

// In the future, we can add S3StorageProvider here.
// export class S3StorageProvider implements StorageProvider { ... }

export const storage = new LocalStorageProvider();
