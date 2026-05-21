"use client";

import { useCallback, useRef, useState } from "react";

interface ImageUploadProps {
  onImageSelect: (imageData: string, mediaType: string) => void;
  disabled?: boolean;
}

export default function ImageUpload({ onImageSelect, disabled }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        const base64 = result.split(",")[1];
        onImageSelect(base64, file.type as string);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleClear = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Ảnh bữa ăn"
            className="w-full max-h-80 object-contain rounded-2xl border-2 border-green-200 bg-white"
          />
          {!disabled && (
            <button
              onClick={handleClear}
              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer ${
            isDragging
              ? "border-green-500 bg-green-50"
              : "border-green-300 hover:border-green-400 hover:bg-green-50 bg-white"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-5xl mb-3">🍽️</div>
          <p className="text-gray-600 font-medium mb-1">Kéo thả hoặc nhấn để chọn ảnh</p>
          <p className="text-gray-400 text-sm mb-4">PNG, JPG, WEBP tối đa 10MB</p>
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Chọn ảnh
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}
              className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
            >
              Chụp ảnh
            </button>
          </div>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
