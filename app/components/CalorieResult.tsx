"use client";

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

interface CalorieResultProps {
  result: AnalysisResult;
}

function MacroBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold">{value}g</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function HealthScoreBadge({ score }: { score: number }) {
  const color =
    score >= 8 ? "bg-green-100 text-green-700 border-green-200" :
    score >= 5 ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
    "bg-red-100 text-red-700 border-red-200";

  const label =
    score >= 8 ? "Rất tốt" :
    score >= 5 ? "Bình thường" :
    "Cần cải thiện";

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${color}`}>
      <span className="text-lg">{score >= 8 ? "💚" : score >= 5 ? "💛" : "🔴"}</span>
      <span>Điểm sức khỏe: {score}/10 — {label}</span>
    </div>
  );
}

export default function CalorieResult({ result }: CalorieResultProps) {
  if (result.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-2">😕</div>
        <p className="text-red-600 font-medium">{result.error}</p>
        <p className="text-gray-500 text-sm mt-1">Hãy thử chụp ảnh rõ hơn với ánh sáng tốt hơn</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tổng calo */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-green-100 text-sm font-medium">{result.mealType}</p>
            <p className="text-5xl font-bold mt-1">{result.totalCalories}</p>
            <p className="text-green-100 text-sm">kcal</p>
          </div>
          <HealthScoreBadge score={result.healthScore} />
        </div>
      </div>

      {/* Macro */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-100">
        <h3 className="font-semibold text-gray-700 mb-4">Dinh dưỡng đa lượng</h3>
        <div className="space-y-3">
          <MacroBar label="Protein" value={result.totalProtein} max={100} color="bg-blue-400" />
          <MacroBar label="Carbohydrate" value={result.totalCarbs} max={300} color="bg-amber-400" />
          <MacroBar label="Chất béo" value={result.totalFat} max={80} color="bg-rose-400" />
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
          {[
            { label: "Protein", value: result.totalProtein, unit: "g", emoji: "💪", color: "text-blue-600" },
            { label: "Carbs", value: result.totalCarbs, unit: "g", emoji: "🌾", color: "text-amber-600" },
            { label: "Chất béo", value: result.totalFat, unit: "g", emoji: "🥑", color: "text-rose-600" },
          ].map((m) => (
            <div key={m.label} className="text-center bg-gray-50 rounded-xl p-3">
              <div className="text-xl">{m.emoji}</div>
              <div className={`text-lg font-bold ${m.color}`}>{m.value}g</div>
              <div className="text-xs text-gray-500">{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Danh sách món */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-100">
        <h3 className="font-semibold text-gray-700 mb-3">Các món ăn ({result.items.length} món)</h3>
        <div className="space-y-2">
          {result.items.map((item, i) => (
            <div key={i} className="flex justify-between items-start p-3 bg-green-50 rounded-xl">
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">{item.quantity}</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  P: {item.protein}g · C: {item.carbs}g · F: {item.fat}g
                </p>
              </div>
              <div className="text-right">
                <span className="font-bold text-green-700">{item.calories}</span>
                <span className="text-green-500 text-xs ml-1">kcal</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nhận xét */}
      {result.note && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-sm text-blue-700 font-medium mb-1">💡 Nhận xét dinh dưỡng</p>
          <p className="text-sm text-gray-600">{result.note}</p>
        </div>
      )}
    </div>
  );
}
