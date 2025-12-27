"use client";

import { useEffect } from "react";
import Image from "next/image";
import { TriangleAlert, User, X } from "lucide-react";

import {
  formatBytes,
  useFileUpload,
  type FileWithPreview,
} from "@/hooks/use-file-upload";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  maxSize?: number;
  className?: string;
  onFileChange?: (file: File | null) => void;
  defaultAvatar?: string;
}

export default function AvatarUpload({
  maxSize = 2 * 1024 * 1024, // 2MB
  className,
  onFileChange,
  defaultAvatar,
}: AvatarUploadProps) {
  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/*",
    maxFiles: 1,
    maxSize,
    multiple: false,
  });

  const currentFile: FileWithPreview | undefined = files[0];
  const previewUrl = currentFile?.preview ?? defaultAvatar ?? null;

  useEffect(() => {
    if (currentFile?.file instanceof File) {
      onFileChange?.(currentFile.file);
    } else {
      onFileChange?.(null);
    }
  }, [currentFile, onFileChange]);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Upload Area */}
      <div className="relative mx-auto">
        <div
          role="button"
          tabIndex={0}
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cn(
            "relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-dashed transition-colors",
            "hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring",
            isDragging && "bg-accent/50",
            previewUrl && "border-none"
          )}
        >
          <input {...getInputProps()} className="sr-only" />

          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Avatar preview"
              fill
              className="object-cover"
              sizes="128px"
              priority
            />
          ) : (
            <User className="h-6 w-6 text-muted-foreground" />
          )}
        </div>

        {/* Remove Button */}
        {currentFile && (
          <button
            type="button"
            aria-label="Remove avatar"
            onClick={() => removeFile(currentFile.id)}
            className="absolute right-1 top-1 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Helper Text */}
      <p className="text-center text-xs text-muted-foreground">
        PNG or JPG up to {formatBytes(maxSize)}
      </p>

      {/* Error Alert */}
      {errors.length > 0 && (
        <Alert variant="destructive" className="mt-1">
          <div className="flex gap-3">
            <TriangleAlert className="h-4 w-4 mt-1" />
            <div>
              <AlertTitle>Upload error</AlertTitle>
              <AlertDescription>{errors[0]}</AlertDescription>
            </div>
          </div>
        </Alert>
      )}
    </div>
  );
}
