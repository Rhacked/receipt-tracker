"use server";

import { z } from "zod";
import OpenAI from "openai";
import { Receipt } from "@/app/types";
import getDataUrl from "@/utils/image";
import { zodTextFormat } from "openai/helpers/zod.mjs";
import { categories } from "@/app/consts";

const openAIClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ReceiptSchema = z.object({
  store: z.string(),
  total: z.number(),
  currency: z.string(),
  datetime: z.string().datetime(),
  line_items: z.array(
    z.object({
      description: z.string(),
      category: z.enum(["", ...categories]),
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
    "If two or more line items are equal, merge them into one.",
    "Line Item descriptions should be lower case with capitalization.",
    "Infer any currency shown. If a field is missing, omit it",
    "If any value is uncertain (low confidence) add a short note to warnings[].",
  ],
};

export async function scanReceipt(
  _previousState: {
    success: boolean | null;
    message: string;
    data: any | null;
  },
  formData: FormData
): Promise<{ success: boolean | null; message: string; data: Receipt | null }> {
  const image: File = formData.get("image") as File;

  if (!image) {
    return { success: false, message: "No image provided", data: null };
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

    return { success: true, message: "", data: data };
  } catch (error) {
    console.error("Error processing receipt:", error);
    return { success: false, message: "Error processing receipt", data: null };
  }
}
