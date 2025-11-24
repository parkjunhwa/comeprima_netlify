import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(request: NextRequest) {
  try {
    const filename = request.nextUrl.searchParams.get("file");

    if (!filename) {
      return NextResponse.json(
        { error: "File not specified" },
        { status: 400 }
      );
    }

    // 보안: 경로 조작 방지
    const safeName = path.basename(filename);
    const imagePath = path.join(
      process.cwd(),
      "public",
      "images",
      safeName
    );

    // 파일이 존재하는지 확인
    if (!fs.existsSync(imagePath)) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // 파일 읽기
    const fileBuffer = fs.readFileSync(imagePath);

    // MIME 타입 결정
    let mimeType = "application/octet-stream";
    if (safeName.endsWith(".jpg") || safeName.endsWith(".jpeg")) {
      mimeType = "image/jpeg";
    } else if (safeName.endsWith(".png")) {
      mimeType = "image/png";
    } else if (safeName.endsWith(".gif")) {
      mimeType = "image/gif";
    } else if (safeName.endsWith(".webp")) {
      mimeType = "image/webp";
    }

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${safeName}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

