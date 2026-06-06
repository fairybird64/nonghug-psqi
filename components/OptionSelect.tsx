import React from "react";
import type { FrequencyScore } from "../types/psqi.types";

export interface Option {
  value: FrequencyScore;
  label: string;
  sublabel?: string;
}

interface OptionSelectProps {
  options: Option[];
  value: FrequencyScore | null;
  onChange: (value: FrequencyScore) => void;
  name: string;
}

export default function OptionSelect({ options, value, onChange, name }: OptionSelectProps) {
  return (
    <div className="flex flex-col gap-3" role="radiogroup" aria-label={name}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 transition-all min-h-[44px] ${
              selected
                ? "border-teal-500 bg-teal-50 text-teal-800"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100"
            }`}
          >
            <span className="font-medium text-sm">{opt.label}</span>
            {opt.sublabel && (
              <span className="block text-xs text-gray-400 mt-0.5">{opt.sublabel}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
