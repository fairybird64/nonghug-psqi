import React from "react";
import type { SleepTier } from "../types/psqi.types";

interface TierConfig {
  color: string;
  bg: string;
  border: string;
  icon: string;
  title: string;
  message: string;
  actions: string[];
}

const TIER_CONFIG: Record<SleepTier, TierConfig> = {
  good: {
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
    icon: "🌙",
    title: "การนอนหลับดี",
    message: "การนอนของเราอยู่ในเกณฑ์ดี",
    actions: [
      "รักษาเวลานอน-ตื่นให้สม่ำเสมอ (แตกต่างไม่เกิน 1 ชม. แม้วันหยุด)",
      "ลดหน้าจอก่อนนอน 30 นาที (blue light ชะลอ melatonin)",
      "สังเกตตัวเองเป็นประจำ — การนอนมักเปลี่ยนแปลงก่อนที่จะเกิดภาวะอารมณ์เด่นๆ จนสังเกตได้",
    ],
  },
  fair: {
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "☁️",
    title: "การนอนหลับพอปรับได้",
    message: "การนอนของเรายังปรับได้",
    actions: [
      "สร้าง routine ก่อนนอน 15 นาที (ควรทำทุกคืน)",
      "หลีกเลี่ยงคาเฟอีนหลังบ่าย 3 (เช่น ชานม/น้ำอัดลม/ชาเขียวฯลฯ)",
      "ลองหายใจ 4-7-8 ก่อนนอน (เข้า 4 วิ / กลั้น 7 วิ / ออก 8 วิ)",
      "ถ้า 2 สัปดาห์ยังไม่ดีขึ้น ลองปรึกษาครูแนะแนวดู",
    ],
  },
  poor: {
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "🌧",
    title: "การนอนหลับต้องดูแล",
    message: "การนอนส่งผลต่อร่างกายและอารมณ์ของเรา",
    actions: [
      "กำหนดเวลาตื่นให้แน่นอนก่อน (เวลานอนจะตามมาเอง)",
      "ใช้เตียงเพื่อนอนเท่านั้น (ไม่เล่นโทรศัพท์/ทำการบ้านบนเตียง)",
      "จดสิ่งที่ค้างในหัวก่อนนอน (วางไว้ข้างนอก ค่อยคิดพรุ่งนี้)",
      "พูดคุยกับครูแนะแนวหรือผู้ใหญ่ที่ไว้ใจได้เกี่ยวกับความกังวลหรือสิ่งที่ค้างคาใจที่ทำให้นอนไม่หลับ",
    ],
  },
};

interface ActionGuideProps {
  tier: SleepTier;
}

export default function ActionGuide({ tier }: ActionGuideProps) {
  const config = TIER_CONFIG[tier];

  return (
    <div
      className={`w-full rounded-2xl border-2 ${config.border} ${config.bg} p-5`}
      role="region"
      aria-label={`คำแนะนำสำหรับ${config.title}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl" aria-hidden="true">{config.icon}</span>
        <h3 className={`font-semibold text-base ${config.color}`}>{config.title}</h3>
      </div>
      <p className={`text-sm font-medium ${config.color} mb-4`}>{config.message}</p>
      <ul className="space-y-2.5" aria-label="สิ่งที่ทำได้">
        {config.actions.map((action, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className={`mt-0.5 text-sm font-bold ${config.color} flex-none`} aria-hidden="true">
              {i + 1}.
            </span>
            <span className="text-sm text-gray-700 leading-relaxed">{action}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
