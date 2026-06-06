import React from "react";

interface QuestionStepProps {
  stepNumber: number;
  totalSteps: number;
  question: string;
  subtext?: string;
  children: React.ReactNode;
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
}

export default function QuestionStep({
  stepNumber,
  totalSteps,
  question,
  subtext,
  children,
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel = "ถัดไป",
}: QuestionStepProps) {
  const progress = (stepNumber / totalSteps) * 100;

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto px-5 py-6">
      {/* Progress bar */}
      <div
        className="w-full h-1.5 bg-gray-100 rounded-full mb-4"
        role="progressbar"
        aria-valuenow={stepNumber}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`ข้อที่ ${stepNumber} จาก ${totalSteps}`}
      >
        <div
          className="h-full bg-teal-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stepper dots */}
      <div className="flex items-center justify-center gap-1.5 mb-6" aria-hidden="true">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-200 ${
              i + 1 === stepNumber
                ? "w-4 h-2 bg-teal-500"
                : i + 1 < stepNumber
                ? "w-2 h-2 bg-teal-300"
                : "w-2 h-2 bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <div className="mb-6">
        <p className="text-xs font-medium text-teal-600 mb-1">ข้อ {stepNumber}</p>
        <h2 className="text-lg font-semibold text-gray-800 leading-snug">{question}</h2>
        {subtext && <p className="text-sm text-gray-500 mt-1">{subtext}</p>}
      </div>

      {/* Content */}
      <div className="flex-1">{children}</div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        {onBack && (
          <button
            onClick={onBack}
            className="flex-none px-5 py-3 rounded-2xl border border-gray-200 text-gray-600 font-medium text-sm min-h-[44px] hover:bg-gray-50 active:bg-gray-100 transition-colors"
            aria-label="ย้อนกลับ"
          >
            ← ย้อนกลับ
          </button>
        )}
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="flex-1 py-3 rounded-2xl bg-teal-600 text-white font-semibold text-base min-h-[44px] hover:bg-teal-700 active:bg-teal-800 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
          aria-label={nextDisabled ? `${nextLabel} (กรุณาเลือกคำตอบก่อน)` : nextLabel}
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
