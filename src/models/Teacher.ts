import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITeacher extends Document {
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  subjects: string[];
  isClassTeacher: boolean;
  assignedClass?: string;
  assignedSection?: string;
  qualification: string;
  joinedDateBS: string;
  status: "Active" | "On Leave";
  createdAt: Date;
  updatedAt: Date;
}

const TeacherSchema = new Schema<ITeacher>(
  {
    employeeId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    subjects: [{ type: String }],
    isClassTeacher: { type: Boolean, default: false },
    assignedClass: { type: String },
    assignedSection: { type: String },
    qualification: { type: String, required: true },
    joinedDateBS: { type: String, default: "2080-01-01" },
    status: {
      type: String,
      enum: ["Active", "On Leave"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export const Teacher: Model<ITeacher> =
  mongoose.models.Teacher || mongoose.model<ITeacher>("Teacher", TeacherSchema);

