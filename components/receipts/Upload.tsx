"use client";

import { scanReceipt } from "@/app/actions";
import { useActionState } from "react";

export default function Upload() {
  const [state, formAction] = useActionState(scanReceipt, {
    success: null,
    message: "",
    data: null,
  });

  return (
    <div>
      <form action={formAction}>
        <input type="file" name="image" accept="image/*" required />
        <button type="submit">Upload receipt</button>
      </form>
      {state.data && (
        <div className="mt-4">
          <pre>{JSON.stringify(state.data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
