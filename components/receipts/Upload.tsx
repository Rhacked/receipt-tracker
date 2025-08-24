"use client";

import { scanReceipt } from "@/app/actions";
import { Receipt } from "@/app/types";
import { useActionState, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { NumericFormat } from "react-number-format";
import { useRouter } from "next/navigation";

export default function Upload() {
  const router = useRouter();

  const [formData, setFormData] = useState<Receipt>({
    id: crypto.randomUUID(),
    store: "",
    total: 0,
    datetime: new Date().toISOString(),
    currency: "NOK",
    line_items: [],
  });
  const [state, formAction] = useActionState(scanReceipt, {
    success: null,
    message: "",
    data: null,
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("line_items_")) {
      const parts = name.split("_");
      const index = parseInt(parts[2]);
      const field = parts[3];

      setFormData((prevState) => ({
        ...prevState,
        line_items: prevState.line_items.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleFormDataSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const existingData = localStorage.getItem("receipts");

    if (existingData) {
      const parsedReceipts = JSON.parse(existingData) as Receipt[];
      const existingReceipt = parsedReceipts.find(
        (receipt) => receipt.id === formData.id
      );
      if (existingReceipt) {
      } else {
        parsedReceipts.push(formData);
      }
      localStorage.setItem("receipts", JSON.stringify(parsedReceipts));
    } else {
      localStorage.setItem("receipts", JSON.stringify([formData]));
    }

    router.push("/receipts");
  };

  useEffect(() => {
    if (state.data) {
      setFormData(state.data);
      setUploadedImage(null);
    }
  }, [state.data]);

  return (
    <div className="space-y-4">
      <form
        action={formAction}
        className="border border-blue-400 p-4 rounded-md flex gap-4 items-center"
      >
        <label htmlFor="image" className="hover:cursor-pointer">
          Upload your receipt
        </label>
        <input
          id="image"
          type="file"
          name="image"
          accept="image/*"
          required
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setUploadedImage(URL.createObjectURL(file));
            }
          }}
        />
        <Button type="submit" disabled={!uploadedImage}>
          Upload receipt
        </Button>
      </form>
      {uploadedImage && <img src={uploadedImage} className="max-w-[320px]" />}

      {state.success && formData && (
        <form onSubmit={handleFormDataSubmit}>
          <div className="overflow-x-auto rounded-md shadow-md border border-blue-400 bg-white mb-4">
            <table className="min-w-full text-sm">
              <thead className="bg-header uppercase text-xs font-semibold">
                <tr>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-right">Quantity</th>
                  <th className="px-4 py-3 text-right">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[#2E2E2E]">
                {formData.line_items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        name={`line_items_${index}_description`}
                        value={item.description}
                        onChange={handleFormChange}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        name={`line_items_${index}_category`}
                        value={item.category}
                        onChange={handleFormChange}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <NumericFormat
                        id="usage-input"
                        step={1}
                        size={1}
                        value={item.quantity}
                        thousandsGroupStyle="thousand"
                        thousandSeparator=" "
                        decimalSeparator=","
                        allowedDecimalSeparators={[",", "."]}
                        allowNegative={false}
                        className="text-right"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <NumericFormat
                        id="usage-input"
                        step={1}
                        value={item.amount}
                        thousandsGroupStyle="thousand"
                        thousandSeparator=" "
                        decimalSeparator=","
                        allowedDecimalSeparators={[",", "."]}
                        allowNegative={false}
                        suffix={` ${formData.currency}`}
                        minLength={4}
                        decimalScale={2}
                        fixedDecimalScale
                        className="text-right"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-full flex justify-center">
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      )}
    </div>
  );
}
