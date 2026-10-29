import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStudyMaterial extends Document {
  title: string;
  description?: string;
  className: string;
  subject: string;
  fileType: "PDF" | "Document" | "Link" | "Video";
  fileUrl: string;
  uploadedBy: string;
  downloadsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const StudyMaterialSchema = new Schema<IStudyMaterial>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    className: { type: String, required: true },
    subject: { type: String, required: true },
    fileType: {
      type: String,
      enum: ["PDF", "Document", "Link", "Video"],
      default: "PDF",
    },
    fileUrl: { type: String, required: true },
    uploadedBy: { type: String, default: "Faculty" },
    downloadsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const StudyMaterial: Model<IStudyMaterial> =
  mongoose.models.StudyMaterial ||
  mongoose.model<IStudyMaterial>("StudyMaterial", StudyMaterialSchema);
