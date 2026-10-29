import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { StudyMaterial } from "@/models/StudyMaterial";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const className = searchParams.get("className");
    const subject = searchParams.get("subject");

    const query: any = {};
    if (className && className !== "All") query.className = className;
    if (subject && subject !== "All") query.subject = subject;

    const materials = await StudyMaterial.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: materials.length, data: materials });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const material = await StudyMaterial.create(body);
    return NextResponse.json({ success: true, data: material }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
