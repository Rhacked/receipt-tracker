import { Receipt as ReceiptType } from "@/app/types";
import { useState } from "react";

export default function ListItem({ receipt }: { receipt: ReceiptType }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div onClick={() => setExpanded(!expanded)}>
        {receipt.store} - {receipt.total} {receipt.currency}
      </div>
      {expanded && (
        <div className="pl-8">
          {receipt.line_items.map((item, index) => (
            <div key={index}>
              {item.description} - {item.category} - {item.amount}{" "}
              {receipt.currency}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
