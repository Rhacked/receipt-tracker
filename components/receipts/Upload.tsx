"use client";

import { scanReceipt } from "@/app/actions";
import { Receipt } from "@/app/types";
import { useActionState, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { NumericFormat } from "react-number-format";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

function UploadSubmit({ disabled = true }) {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
        <svg
          className="text-gray-300 animate-spin"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
        >
          <path
            d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-900"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <Button type="submit" disabled={disabled}>
      Upload receipt
    </Button>
  );
}

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
          capture="environment"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setUploadedImage(URL.createObjectURL(file));
            }
          }}
        />
        <UploadSubmit disabled={!uploadedImage} />
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
