import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Attendance } from "@/models/Attendance";
import { Student } from "@/models/Student";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const className = searchParams.get("className") || "Class 10 (SEE)";
    const section = searchParams.get("section") || "A";
    const dateBS = searchParams.get("dateBS") || "2081-07-15";

    // Check if attendance already recorded for this day
    const existing = await Attendance.findOne({ dateBS, className, section });

    if (existing) {
      return NextResponse.json({
        success: true,
        isRecorded: true,
        data: existing,
      });
    }

    // Otherwise, fetch students of this class to initialize roll call
    const students = await Student.find({ className, section }).sort({ rollNo: 1 });
    const defaultRecords = students.map((std) => ({
      studentId: std.studentId,
      rollNo: std.rollNo,
      studentName: std.fullName,
      status: "Present",
      remarks: "",
    }));

    return NextResponse.json({
      success: true,
      isRecorded: false,
      data: {
        dateBS,
        className,
        section,
        records: defaultRecords,
      },
    });
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
    const { dateBS, className, section, records, takenBy } = body;

    const attendance = await Attendance.findOneAndUpdate(
      { dateBS, className, section },
      {
        dateBS,
        className,
        section,
        records,
        takenBy: takenBy || "Class Teacher",
        dateAD: new Date(),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: `Attendance for ${className} (${section}) on ${dateBS} saved successfully!`,
      data: attendance,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

