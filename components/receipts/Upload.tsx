"use client";

import { scanReceipt } from "@/app/actions";
import { Receipt } from "@/app/types";
import { useActionState, useEffect, useState } from "react";

export default function Upload() {
  const [formData, setFormData] = useState<Receipt>({
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

  useEffect(() => {
    if (state.data) {
      setFormData(state.data);
    }
  }, [state.data]);

  return (
    <div>
      <form action={formAction}>
        <input type="file" name="image" accept="image/*" required />
        <button type="submit">Upload receipt</button>
      </form>
      {state.success && formData && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="p-4 bg-blue-200 rounded-md"
        >
          <input
            type="text"
            name="store"
            value={formData.store}
            onChange={handleFormChange}
          />
          <input
            type="number"
            name="total"
            value={formData.total}
            onChange={handleFormChange}
          />
          <input
            type="datetime"
            name="datetime"
            value={formData.datetime}
            onChange={handleFormChange}
          />
          {formData.line_items &&
            formData.line_items.map((item, index) => (
              <div key={index} className="!flex gap-4">
                <input
                  type="text"
                  name={`line_items_${index}_description`}
                  value={item.description}
                  onChange={handleFormChange}
                />
                <input
                  type="text"
                  name={`line_items_${index}_category`}
                  value={item.category}
                  onChange={handleFormChange}
                />
                <input
                  type="number"
                  name={`line_items_${index}_amount`}
                  value={item.amount}
                  onChange={handleFormChange}
                />
              </div>
            ))}
          <button type="submit">Save changes</button>
        </form>
      )}
    </div>
  );
}
