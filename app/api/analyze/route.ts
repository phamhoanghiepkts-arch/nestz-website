import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { imageData, mediaType } = await req.json();

    if (!imageData) {
      return NextResponse.json({ error: "Thiếu dữ liệu ảnh" }, { status: 400 });
    }

    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType || "image/jpeg",
                data: imageData,
              },
            },
            {
              type: "text",
              text: `Phân tích bức ảnh này và nhận dạng tất cả các món ăn/thực phẩm có trong ảnh.

Hãy trả lời theo định dạng JSON sau (không thêm gì khác ngoài JSON):
{
  "items": [
    {
      "name": "Tên món ăn (tiếng Việt)",
      "quantity": "Ước tính khẩu phần (ví dụ: 1 bát, 200g, 1 chiếc)",
      "calories": số_calo_ước_tính,
      "protein": gam_protein,
      "carbs": gam_carbohydrate,
      "fat": gam_chat_beo
    }
  ],
  "totalCalories": tổng_calo,
  "totalProtein": tổng_protein,
  "totalCarbs": tổng_carb,
  "totalFat": tổng_chat_beo,
  "mealType": "Loại bữa ăn (Bữa sáng/Bữa trưa/Bữa tối/Bữa phụ)",
  "healthScore": điểm_sức_khỏe_từ_1_đến_10,
  "note": "Nhận xét ngắn về giá trị dinh dưỡng của bữa ăn"
}

Nếu không nhận ra được thức ăn trong ảnh, trả về:
{"error": "Không nhận dạng được thức ăn trong ảnh"}`,
            },
          ],
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Lỗi phản hồi từ AI" }, { status: 500 });
    }

    const text = content.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Không thể phân tích kết quả" }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống, vui lòng thử lại" },
      { status: 500 }
    );
  }
}
