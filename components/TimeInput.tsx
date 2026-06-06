import React, { useState } from "react";

interface TimeInputProps {
  label: string;
  value: string; // "HH:MM"
  onChange: (value: string) => void;
  id: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));

export default function TimeInput({ label, value, onChange, id }: TimeInputProps) {
  const [hh, mm] = value ? value.split(":") : ["22", "00"];

  function handleHour(h: string) {
    onChange(`${h}:${mm}`);
  }

  function handleMinute(m: string) {
    onChange(`${hh}:${m}`);
  }

  return (
    <div className="w-full">
      <label className="block text-sm text-gray-600 mb-3" htmlFor={`${id}-hour`}>
        {label}
      </label>

      <div className="flex items-center gap-3 justify-center">
        {/* Hour selector */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400 mb-1">ชั่วโมง</span>
          <select
            id={`${id}-hour`}
            value={hh}
            onChange={(e) => handleHour(e.target.value)}
            className="text-2xl font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 min-h-[44px] text-center appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400"
            aria-label={`${label} ชั่วโมง`}
          >
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>

        <span className="text-3xl font-bold text-gray-400 pb-1" aria-hidden="true">:</span>

        {/* Minute selector */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400 mb-1">นาที</span>
          <select
            id={`${id}-minute`}
            value={mm}
            onChange={(e) => handleMinute(e.target.value)}
            className="text-2xl font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 min-h-[44px] text-center appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400"
            aria-label={`${label} นาที`}
          >
            {MINUTES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Display */}
      <p className="text-center mt-3 text-teal-700 font-semibold text-lg" aria-live="polite">
        {hh}:{mm} น.
      </p>
    </div>
  );
}
