import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export interface UploadResult {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/acad",
  "application/octet-stream", // DWG / CAD files often show as octet-stream
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function saveUploadedFile(file: File): Promise<UploadResult> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum allowed size of 50MB`);
  }

  // Generate safe unique filename
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const hash = crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 12);
  const timestamp = Date.now();
  const ext = path.extname(file.name).toLowerCase() || ".bin";
  const sanitizedOriginal = path
    .basename(file.name, ext)
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 30);
  const uniqueFilename = `${timestamp}-${hash}-${sanitizedOriginal}${ext}`;

  // Ensure public/uploads directory exists
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  const targetPath = path.join(uploadDir, uniqueFilename);
  await fs.writeFile(targetPath, buffer);

  return {
    url: `/uploads/${uniqueFilename}`,
    filename: uniqueFilename,
    originalName: file.name,
    size: file.size,
    mimeType: file.type || "application/octet-stream",
  };
}
