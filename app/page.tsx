"use client";

import { useState } from "react";
import ImageUpload from "./components/ImageUpload";
import CalorieResult from "./components/CalorieResult";

interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface AnalysisResult {
  items: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealType: string;
  healthScore: number;
  note: string;
  error?: string;
}

export default function Home() {
  const [imageData, setImageData] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string>("image/jpeg");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (data: string, type: string) => {
    setImageData(data);
    setMediaType(type);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!imageData) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData, mediaType }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Lỗi phân tích ảnh");
      } else {
        setResult(data);
      }
    } catch {
      setError("Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImageData(null);
    setResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-green-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center text-white text-xl shadow">
            🥗
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">NestZ Calorie</h1>
            <p className="text-xs text-gray-500">Đo lường calo qua ảnh bữa ăn</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 max-w-md mx-auto w-full px-4 py-6 space-y-5">
        {/* Upload section */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-100">
          <h2 className="font-semibold text-gray-700 mb-3">📸 Chụp hoặc tải ảnh bữa ăn</h2>
          <ImageUpload
            onImageSelect={handleImageSelect}
            disabled={loading}
          />
          {imageData && !loading && (
            <button
              onClick={handleAnalyze}
              className="w-full mt-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            >
              Phân tích calo ngay
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-green-100 text-center">
            <div className="text-5xl mb-3 animate-spin-slow inline-block">🔍</div>
            <p className="font-semibold text-gray-700">Đang phân tích bữa ăn...</p>
            <p className="text-gray-400 text-sm mt-1">AI đang nhận diện các món ăn</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="text-red-600 font-medium">⚠️ {error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-400 hover:text-red-600"
            >
              Đóng
            </button>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <>
            <CalorieResult result={result} />
            <button
              onClick={handleReset}
              className="w-full py-3 border-2 border-green-300 text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-colors"
            >
              Phân tích bữa ăn khác
            </button>
          </>
        )}

        {/* Empty state */}
        {!imageData && !loading && !result && (
          <div className="text-center py-6 text-gray-400">
            <div className="text-6xl mb-3">🍱</div>
            <p className="font-medium text-gray-500">Tải ảnh lên để bắt đầu</p>
            <p className="text-sm mt-1">AI sẽ nhận diện món ăn và tính calo</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-400 text-xs border-t border-green-100 bg-white mt-auto">
        Powered by Claude AI · NestZ 2026
      </footer>
    </main>
  );
}
