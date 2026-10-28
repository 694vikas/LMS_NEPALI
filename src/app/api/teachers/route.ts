import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Teacher } from "@/models/Teacher";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const query: any = {};
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { employeeId: { $regex: search, $options: "i" } },
        { subjects: { $elemMatch: { $regex: search, $options: "i" } } },
      ];
    }

    const teachers = await Teacher.find(query).sort({ fullName: 1 });
    return NextResponse.json({ success: true, count: teachers.length, data: teachers });
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

    if (!body.employeeId) {
      const count = await Teacher.countDocuments();
      body.employeeId = `TCH-${101 + count}`;
    }

    const teacher = await Teacher.create(body);
    return NextResponse.json({ success: true, data: teacher }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

