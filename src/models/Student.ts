import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStudent extends Document {
  studentId: string;
  rollNo: number;
  fullName: string;
  nepaliName?: string;
  gender: "Male" | "Female" | "Other";
  className: string;
  section: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
  dateOfBirthBS?: string;
  bloodGroup?: string;
  feeStatus: "Paid" | "Pending" | "Partial";
  outstandingDue: number;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    studentId: { type: String, required: true, unique: true },
    rollNo: { type: Number, required: true },
    fullName: { type: String, required: true, trim: true },
    nepaliName: { type: String, trim: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    className: { type: String, required: true },
    section: { type: String, required: true, default: "A" },
    guardianName: { type: String, required: true, trim: true },
    guardianPhone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    dateOfBirthBS: { type: String },
    bloodGroup: { type: String },
    feeStatus: {
      type: String,
      enum: ["Paid", "Pending", "Partial"],
      default: "Pending",
    },
    outstandingDue: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Compound index for class, section and roll number uniqueness
StudentSchema.index({ className: 1, section: 1, rollNo: 1 }, { unique: true });

export const Student: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema);

