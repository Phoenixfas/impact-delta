import { NextResponse } from "next/server";
import { saveUploadedFile } from "@/lib/upload";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file was provided in the request" },
        { status: 400 }
      );
    }

    const uploaded = await saveUploadedFile(file);

    return NextResponse.json(
      {
        success: true,
        url: uploaded.url,
        filename: uploaded.filename,
        file: uploaded,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[POST /api/upload Error]", err);
    return NextResponse.json(
      { error: err.message || "Failed to upload file to server" },
      { status: 500 }
    );
  }
}
