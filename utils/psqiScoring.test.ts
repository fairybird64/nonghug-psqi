import {
  calcC2,
  calcC4FromEfficiency,
  calcC5,
  calcC7,
  calcPSQIScores,
  calcTimeInBedHours,
  getSleepTier,
  parseTimeToMinutes,
  q4ScoreToHours,
} from "./psqiScoring";
import type { PSQIResponses } from "../types/psqi.types";

// ── parseTimeToMinutes ───────────────────────────────────────────────────────
test("parseTimeToMinutes: 22:30 → 1350", () => {
  expect(parseTimeToMinutes("22:30")).toBe(1350);
});

test("parseTimeToMinutes: 00:00 → 0", () => {
  expect(parseTimeToMinutes("00:00")).toBe(0);
});

// ── calcTimeInBedHours ───────────────────────────────────────────────────────
test("same-day: 22:00→06:00 → 8h", () => {
  expect(calcTimeInBedHours("22:00", "06:00")).toBe(8);
});

test("midnight crossover: 23:00→07:00 → 8h", () => {
  expect(calcTimeInBedHours("23:00", "07:00")).toBe(8);
});

test("no crossover: 21:00→05:30 → 8.5h", () => {
  expect(calcTimeInBedHours("21:00", "05:30")).toBe(8.5);
});

// ── calcC4FromEfficiency ─────────────────────────────────────────────────────
test("efficiency ≥85% → 0", () => expect(calcC4FromEfficiency(90)).toBe(0));
test("efficiency 75-84% → 1", () => expect(calcC4FromEfficiency(80)).toBe(1));
test("efficiency 65-74% → 2", () => expect(calcC4FromEfficiency(70)).toBe(2));
test("efficiency <65% → 3", () => expect(calcC4FromEfficiency(60)).toBe(3));

// ── q4ScoreToHours ────────────────────────────────────────────────────────────
test("q4=0 → 7.5h", () => expect(q4ScoreToHours(0)).toBe(7.5));
test("q4=3 → 4.5h", () => expect(q4ScoreToHours(3)).toBe(4.5));

// ── calcC2 ────────────────────────────────────────────────────────────────────
test("C2: q2=0,q9_1=0 → 0", () => expect(calcC2(0, 0)).toBe(0));
test("C2: q2=1,q9_1=1 → 1", () => expect(calcC2(1, 1)).toBe(1));
test("C2: q2=2,q9_1=2 → 2", () => expect(calcC2(2, 2)).toBe(3));
test("C2: q2=1,q9_1=0 → 1", () => expect(calcC2(1, 0)).toBe(1));
test("C2: q2=2,q9_1=1 → 2", () => expect(calcC2(2, 1)).toBe(2));

// ── calcC5 ────────────────────────────────────────────────────────────────────
const baseResponses: PSQIResponses = {
  q1_bedtime: "22:00",
  q2_latency: 0,
  q3_waketime: "06:00",
  q4_duration: 0,
  q5_quality: 0,
  q6_medication: 0,
  q7_sleepiness: 0,
  q8_motivation: 0,
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

test("C5: all zeros → 0", () => expect(calcC5(baseResponses)).toBe(0));
test("C5: sum=5 → 1", () => {
  expect(calcC5({ ...baseResponses, q9_2: 2, q9_3: 2, q9_4: 1 })).toBe(1);
});
test("C5: sum=10 → 2", () => {
  expect(
    calcC5({ ...baseResponses, q9_2: 2, q9_3: 2, q9_4: 2, q9_5: 2, q9_6: 2 })
  ).toBe(2);
});
test("C5: sum=19 → 3", () => {
  expect(
    calcC5({
      ...baseResponses,
      q9_2: 3,
      q9_3: 3,
      q9_4: 3,
      q9_5: 3,
      q9_6: 3,
      q9_7: 2,
      q9_8: 1,
      q9_9: 1,
    })
  ).toBe(3);
});

// ── calcC7 ────────────────────────────────────────────────────────────────────
test("C7: 0,0 → 0", () => expect(calcC7(0, 0)).toBe(0));
test("C7: 1,1 → 1", () => expect(calcC7(1, 1)).toBe(1));
test("C7: 2,2 → 3", () => expect(calcC7(2, 2)).toBe(3));

// ── calcPSQIScores ────────────────────────────────────────────────────────────
test("perfect sleeper → global=0", () => {
  const r: PSQIResponses = { ...baseResponses };
  const scores = calcPSQIScores(r);
  // C4: 7.5h / 8h = 93.75% → 0
  expect(scores.global).toBe(0);
  expect(scores.C4).toBe(0);
});

test("poor sleeper → global≥11", () => {
  const r: PSQIResponses = {
    ...baseResponses,
    q1_bedtime: "02:00",
    q3_waketime: "06:00",
    q4_duration: 3,
    q5_quality: 3,
    q6_medication: 3,
    q7_sleepiness: 3,
    q8_motivation: 3,
    q9_1: 3,
    q9_2: 3,
    q9_3: 2,
  };
  const scores = calcPSQIScores(r);
  expect(scores.global).toBeGreaterThanOrEqual(11);
});

// ── getSleepTier ───────────────────────────────────────────────────────────────
test("global≤5 → good", () => expect(getSleepTier(5)).toBe("good"));
test("global=6 → fair", () => expect(getSleepTier(6)).toBe("fair"));
test("global=10 → fair", () => expect(getSleepTier(10)).toBe("fair"));
test("global=11 → poor", () => expect(getSleepTier(11)).toBe("poor"));
