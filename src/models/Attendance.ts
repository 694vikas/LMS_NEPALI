import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAttendanceRecord {
  studentId: string;
  rollNo: number;
  studentName: string;
  status: "Present" | "Absent" | "Late" | "Leave";
  remarks?: string;
}

export interface IAttendance extends Document {
  dateBS: string; // e.g. "2081-07-15"
  dateAD: Date;
  className: string;
  section: string;
  takenBy?: string;
  records: IAttendanceRecord[];
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceRecordSchema = new Schema<IAttendanceRecord>({
  studentId: { type: String, required: true },
  rollNo: { type: Number, required: true },
  studentName: { type: String, required: true },
  status: {
    type: String,
    enum: ["Present", "Absent", "Late", "Leave"],
    default: "Present",
  },
  remarks: { type: String },
});

const AttendanceSchema = new Schema<IAttendance>(
  {
    dateBS: { type: String, required: true },
    dateAD: { type: Date, default: Date.now },
    className: { type: String, required: true },
    section: { type: String, required: true },
    takenBy: { type: String, default: "Class Teacher" },
    records: [AttendanceRecordSchema],
  },
  { timestamps: true }
);

AttendanceSchema.index({ dateBS: 1, className: 1, section: 1 }, { unique: true });

export const Attendance: Model<IAttendance> =
  mongoose.models.Attendance ||
  mongoose.model<IAttendance>("Attendance", AttendanceSchema);
