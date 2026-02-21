"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";

import Image from "next/image";
import { useImageUpload } from "@/hooks/useImageUploaed";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onClear?: () => void;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onClear,
  className,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, isUploading, progress } = useImageUpload();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    // Upload to Cloudinary
    const result = await uploadImage(file);

    if (result) {
      onChange(result.url);
      // Revoke local preview after successful upload
      URL.revokeObjectURL(localPreview);
    } else {
      // Reset on failure
      setPreview(value || null);
    }
  };

  const handleClear = () => {
    setPreview(null);
    onChange("");
    onClear?.();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        id="image-upload"
      />

      {preview ? (
        <div className="relative w-full h-40 group">
          <Image
            src={preview}
            alt="Preview"
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover rounded-lg border-2 shadow-sm"
          />
          {!isUploading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute -top-2 -right-2 p-1.5 bg-destructive text-white rounded-full hover:bg-destructive/90 transition-all shadow-md hover:scale-110 cursor-pointer"
              aria-label="Remove image"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-lg backdrop-blur-sm">
              <Loader2 className="h-8 w-8 animate-spin text-white mb-2" />
              <span className="text-sm text-white font-medium">{progress}%</span>
            </div>
          )}
        </div>
      ) : (
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-all duration-200 group"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground font-medium">{progress}%</span>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                Click to upload image
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                JPEG, PNG, WEBP up to 5MB
              </span>
            </>
          )}
        </label>
      )}
    </div>
  );
}
