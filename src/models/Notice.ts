import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotice extends Document {
  title: string;
  content: string;
  category: "Notice" | "Holiday" | "Exam" | "Event";
  priority: "High" | "Normal" | "Urgent";
  targetAudience: string;
  dateBS: string;
  author: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NoticeSchema = new Schema<INotice>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ["Notice", "Holiday", "Exam", "Event"],
      default: "Notice",
    },
    priority: {
      type: String,
      enum: ["High", "Normal", "Urgent"],
      default: "Normal",
    },
    targetAudience: { type: String, default: "All Students & Guardians" },
    dateBS: { type: String, required: true },
    author: { type: String, default: "Principal Office" },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notice: Model<INotice> =
  mongoose.models.Notice || mongoose.model<INotice>("Notice", NoticeSchema);

