export type FrequencyScore = 0 | 1 | 2 | 3;

export type SleepTier = "good" | "fair" | "poor";

export interface PSQIResponses {
  q1_bedtime: string; // "HH:MM"
  q2_latency: FrequencyScore | null;
  q3_waketime: string; // "HH:MM"
  q4_duration: FrequencyScore | null;
  q5_quality: FrequencyScore | null;
  q6_medication: FrequencyScore | null;
  q7_sleepiness: FrequencyScore | null;
  q8_motivation: FrequencyScore | null;
  q9_1: FrequencyScore;
  q9_2: FrequencyScore;
  q9_3: FrequencyScore;
  q9_4: FrequencyScore;
  q9_5: FrequencyScore;
  q9_6: FrequencyScore;
  q9_7: FrequencyScore;
  q9_8: FrequencyScore;
  q9_9: FrequencyScore;
  q9_10_chips: string[];
}

export interface PSQIComponentScores {
  C1: FrequencyScore;
  C2: FrequencyScore;
  C3: FrequencyScore;
  C4: FrequencyScore;
  C5: FrequencyScore;
  C6: FrequencyScore;
  C7: FrequencyScore;
  global: number;
}

export interface PSQIDataOutput {
  timestamp: string;
  user_id: string;
  school_id: string;
  grade: string;
  responses: PSQIResponses;
  scores: PSQIComponentScores;
  tier: SleepTier;
}

export type AssessmentStep =
  | "intro"
  | "q1"
  | "q2"
  | "q3"
  | "q4"
  | "q5"
  | "q6"
  | "q7"
  | "q8"
  | "q9"
  | "result";
