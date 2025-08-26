import StringUtils from "@/utils/strings";
import { Receipt as ReceiptType } from "@/app/types";
import { useState } from "react";

export default function ListItem({
  receipt,
  onDeleteCallback,
}: {
  receipt: ReceiptType;
  onDeleteCallback: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-header rounded-md p-4 shadow-md">
      <div className="grid grid-cols-4 items-center">
        <button
          onClick={() => setExpanded(!expanded)}
          className="hover:cursor-pointer justify-self-start"
        >
          <strong>{receipt.store}</strong>
        </button>
        <span className="justify-self-center">
          {receipt.total.toLocaleString("no-NB", {
            minimumFractionDigits: 2,
          })}
          &nbsp;
          {receipt.currency}
        </span>
        <span className="justify-self-center">
          {new Date(receipt.datetime).toLocaleDateString("no-NB")}
        </span>
        <button
          onClick={() => {
            onDeleteCallback(receipt.id);
          }}
          type="button"
          className="hover:cursor-pointer justify-self-end"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="20"
            height="20"
            viewBox="0 0 30 30"
          >
            <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
          </svg>
        </button>
      </div>
      {expanded && (
        <div className="pl-4 space-y-1 mt-1">
          {receipt.line_items.map((item, index) => (
            <div key={index}>
              {item.description} - {StringUtils.capitalize(item.category)} -{" "}
              {item.amount.toLocaleString("no-NB", {
                minimumFractionDigits: 2,
              })}
              &nbsp;
              {receipt.currency}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
