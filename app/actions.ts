"use server";

import { z } from "zod";
import OpenAI from "openai";
import getDataUrl from "@/utils/image";
import { zodTextFormat } from "openai/helpers/zod.mjs";

const openAIClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ReceiptSchema = z.object({
  store: z.string(),
  total: z.number(),
  currency: z.string(),
  datetime: z.string().datetime(),
  line_items: z.array(
    z.object({
      description: z.string(),
      category: z
        .literal("food")
        .or(z.literal("transportation"))
        .or(z.literal("clothing"))
        .or(z.literal("household"))
        .or(z.literal("pet"))
        .or(z.literal("tobacco"))
        .or(z.literal("other")),
      amount: z.number(),
      quantity: z.number(),
    })
  ),
  warnings: z.array(z.string()).optional().nullable(),
});

const aiPrompts = {
  system: [
    "You are a careful extraction engine.",
    "Return ONLY valid JSON that matches the provided JSON schema.",
    "Do not include explanatory text or markdown.",
  ],
  user: [
    "Extract a structured receipt object from this image.",
    "Normalize numbers using '.' as decimal separator.",
    "Store names should ONLY include brand names.",
    "Convert datetime to ISO 8601 format.",
    "Infer any currency shown. If a field is missing, omit it",
    "If any value is uncertain (low confidence) add a short note to warnings[].",
  ],
};

export async function scanReceipt(
  _previousState: { success: boolean | null; message: string; data: any },
  formData: FormData
) {
  const image: File = formData.get("image") as File;

  if (!image) {
    return { error: "No image provided" };
  }

  try {
    const { dataUrl, hash } = await getDataUrl(image);

    const response = await openAIClient.responses.create({
      model: "gpt-4o-mini",
      temperature: 0,
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: aiPrompts.system.join(" ") }],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: aiPrompts.user.join(" "),
            },
            {
              type: "input_image",
              image_url: dataUrl,
              detail: "high",
            },
          ],
        },
      ],
      text: { format: zodTextFormat(ReceiptSchema, "receipt_schema") },
    });

    const data = JSON.parse(response.output_text);

    data.id = hash;

    return data;
  } catch (error) {
    console.error("Error processing receipt:", error);
    return { success: false, message: "Error processing receipt", data: null };
  }
}
