import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Notice } from "@/models/Notice";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const query: any = {};
    if (category && category !== "All") {
      query.category = category;
    }

    const notices = await Notice.find(query).sort({ isPinned: -1, createdAt: -1 });
    return NextResponse.json({ success: true, count: notices.length, data: notices });
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

    const notice = await Notice.create(body);
    return NextResponse.json({ success: true, data: notice }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

