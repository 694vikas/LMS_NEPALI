"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";

interface FileUploadInputProps {
  onFileUploaded: (fileUrl: string, fileType: "PDF" | "Document" | "Link" | "Video", originalName: string) => void;
  currentUrl?: string;
  label?: string;
}

export function FileUploadInput({
  onFileUploaded,
  currentUrl,
  label = "Upload PDF Question Paper / Note File",
}: FileUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedInfo, setUploadedInfo] = useState<{
    name: string;
    size: number;
    url: string;
  } | null>(
    currentUrl
      ? {
          name: currentUrl.split("/").pop() || "Uploaded File",
          size: 0,
          url: currentUrl,
        }
      : null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.data) {
        setUploadedInfo({
          name: json.data.originalName,
          size: json.data.fileSize,
          url: json.data.fileUrl,
        });
        onFileUploaded(json.data.fileUrl, json.data.fileType, json.data.originalName);
      } else {
        setError(json.error || "Upload failed");
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setUploadedInfo(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileUploaded("", "PDF", "");
  };

  return (
    <div className="space-y-1.5 text-xs">
      <label className="font-semibold text-slate-700 dark:text-slate-300 block">
        {label} *
      </label>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Box */}
      {!uploadedInfo ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
            uploading
              ? "border-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/20"
              : "border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center py-2 space-y-2">
              <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
              <p className="font-medium text-slate-700 dark:text-slate-300">
                Uploading file to server...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 space-y-1.5">
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Click to browse & upload PDF / Question Paper
              </p>
              <p className="text-[11px] text-slate-400">
                Supports PDF, DOC, DOCX up to 25MB
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Uploaded Success Preview */
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-emerald-900 dark:text-emerald-200 truncate">
                {uploadedInfo.name}
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                {uploadedInfo.size > 0
                  ? `${(uploadedInfo.size / 1024).toFixed(1)} KB • Ready to submit`
                  : "Attached"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <a
              href={uploadedInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Preview
            </a>
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-slate-400 hover:text-rose-600 transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
