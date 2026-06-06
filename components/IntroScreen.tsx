import React from "react";

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="flex flex-col items-center px-5 py-8 max-w-md mx-auto min-h-screen">
      {/* Icon */}
      <div className="mt-4 mb-6 w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 8C15.163 8 8 15.163 8 24s7.163 16 16 16 16-7.163 16-16S32.837 8 24 8z" fill="#D1FAE5"/>
          <path d="M24 12a9 9 0 100 18A9 9 0 0024 12z" fill="#1D9E75" opacity="0.3"/>
          <path d="M20 22c0-2.21 1.79-4 4-4s4 1.79 4 4v4H20v-4z" fill="#1D9E75"/>
          <rect x="18" y="26" width="12" height="2" rx="1" fill="#1D9E75"/>
          <path d="M14 34c2-4 6-6 10-6s8 2 10 6" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
        แบบประเมินคุณภาพการนอน
      </h1>
      <p className="text-sm text-gray-500 text-center mb-6">PSQI · Pittsburgh Sleep Quality Index</p>

      {/* Purpose */}
      <div className="w-full bg-teal-50 rounded-2xl p-4 mb-4">
        <p className="text-sm text-teal-800 leading-relaxed">
          แบบประเมินนี้ช่วยให้เราเข้าใจคุณภาพการนอนหลับของตัวเองในช่วง <strong>1 เดือนที่ผ่านมา</strong>{" "}
          ผลที่ได้จะช่วยให้รู้ว่าการนอนส่งผลต่อสุขภาพและอารมณ์ของเราอย่างไร
        </p>
      </div>

      {/* Time estimate */}
      <div className="w-full flex items-center gap-3 bg-gray-50 rounded-2xl p-4 mb-4">
        <span className="text-2xl" aria-hidden="true">⏱</span>
        <p className="text-sm text-gray-600">ใช้เวลาประมาณ <strong>3–5 นาที</strong></p>
      </div>

      {/* Privacy note */}
      <div className="w-full flex items-start gap-3 bg-gray-50 rounded-2xl p-4 mb-8">
        <span className="text-2xl mt-0.5" aria-hidden="true">🔒</span>
        <p className="text-sm text-gray-600 leading-relaxed">
          ข้อมูลของคุณจะถูกเก็บเป็น <strong>ความลับ</strong> และใช้เพื่อการวิจัยในภาพรวม{" "}
          ไม่มีการระบุตัวตน ไม่มีคะแนนถูก-ผิด
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-base py-4 rounded-2xl transition-colors min-h-[44px]"
        aria-label="เริ่มทำแบบประเมินคุณภาพการนอน"
      >
        เริ่มประเมิน
      </button>

      <p className="mt-4 text-xs text-gray-400 text-center">
        การทำแบบประเมินนี้เป็นความสมัครใจ คุณสามารถหยุดได้ทุกเมื่อ
      </p>
    </div>
  );
}
