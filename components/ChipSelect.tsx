import React from "react";

interface ChipSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label: string;
}

export default function ChipSelect({ options, selected, onChange, label }: ChipSelectProps) {
  function toggle(opt: string) {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-3">{label}</p>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="เหตุอื่นๆ ที่ทำให้นอนหลับยาก (เลือกได้หลายข้อ)"
      >
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <button
              key={opt}
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => toggle(opt)}
              className={`px-4 py-2.5 rounded-full border-2 text-sm font-medium transition-all min-h-[44px] ${
                isSelected
                  ? "border-teal-500 bg-teal-50 text-teal-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              {isSelected && <span aria-hidden="true" className="mr-1">✓</span>}
              {opt}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <p className="text-xs text-teal-600 mt-2" aria-live="polite">
          เลือกแล้ว {selected.length} รายการ
        </p>
      )}
    </div>
  );
}
