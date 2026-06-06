import React from "react";
import type { FrequencyScore } from "../types/psqi.types";

export interface DisturbanceItem {
  key: string;
  label: string;
}

const FREQUENCY_LABELS: { value: FrequencyScore; label: string; short: string }[] = [
  { value: 0, label: "ไม่เคย", short: "ไม่เคย" },
  { value: 1, label: "น้อยกว่า 1 ครั้ง/สัปดาห์", short: "<1×/สัปดาห์" },
  { value: 2, label: "1–2 ครั้ง/สัปดาห์", short: "1–2×/สัปดาห์" },
  { value: 3, label: "3 ครั้งขึ้นไป/สัปดาห์", short: "≥3×/สัปดาห์" },
];

interface DisturbanceGridProps {
  items: DisturbanceItem[];
  values: Record<string, FrequencyScore>;
  onChange: (key: string, value: FrequencyScore) => void;
}

export default function DisturbanceGrid({ items, values, onChange }: DisturbanceGridProps) {
  return (
    <div className="w-full overflow-x-auto -mx-1">
      <table className="w-full min-w-[340px]" role="grid" aria-label="ความถี่ที่นอนหลับไม่ดี">
        <thead>
          <tr>
            <th className="text-left text-xs text-gray-400 font-medium pb-2 pl-1 w-2/5">
              สาเหตุ
            </th>
            {FREQUENCY_LABELS.map((f) => (
              <th
                key={f.value}
                className="text-center text-xs text-gray-400 font-medium pb-2 px-1"
                scope="col"
              >
                {f.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr
              key={item.key}
              className={idx % 2 === 0 ? "bg-gray-50 rounded-xl" : "bg-white"}
            >
              <td className="text-xs text-gray-700 py-2.5 pl-2 pr-1 leading-snug rounded-l-xl">
                {item.label}
              </td>
              {FREQUENCY_LABELS.map((f) => {
                const selected = values[item.key] === f.value;
                return (
                  <td key={f.value} className="text-center py-2 px-1 last:rounded-r-xl">
                    <button
                      role="radio"
                      aria-checked={selected}
                      aria-label={`${item.label}: ${f.label}`}
                      onClick={() => onChange(item.key, f.value)}
                      className={`w-8 h-8 rounded-full border-2 mx-auto flex items-center justify-center transition-all min-h-[44px] min-w-[44px] ${
                        selected
                          ? "border-teal-500 bg-teal-500"
                          : "border-gray-300 bg-white hover:border-teal-300"
                      }`}
                    >
                      {selected && (
                        <span className="w-3 h-3 rounded-full bg-white block" aria-hidden="true" />
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend for accessibility */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 px-1" aria-label="คำอธิบายความถี่">
        {FREQUENCY_LABELS.map((f) => (
          <span key={f.value} className="text-xs text-gray-400">
            {f.short} = {f.label}
          </span>
        ))}
      </div>
    </div>
  );
}
