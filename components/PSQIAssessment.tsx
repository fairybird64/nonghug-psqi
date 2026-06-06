import React, { useState } from "react";
import IntroScreen from "./IntroScreen";
import QuestionStep from "./QuestionStep";
import TimeInput from "./TimeInput";
import OptionSelect from "./OptionSelect";
import type { Option } from "./OptionSelect";
import DisturbanceGrid from "./DisturbanceGrid";
import type { DisturbanceItem } from "./DisturbanceGrid";
import ChipSelect from "./ChipSelect";
import ResultScreen from "./ResultScreen";
import { calcPSQIScores, getSleepTier } from "../utils/psqiScoring";
import type {
  AssessmentStep,
  FrequencyScore,
  PSQIDataOutput,
  PSQIResponses,
} from "../types/psqi.types";

// ── Option definitions ──────────────────────────────────────────────────────

const Q2_OPTIONS: Option[] = [
  { value: 0, label: "น้อยกว่า 15 นาที", sublabel: "< 15 นาที" },
  { value: 1, label: "15–30 นาที" },
  { value: 2, label: "31–60 นาที" },
  { value: 3, label: "มากกว่า 60 นาที", sublabel: "> 60 นาที" },
];

const Q4_OPTIONS: Option[] = [
  { value: 0, label: "มากกว่า 7 ชั่วโมง", sublabel: "> 7 ชม." },
  { value: 1, label: "6–7 ชั่วโมง" },
  { value: 2, label: "5–6 ชั่วโมง" },
  { value: 3, label: "น้อยกว่า 5 ชั่วโมง", sublabel: "< 5 ชม." },
];

const Q5_OPTIONS: Option[] = [
  { value: 0, label: "ดีมาก" },
  { value: 1, label: "ดี" },
  { value: 2, label: "ไม่ค่อยดี" },
  { value: 3, label: "ไม่ดีเลย" },
];

const Q6_OPTIONS: Option[] = [
  { value: 0, label: "ไม่เคยเลย" },
  { value: 1, label: "น้อยกว่า 1 ครั้ง/สัปดาห์", sublabel: "< 1 ครั้ง/สัปดาห์" },
  { value: 2, label: "1–2 ครั้ง/สัปดาห์" },
  { value: 3, label: "3 ครั้งขึ้นไป/สัปดาห์", sublabel: "≥ 3 ครั้ง/สัปดาห์" },
];

const Q7_OPTIONS: Option[] = [
  { value: 0, label: "ไม่เคยเลย" },
  { value: 1, label: "น้อยกว่า 1 ครั้ง/สัปดาห์" },
  { value: 2, label: "1–2 ครั้ง/สัปดาห์" },
  { value: 3, label: "3 ครั้งขึ้นไป/สัปดาห์" },
];

const Q8_OPTIONS: Option[] = [
  { value: 0, label: "ไม่เป็นปัญหาเลย" },
  { value: 1, label: "เป็นปัญหาเล็กน้อย" },
  { value: 2, label: "เป็นปัญหาพอสมควร" },
  { value: 3, label: "เป็นปัญหามาก" },
];

const DISTURBANCE_ITEMS: DisturbanceItem[] = [
  { key: "q9_1", label: "นอนหลับไม่ได้ภายใน 30 นาที" },
  { key: "q9_2", label: "ตื่นกลางดึกหรือตื่นเช้ากว่าปกติ" },
  { key: "q9_3", label: "ต้องลุกไปห้องน้ำ" },
  { key: "q9_4", label: "หายใจไม่สะดวก / อึดอัด" },
  { key: "q9_5", label: "ไอหรือกรน" },
  { key: "q9_6", label: "รู้สึกหนาวเกินไป" },
  { key: "q9_7", label: "รู้สึกร้อนเกินไป" },
  { key: "q9_8", label: "ฝันร้าย" },
  { key: "q9_9", label: "เจ็บปวดหรือรู้สึกไม่สบายตัว" },
];

const Q9_10_CHIPS = [
  "เสียงรบกวน",
  "แสงรบกวน",
  "ความเครียด",
  "โทรศัพท์/หน้าจอ",
  "อื่นๆ",
];

const STEP_ORDER: AssessmentStep[] = [
  "intro",
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "q8",
  "q9",
  "result",
];

const QUESTION_STEPS = STEP_ORDER.filter((s) => s !== "intro" && s !== "result");
const TOTAL_QUESTION_STEPS = QUESTION_STEPS.length;

function stepNumber(step: AssessmentStep): number {
  return QUESTION_STEPS.indexOf(step) + 1;
}

// ── Default responses ────────────────────────────────────────────────────────

const DEFAULT_RESPONSES: PSQIResponses = {
  q1_bedtime: "22:00",
  q2_latency: null,
  q3_waketime: "06:00",
  q4_duration: null,
  q5_quality: null,
  q6_medication: null,
  q7_sleepiness: null,
  q8_motivation: null,
  q9_1: 0,
  q9_2: 0,
  q9_3: 0,
  q9_4: 0,
  q9_5: 0,
  q9_6: 0,
  q9_7: 0,
  q9_8: 0,
  q9_9: 0,
  q9_10_chips: [],
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface PSQIAssessmentProps {
  userId?: string;
  schoolId?: string;
  grade?: string;
  onSubmit?: (data: PSQIDataOutput) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PSQIAssessment({
  userId = "anonymous",
  schoolId = "",
  grade = "",
  onSubmit,
}: PSQIAssessmentProps) {
  const [step, setStep] = useState<AssessmentStep>("intro");
  const [responses, setResponses] = useState<PSQIResponses>({ ...DEFAULT_RESPONSES });
  const [result, setResult] = useState<{ scores: ReturnType<typeof calcPSQIScores>; tier: ReturnType<typeof getSleepTier> } | null>(null);

  function update<K extends keyof PSQIResponses>(key: K, value: PSQIResponses[K]) {
    setResponses((prev) => ({ ...prev, [key]: value }));
  }

  function updateDisturbance(key: string, value: FrequencyScore) {
    setResponses((prev) => ({ ...prev, [key]: value }));
  }

  function goNext() {
    const idx = STEP_ORDER.indexOf(step);
    setStep(STEP_ORDER[idx + 1]);
  }

  function goBack() {
    const idx = STEP_ORDER.indexOf(step);
    if (idx > 0) setStep(STEP_ORDER[idx - 1]);
  }

  function handleSubmit() {
    const scores = calcPSQIScores(responses);
    const tier = getSleepTier(scores.global);
    setResult({ scores, tier });

    const output: PSQIDataOutput = {
      timestamp: new Date().toISOString(),
      user_id: userId,
      school_id: schoolId,
      grade,
      responses,
      scores,
      tier,
    };

    onSubmit?.(output);
    setStep("result");
  }

  function handleRetake() {
    setResponses({ ...DEFAULT_RESPONSES });
    setResult(null);
    setStep("intro");
  }

  function handleChatbot() {
    const message = `สวัสดีน้องฮัก ฉันเพิ่งทำแบบประเมินการนอน ได้คะแนน ${result?.scores.global ?? "?"}/21 อยากขอคำแนะนำเพิ่มเติม`;
    // LINE sendPrompt to @nonghug
    if (typeof window !== "undefined" && (window as any).liff) {
      (window as any).liff.sendMessages([{ type: "text", text: message }]).catch(() => {
        window.open(`https://line.me/R/oaMessage/@nonghug/?${encodeURIComponent(message)}`, "_blank");
      });
    } else {
      window.open(`https://line.me/R/oaMessage/@nonghug/?${encodeURIComponent(message)}`, "_blank");
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────

  if (step === "intro") {
    return <IntroScreen onStart={goNext} />;
  }

  if (step === "result" && result) {
    return (
      <ResultScreen
        scores={result.scores}
        tier={result.tier}
        onChatbot={handleChatbot}
        onRetake={handleRetake}
      />
    );
  }

  const n = stepNumber(step);
  const isLastQuestion = step === "q9";

  if (step === "q1") {
    return (
      <QuestionStep
        stepNumber={n}
        totalSteps={TOTAL_QUESTION_STEPS}
        question="ปกติคุณเข้านอน (ปิดไฟนอน) กี่โมง?"
        subtext="ในช่วง 1 เดือนที่ผ่านมา เวลาปกติที่คุณเข้านอน"
        onBack={goBack}
        onNext={goNext}
      >
        <TimeInput
          id="q1"
          label="เวลาเข้านอน"
          value={responses.q1_bedtime}
          onChange={(v) => update("q1_bedtime", v)}
        />
      </QuestionStep>
    );
  }

  if (step === "q2") {
    return (
      <QuestionStep
        stepNumber={n}
        totalSteps={TOTAL_QUESTION_STEPS}
        question="ปกติใช้เวลานานแค่ไหนกว่าจะหลับ?"
        subtext="นับตั้งแต่ปิดไฟจนกว่าจะหลับได้จริงๆ"
        onBack={goBack}
        onNext={goNext}
        nextDisabled={responses.q2_latency === null}
      >
        <OptionSelect
          name="เวลาที่ใช้หลับ"
          options={Q2_OPTIONS}
          value={responses.q2_latency}
          onChange={(v) => update("q2_latency", v)}
        />
      </QuestionStep>
    );
  }

  if (step === "q3") {
    return (
      <QuestionStep
        stepNumber={n}
        totalSteps={TOTAL_QUESTION_STEPS}
        question="ปกติตื่นนอนกี่โมง?"
        subtext="ในช่วง 1 เดือนที่ผ่านมา เวลาที่ตื่นนอนปกติ"
        onBack={goBack}
        onNext={goNext}
      >
        <TimeInput
          id="q3"
          label="เวลาตื่นนอน"
          value={responses.q3_waketime}
          onChange={(v) => update("q3_waketime", v)}
        />
      </QuestionStep>
    );
  }

  if (step === "q4") {
    return (
      <QuestionStep
        stepNumber={n}
        totalSteps={TOTAL_QUESTION_STEPS}
        question="ปกติในคืนหนึ่ง นอนหลับจริงๆ กี่ชั่วโมง?"
        subtext="ไม่นับเวลาที่นอนเฉยๆ แต่ยังไม่หลับ"
        onBack={goBack}
        onNext={goNext}
        nextDisabled={responses.q4_duration === null}
      >
        <OptionSelect
          name="ชั่วโมงการนอน"
          options={Q4_OPTIONS}
          value={responses.q4_duration}
          onChange={(v) => update("q4_duration", v)}
        />
      </QuestionStep>
    );
  }

  if (step === "q5") {
    return (
      <QuestionStep
        stepNumber={n}
        totalSteps={TOTAL_QUESTION_STEPS}
        question="โดยรวมแล้ว คุณรู้สึกว่าการนอนหลับของคุณเป็นอย่างไร?"
        subtext="ในช่วง 1 เดือนที่ผ่านมา"
        onBack={goBack}
        onNext={goNext}
        nextDisabled={responses.q5_quality === null}
      >
        <OptionSelect
          name="คุณภาพการนอนโดยรวม"
          options={Q5_OPTIONS}
          value={responses.q5_quality}
          onChange={(v) => update("q5_quality", v)}
        />
      </QuestionStep>
    );
  }

  if (step === "q6") {
    return (
      <QuestionStep
        stepNumber={n}
        totalSteps={TOTAL_QUESTION_STEPS}
        question="ในช่วง 1 เดือนที่ผ่านมา คุณใช้ยานอนหลับบ้างไหม?"
        subtext="ทั้งยาที่แพทย์สั่งและยาที่ซื้อเอง"
        onBack={goBack}
        onNext={goNext}
        nextDisabled={responses.q6_medication === null}
      >
        <OptionSelect
          name="การใช้ยานอนหลับ"
          options={Q6_OPTIONS}
          value={responses.q6_medication}
          onChange={(v) => update("q6_medication", v)}
        />
      </QuestionStep>
    );
  }

  if (step === "q7") {
    return (
      <QuestionStep
        stepNumber={n}
        totalSteps={TOTAL_QUESTION_STEPS}
        question="ในช่วง 1 เดือนที่ผ่านมา คุณรู้สึกง่วงหรือเพลียระหว่างวันบ่อยแค่ไหน?"
        subtext="เช่น ง่วงตอนเรียน ระหว่างทำงาน หรือกินข้าว"
        onBack={goBack}
        onNext={goNext}
        nextDisabled={responses.q7_sleepiness === null}
      >
        <OptionSelect
          name="ความง่วงกลางวัน"
          options={Q7_OPTIONS}
          value={responses.q7_sleepiness}
          onChange={(v) => update("q7_sleepiness", v)}
        />
      </QuestionStep>
    );
  }

  if (step === "q8") {
    return (
      <QuestionStep
        stepNumber={n}
        totalSteps={TOTAL_QUESTION_STEPS}
        question="ความง่วงหรือเพลียส่งผลต่อแรงจูงใจในการทำกิจกรรมต่างๆ มากแค่ไหน?"
        subtext="เช่น การเรียน กิจกรรม หรือการพบปะผู้คน"
        onBack={goBack}
        onNext={goNext}
        nextDisabled={responses.q8_motivation === null}
      >
        <OptionSelect
          name="ผลกระทบต่อแรงจูงใจ"
          options={Q8_OPTIONS}
          value={responses.q8_motivation}
          onChange={(v) => update("q8_motivation", v)}
        />
      </QuestionStep>
    );
  }

  if (step === "q9") {
    const disturbanceValues: Record<string, FrequencyScore> = {
      q9_1: responses.q9_1,
      q9_2: responses.q9_2,
      q9_3: responses.q9_3,
      q9_4: responses.q9_4,
      q9_5: responses.q9_5,
      q9_6: responses.q9_6,
      q9_7: responses.q9_7,
      q9_8: responses.q9_8,
      q9_9: responses.q9_9,
    };

    return (
      <QuestionStep
        stepNumber={n}
        totalSteps={TOTAL_QUESTION_STEPS}
        question="ในช่วง 1 เดือนที่ผ่านมา สิ่งต่อไปนี้รบกวนการนอนบ่อยแค่ไหน?"
        onBack={goBack}
        onNext={handleSubmit}
        nextLabel="ดูผล"
      >
        <div className="space-y-6">
          <DisturbanceGrid
            items={DISTURBANCE_ITEMS}
            values={disturbanceValues}
            onChange={updateDisturbance}
          />

          <div className="border-t border-gray-100 pt-4">
            <ChipSelect
              label="มีสิ่งอื่นที่ทำให้นอนหลับยากอีกไหม? (ไม่บังคับ)"
              options={Q9_10_CHIPS}
              selected={responses.q9_10_chips}
              onChange={(v) => update("q9_10_chips", v)}
            />
          </div>
        </div>
      </QuestionStep>
    );
  }

  return null;
}
