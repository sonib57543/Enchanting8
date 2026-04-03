// Modular storage system. 
// Uses LocalStorageProvider now, easy S3 swap later.
import { storage } from "./storage-provider";
import path from "path";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

/**
 * Validates a file before upload.
 * Throws an error if invalid.
 */
function validateFile(file: File) {
  // 1. Size Check
  if (file.size > MAX_SIZE) {
    throw new Error(`File is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 5MB.`);
  }

  // 2. MIME Type Check
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type: ${file.type}. Allowed types: JPG, PNG, WebP, GIF.`);
  }

  // 3. Extension Check
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error(`Invalid file extension: ${ext}. Allowed: .jpg, .jpeg, .png, .webp, .gif`);
  }
}

/**
 * Save a File object and return its public URL.
 * @param file - The File object from FormData
 * @param subFolder - Optional sub-folder ("vendors", "blogs", "packages")
 */
export async function saveUploadedFile(
  file: File,
  subFolder = "vendors"
): Promise<string> {
  try {
    validateFile(file);
    return await storage.saveFile(file, subFolder);
  } catch (err: any) {
    console.error("[uploadHandler] Validation failed:", err.message);
    throw err; // Re-throw to be caught by the API route/action
  }
}

/**
 * Save multiple files and return an array of public URLs.
 */
export async function saveUploadedFiles(
  files: File[],
  subFolder = "vendors"
): Promise<string[]> {
  return Promise.all(files.map((f) => saveUploadedFile(f, subFolder)));
}
