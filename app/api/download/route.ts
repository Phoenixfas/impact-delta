import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const MIME_MAP: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".dwg": "application/acad",
  ".dxf": "application/dxf",
  ".zip": "application/zip",
  ".txt": "text/plain",
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawFile = searchParams.get("file");
    const isDownload = searchParams.get("download") === "1";

    if (!rawFile) {
      return NextResponse.json({ error: "File parameter required" }, { status: 400 });
    }

    // Clean input to get the filename
    let targetName = rawFile.trim();
    if (targetName.startsWith("/uploads/")) {
      targetName = targetName.replace(/^\/uploads\//, "");
    } else if (targetName.startsWith("uploads/")) {
      targetName = targetName.replace(/^uploads\//, "");
    }
    targetName = path.basename(targetName);

    if (!targetName) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    let foundFilePath: string | null = null;
    let downloadFilename = targetName;

    // 1. Check exact match
    const exactPath = path.join(uploadDir, targetName);
    try {
      await fs.access(exactPath);
      foundFilePath = exactPath;
    } catch {
      // Not an exact filename, scan directory for files matching original name
    }

    // 2. Scan directory if not found directly
    if (!foundFilePath) {
      try {
        const files = await fs.readdir(uploadDir);

        // Try to match file ending with `-${targetName}` or `${targetName}`
        const matched = files.find(
          (f) =>
            f.toLowerCase() === targetName.toLowerCase() ||
            f.toLowerCase().endsWith(`-${targetName.toLowerCase()}`) ||
            f.toLowerCase().includes(targetName.toLowerCase())
        );

        if (matched) {
          foundFilePath = path.join(uploadDir, matched);
          // Retain clean filename for user download
          downloadFilename = targetName;
        }
      } catch (err) {
        console.error("Directory scan error:", err);
      }
    }

    if (!foundFilePath) {
      return NextResponse.json(
        { error: `File not found on server: ${targetName}` },
        { status: 404 }
      );
    }

    const fileBuffer = await fs.readFile(foundFilePath);
    const ext = path.extname(foundFilePath).toLowerCase();
    const contentType = MIME_MAP[ext] || "application/octet-stream";

    const dispositionType = isDownload ? "attachment" : "inline";
    const contentDisposition = `${dispositionType}; filename="${encodeURIComponent(downloadFilename)}"`;

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (err: any) {
    console.error("[GET /api/download Error]", err);
    return NextResponse.json(
      { error: "Internal error processing file download" },
      { status: 500 }
    );
  }
}
