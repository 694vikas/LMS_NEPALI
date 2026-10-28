import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Student } from "@/models/Student";
import { FeeInvoice } from "@/models/FeeInvoice";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const className = searchParams.get("className");
    const section = searchParams.get("section");
    const feeStatus = searchParams.get("feeStatus");
    const search = searchParams.get("search");

    const query: any = {};
    if (className && className !== "All") query.className = className;
    if (section && section !== "All") query.section = section;
    if (feeStatus && feeStatus !== "All") query.feeStatus = feeStatus;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
        { guardianName: { $regex: search, $options: "i" } },
      ];
    }

    const students = await Student.find(query).sort({ rollNo: 1 });
    return NextResponse.json({ success: true, count: students.length, data: students });
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

    // Generate studentId if not provided
    if (!body.studentId) {
      const count = await Student.countDocuments();
      body.studentId = `STD-2081-${String(count + 1).padStart(3, "0")}`;
    }

    const student = await Student.create(body);

    // Automatically create a default Kartik 2081 Fee Invoice
    const totalAmount = 3500;
    await FeeInvoice.create({
      invoiceNo: `INV-2081-${Date.now().toString().slice(-4)}`,
      studentId: student.studentId,
      studentName: student.fullName,
      className: student.className,
      section: student.section,
      rollNo: student.rollNo,
      monthBS: "Kartik (कार्तिक)",
      yearBS: "2081",
      items: [
        { title: "Monthly Tuition Fee", amount: 2500 },
        { title: "Computer Lab & Tech Fee", amount: 500 },
        { title: "Exam Fee", amount: 500 },
      ],
      subtotal: totalAmount,
      discount: 0,
      totalAmount: totalAmount,
      paidAmount: 0,
      balanceAmount: totalAmount,
      status: "Pending",
    });

    return NextResponse.json({ success: true, data: student }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

