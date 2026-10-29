import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file was provided in the upload request" },
        { status: 400 }
      );
    }

    // Limit size to 25MB
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "File exceeds maximum size limit of 25MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "materials");
    await fs.mkdir(uploadDir, { recursive: true });

    // Clean filename and make unique with timestamp
    const cleanOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFilename = `${Date.now()}-${cleanOriginalName}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/materials/${uniqueFilename}`;

    // Determine file type tag
    let fileType: "PDF" | "Document" | "Link" | "Video" = "Document";
    const ext = path.extname(file.name).toLowerCase();
    if (ext === ".pdf") fileType = "PDF";
    else if ([".doc", ".docx", ".txt", ".rtf"].includes(ext)) fileType = "Document";

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully!",
      data: {
        fileUrl: publicUrl,
        originalName: file.name,
        fileName: uniqueFilename,
        fileSize: file.size,
        fileType,
      },
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
