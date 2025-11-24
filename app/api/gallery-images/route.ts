import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET() {
  try {
    const galleryPath = path.join(process.cwd(), "public", "gallery");

    // 폴더가 존재하는지 확인
    if (!fs.existsSync(galleryPath)) {
      return NextResponse.json({ images: [] });
    }

    // 폴더 내 파일 목록 읽기
    const files = fs.readdirSync(galleryPath);

    // PNG와 JPEG 파일만 필터링
    const imageFiles = files.filter((file) => {
      const lowerFile = file.toLowerCase();
      return (
        lowerFile.endsWith(".png") ||
        lowerFile.endsWith(".jpg") ||
        lowerFile.endsWith(".jpeg")
      );
    });

    // 이미지 경로 배열 생성 (public 폴더 기준)
    const imagePaths = imageFiles.map((file) => `/gallery/${file}`);

    return NextResponse.json({ images: imagePaths });
  } catch (error) {
    console.error("Gallery images error:", error);
    return NextResponse.json(
      { error: "Internal server error", images: [] },
      { status: 500 }
    );
  }
}

