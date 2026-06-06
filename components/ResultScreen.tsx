import React from "react";
import type { PSQIComponentScores, SleepTier } from "../types/psqi.types";
import ActionGuide from "./ActionGuide";

interface ResultScreenProps {
  scores: PSQIComponentScores;
  tier: SleepTier;
  onChatbot: () => void;
  onRetake: () => void;
}

const TIER_SCORE_COLOR: Record<SleepTier, string> = {
  good: "text-teal-600",
  fair: "text-amber-600",
  poor: "text-red-600",
};

const TIER_SCORE_BG: Record<SleepTier, string> = {
  good: "bg-teal-50 border-teal-200",
  fair: "bg-amber-50 border-amber-200",
  poor: "bg-red-50 border-red-200",
};

const COMPONENT_LABELS: { key: keyof PSQIComponentScores; label: string }[] = [
  { key: "C1", label: "คุณภาพการนอน" },
  { key: "C2", label: "การใช้เวลาหลับ" },
  { key: "C3", label: "ระยะเวลานอน" },
  { key: "C4", label: "ประสิทธิภาพการนอน" },
  { key: "C5", label: "ปัญหาระหว่างนอน" },
  { key: "C6", label: "ยานอนหลับ" },
  { key: "C7", label: "การทำงานในตอนกลางวัน" },
];

export default function ResultScreen({ scores, tier, onChatbot, onRetake }: ResultScreenProps) {
  return (
    <div className="flex flex-col max-w-md mx-auto px-5 py-8 min-h-screen">
      <h1 className="text-xl font-bold text-gray-800 mb-1">ผลการประเมิน</h1>
      <p className="text-sm text-gray-500 mb-6">Pittsburgh Sleep Quality Index</p>

      {/* Global score */}
      <div
        className={`w-full rounded-2xl border-2 ${TIER_SCORE_BG[tier]} p-6 flex items-center gap-4 mb-6`}
        role="status"
        aria-label={`คะแนนรวม ${scores.global} จาก 21`}
      >
        <div className="flex-none text-center">
          <p className={`text-5xl font-bold ${TIER_SCORE_COLOR[tier]}`}>{scores.global}</p>
          <p className="text-xs text-gray-400 mt-1">จาก 21</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">คะแนนรวม PSQI</p>
          <p className={`font-semibold text-base mt-0.5 ${TIER_SCORE_COLOR[tier]}`}>
            {tier === "good" && "การนอนดี (≤5)"}
            {tier === "fair" && "การนอนปรับได้ (6–10)"}
            {tier === "poor" && "การนอนต้องดูแล (≥11)"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            คะแนนสูง = คุณภาพการนอนต่ำลง
          </p>
        </div>
      </div>

      {/* Component breakdown */}
      <details className="mb-6">
        <summary className="text-sm font-medium text-gray-600 cursor-pointer select-none list-none flex items-center gap-1">
          <span>ดูรายละเอียดแต่ละองค์ประกอบ</span>
          <span className="text-gray-400" aria-hidden="true">▾</span>
        </summary>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {COMPONENT_LABELS.map(({ key, label }) => (
            <div key={key} className="bg-gray-50 rounded-xl px-3 py-2.5">
              <p className="text-xs text-gray-400">{label}</p>
              <p className="font-bold text-gray-700 text-lg">
                {scores[key]}
                <span className="text-xs font-normal text-gray-400">/3</span>
              </p>
            </div>
          ))}
        </div>
      </details>

      {/* Action guide */}
      <ActionGuide tier={tier} />

      {/* Chatbot CTA */}
      <div className="mt-6 bg-gray-50 rounded-2xl p-4">
        <p className="text-sm text-gray-600 mb-3">
          อยากคุยเรื่องการนอน หรือมีคำถามเพิ่มเติม?
        </p>
        <button
          onClick={onChatbot}
          className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 min-h-[44px] transition-colors"
          aria-label="เปิดแชทกับ Nong Hug บน LINE"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M10 1.667C5.4 1.667 1.667 4.87 1.667 8.833c0 2.393 1.36 4.52 3.456 5.896-.15.547-.544 1.978-.623 2.28-.097.37.137.367.29.267.12-.08 1.94-1.307 2.726-1.837.793.12 1.614.184 2.484.184 4.6 0 8.333-3.203 8.333-7.166C18.333 4.869 14.6 1.667 10 1.667z"
              fill="white"
            />
          </svg>
          คุยกับน้องฮักบน LINE
        </button>
      </div>

      {/* Retake */}
      <button
        onClick={onRetake}
        className="mt-4 w-full py-3 rounded-2xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 min-h-[44px]"
        aria-label="ทำแบบประเมินใหม่"
      >
        ทำแบบประเมินใหม่
      </button>

      <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
        ผลนี้เป็นการประเมินเบื้องต้นเท่านั้น ไม่ใช่การวินิจฉัยทางการแพทย์
      </p>
    </div>
  );
}
