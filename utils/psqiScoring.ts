import type {
  FrequencyScore,
  PSQIComponentScores,
  PSQIResponses,
  SleepTier,
} from "../types/psqi.types";

/**
 * Parses "HH:MM" string to total minutes since midnight.
 */
export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Calculates time-in-bed in hours, handling midnight crossover.
 * E.g. bedtime=22:00, wake=06:00 → 8h
 */
export function calcTimeInBedHours(bedtime: string, waketime: string): number {
  const bed = parseTimeToMinutes(bedtime);
  const wake = parseTimeToMinutes(waketime);
  const diffMinutes = wake >= bed ? wake - bed : 1440 - bed + wake;
  return diffMinutes / 60;
}

/**
 * Calculates sleep efficiency component (C4).
 * actualHours = numeric hours of sleep (derived from q4_duration raw hours or kept as score).
 * Note: q4_duration is already scored 0–3. We need the actual hours from the selection.
 */
export function calcC4FromEfficiency(efficiency: number): FrequencyScore {
  if (efficiency >= 85) return 0;
  if (efficiency >= 75) return 1;
  if (efficiency >= 65) return 2;
  return 3;
}

/**
 * Maps q4_duration score back to midpoint hours for efficiency calculation.
 * >7h→0 → use 7.5h; 6-7h→1 → 6.5h; 5-6h→2 → 5.5h; <5h→3 → 4.5h
 */
export function q4ScoreToHours(score: FrequencyScore): number {
  const map: Record<FrequencyScore, number> = { 0: 7.5, 1: 6.5, 2: 5.5, 3: 4.5 };
  return map[score];
}

function clampToFrequency(n: number): FrequencyScore {
  return Math.min(3, Math.max(0, n)) as FrequencyScore;
}

/**
 * C2 = combined q2 (latency score) + q9_1 (can't sleep within 30 min)
 * sum=0→0, 1-2→1, 3-4→2, 5-6→3
 */
export function calcC2(q2: FrequencyScore, q9_1: FrequencyScore): FrequencyScore {
  const sum = q2 + q9_1;
  if (sum === 0) return 0;
  if (sum <= 2) return 1;
  if (sum <= 4) return 2;
  return 3;
}

/**
 * C5 = sum of q9.2–q9.9
 * sum=0→0, 1-9→1, 10-18→2, 19-27→3
 */
export function calcC5(responses: PSQIResponses): FrequencyScore {
  const sum =
    responses.q9_2 +
    responses.q9_3 +
    responses.q9_4 +
    responses.q9_5 +
    responses.q9_6 +
    responses.q9_7 +
    responses.q9_8 +
    responses.q9_9;
  if (sum === 0) return 0;
  if (sum <= 9) return 1;
  if (sum <= 18) return 2;
  return 3;
}

/**
 * C7 = combined q7 + q8
 * sum=0→0, 1-2→1, 3-4→2, 5-6→3
 */
export function calcC7(q7: FrequencyScore, q8: FrequencyScore): FrequencyScore {
  const sum = q7 + q8;
  if (sum === 0) return 0;
  if (sum <= 2) return 1;
  if (sum <= 4) return 2;
  return 3;
}

/**
 * Calculates all 7 PSQI components and global score.
 * Null responses (unanswered) are treated as 0 for scoring purposes.
 */
export function calcPSQIScores(responses: PSQIResponses): PSQIComponentScores {
  const C1 = (responses.q5_quality ?? 0) as FrequencyScore;

  const C2 = calcC2((responses.q2_latency ?? 0) as FrequencyScore, responses.q9_1);

  const C3 = (responses.q4_duration ?? 0) as FrequencyScore;

  const actualHours = q4ScoreToHours((responses.q4_duration ?? 0) as FrequencyScore);
  const timeInBed = calcTimeInBedHours(responses.q1_bedtime, responses.q3_waketime);
  const efficiency = timeInBed > 0 ? (actualHours / timeInBed) * 100 : 0;
  const C4 = calcC4FromEfficiency(efficiency);

  const C5 = calcC5(responses);

  const C6 = (responses.q6_medication ?? 0) as FrequencyScore;

  const C7 = calcC7(
    (responses.q7_sleepiness ?? 0) as FrequencyScore,
    (responses.q8_motivation ?? 0) as FrequencyScore
  );

  const global = C1 + C2 + C3 + C4 + C5 + C6 + C7;

  return { C1, C2, C3, C4, C5, C6, C7, global };
}

export function getSleepTier(global: number): SleepTier {
  if (global <= 5) return "good";
  if (global <= 10) return "fair";
  return "poor";
}
