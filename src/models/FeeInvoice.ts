import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeeItem {
  title: string;
  amount: number;
}

export interface IFeeInvoice extends Document {
  invoiceNo: string;
  studentId: string;
  studentName: string;
  className: string;
  section: string;
  rollNo: number;
  monthBS: string;
  yearBS: string;
  items: IFeeItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: "Paid" | "Pending" | "Partial";
  paymentMethod?: "Cash" | "eSewa" | "Khalti" | "Bank Transfer";
  paidAt?: Date;
  receiptNo?: string;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeeItemSchema = new Schema<IFeeItem>({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
});

const FeeInvoiceSchema = new Schema<IFeeInvoice>(
  {
    invoiceNo: { type: String, required: true, unique: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    className: { type: String, required: true },
    section: { type: String, required: true },
    rollNo: { type: Number, required: true },
    monthBS: { type: String, required: true },
    yearBS: { type: String, required: true, default: "2081" },
    items: [FeeItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    balanceAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Paid", "Pending", "Partial"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "eSewa", "Khalti", "Bank Transfer"],
    },
    paidAt: { type: Date },
    receiptNo: { type: String },
    remarks: { type: String },
  },
  { timestamps: true }
);

FeeInvoiceSchema.index({ studentId: 1, monthBS: 1, yearBS: 1 });

export const FeeInvoice: Model<IFeeInvoice> =
  mongoose.models.FeeInvoice ||
  mongoose.model<IFeeInvoice>("FeeInvoice", FeeInvoiceSchema);

