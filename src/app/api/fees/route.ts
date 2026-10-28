import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FeeInvoice } from "@/models/FeeInvoice";
import { Student } from "@/models/Student";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const className = searchParams.get("className");
    const status = searchParams.get("status");
    const monthBS = searchParams.get("monthBS");

    const query: any = {};
    if (className && className !== "All") query.className = className;
    if (status && status !== "All") query.status = status;
    if (monthBS && monthBS !== "All") query.monthBS = monthBS;

    const invoices = await FeeInvoice.find(query).sort({ rollNo: 1, createdAt: -1 });

    // Aggregate summary stats
    const allInvoices = await FeeInvoice.find({});
    const totalBilled = allInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalCollected = allInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const totalPending = allInvoices.reduce((sum, inv) => sum + inv.balanceAmount, 0);

    const paidCount = allInvoices.filter((i) => i.status === "Paid").length;
    const unpaidCount = allInvoices.filter((i) => i.status === "Pending").length;
    const partialCount = allInvoices.filter((i) => i.status === "Partial").length;

    return NextResponse.json({
      success: true,
      summary: {
        totalBilled,
        totalCollected,
        totalPending,
        paidCount,
        unpaidCount,
        partialCount,
        totalCount: allInvoices.length,
      },
      data: invoices,
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
    const { invoiceId, payingAmount, paymentMethod, remarks } = body;

    const invoice = await FeeInvoice.findById(invoiceId);
    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    const pay = Number(payingAmount);
    const newPaidAmount = (invoice.paidAmount || 0) + pay;
    const newBalance = Math.max(0, invoice.totalAmount - newPaidAmount);

    let newStatus: "Paid" | "Pending" | "Partial" = "Pending";
    if (newBalance === 0) {
      newStatus = "Paid";
    } else if (newPaidAmount > 0) {
      newStatus = "Partial";
    }

    const receiptNo = `REC-2081-${Math.floor(1000 + Math.random() * 9000)}`;

    invoice.paidAmount = newPaidAmount;
    invoice.balanceAmount = newBalance;
    invoice.status = newStatus;
    invoice.paymentMethod = paymentMethod || "Cash";
    invoice.paidAt = new Date();
    invoice.receiptNo = receiptNo;
    if (remarks) invoice.remarks = remarks;

    await invoice.save();

    // Also update Student's outstandingDue and feeStatus
    await Student.findOneAndUpdate(
      { studentId: invoice.studentId },
      {
        feeStatus: newStatus,
        outstandingDue: newBalance,
      }
    );

    return NextResponse.json({
      success: true,
      message: `Payment of NPR ${pay} recorded successfully!`,
      data: invoice,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

