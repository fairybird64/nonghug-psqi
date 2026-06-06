# PSQI Module — Nong Hug Platform

Pittsburgh Sleep Quality Index (PSQI) self-assessment module for Thai adolescent users (ages 13–18).

---

## Scoring Algorithm

The PSQI produces a **Global Score (0–21)** from 7 component scores (each 0–3). Higher = worse sleep quality.

### Component Definitions

| Component | Source | What it measures |
|-----------|--------|-----------------|
| C1 | Q5 | Subjective sleep quality |
| C2 | Q2 + Q9.1 | Sleep latency |
| C3 | Q4 | Sleep duration |
| C4 | Calculated | Sleep efficiency (%) |
| C5 | Q9.2–Q9.9 | Sleep disturbances |
| C6 | Q6 | Use of sleep medication |
| C7 | Q7 + Q8 | Daytime dysfunction |

### C1 — Subjective Sleep Quality
Direct map from Q5:
- ดีมาก → 0, ดี → 1, ไม่ค่อยดี → 2, ไม่ดีเลย → 3

### C2 — Sleep Latency
Combines Q2 score + Q9.1 score:
| Q2 + Q9.1 sum | C2 |
|---|---|
| 0 | 0 |
| 1–2 | 1 |
| 3–4 | 2 |
| 5–6 | 3 |

Q2 scoring: <15min=0, 16-30min=1, 31-60min=2, >60min=3
Q9.1 scoring: ไม่เคย=0, <1×/wk=1, 1-2×/wk=2, ≥3×/wk=3

### C3 — Sleep Duration
Direct map from Q4:
- >7h → 0, 6-7h → 1, 5-6h → 2, <5h → 3

### C4 — Sleep Efficiency
```
efficiency = (actual_sleep_hours / time_in_bed_hours) × 100
time_in_bed = wake_time − bedtime  (handles midnight crossover)
```
Midpoint hours used for Q4 categories: >7h→7.5h, 6-7h→6.5h, 5-6h→5.5h, <5h→4.5h

| Efficiency | C4 |
|---|---|
| ≥85% | 0 |
| 75–84% | 1 |
| 65–74% | 2 |
| <65% | 3 |

### C5 — Sleep Disturbances
Sum of Q9.2 through Q9.9 (each 0–3, max sum = 24):

| Sum | C5 |
|---|---|
| 0 | 0 |
| 1–9 | 1 |
| 10–18 | 2 |
| 19–27 | 3 |

**Note:** Q9.10 (chip selections) is qualitative only and does NOT affect C5 or any component score.

### C6 — Sleep Medication
Direct map from Q6:
- ไม่เคย=0, <1×/wk=1, 1-2×/wk=2, ≥3×/wk=3

### C7 — Daytime Dysfunction
Combines Q7 score + Q8 score:
| Q7 + Q8 sum | C7 |
|---|---|
| 0 | 0 |
| 1–2 | 1 |
| 3–4 | 2 |
| 5–6 | 3 |

### Global Score & Tiers

```
Global = C1 + C2 + C3 + C4 + C5 + C6 + C7  (range: 0–21)
```

| Score | Tier | Color |
|---|---|---|
| 0–5 | Good (การนอนดี) | Teal #1D9E75 |
| 6–10 | Fair (ยังปรับได้) | Amber #BA7517 |
| ≥11 | Poor (ต้องดูแล) | Coral #D85A30 |

> Clinical cutoff: PSQI > 5 indicates "poor sleeper" (Buysse et al., 1989).
> This module uses 3 tiers to provide graduated guidance rather than a binary result.

---

## File Structure

```
psqi-module/
├── components/
│   ├── PSQIAssessment.tsx     # Main orchestrator + state machine
│   ├── IntroScreen.tsx        # Intro + consent screen
│   ├── QuestionStep.tsx       # Step wrapper with progress bar + stepper dots
│   ├── TimeInput.tsx          # HH:MM select pickers
│   ├── OptionSelect.tsx       # 4-option radio button grid
│   ├── DisturbanceGrid.tsx    # Q9.1–9.9 frequency table
│   ├── ChipSelect.tsx         # Q9.10 multi-select chips
│   ├── ResultScreen.tsx       # Score display + component breakdown
│   └── ActionGuide.tsx        # 3-tier action guide
├── utils/
│   ├── psqiScoring.ts         # Pure scoring functions
│   └── psqiScoring.test.ts    # Unit tests (Jest/Vitest compatible)
├── types/
│   └── psqi.types.ts          # TypeScript types
└── README.md
```

---

## Usage

```tsx
import PSQIAssessment from "./components/PSQIAssessment";

<PSQIAssessment
  userId="hashed-user-id"
  schoolId="school-001"
  grade="ม.4"
  onSubmit={(data) => {
    // data is PSQIDataOutput — send to dashboard API
    console.log(data);
  }}
/>
```

### Data Output Shape

```json
{
  "timestamp": "2026-06-06T10:00:00.000Z",
  "user_id": "abc123",
  "school_id": "school-001",
  "grade": "ม.4",
  "responses": {
    "q1_bedtime": "23:00",
    "q2_latency": 1,
    "q3_waketime": "06:00",
    "q4_duration": 1,
    "q5_quality": 1,
    "q6_medication": 0,
    "q7_sleepiness": 1,
    "q8_motivation": 1,
    "q9_1": 1, "q9_2": 0, "q9_3": 0, "q9_4": 0,
    "q9_5": 0, "q9_6": 0, "q9_7": 1, "q9_8": 0, "q9_9": 0,
    "q9_10_chips": ["ความเครียด", "โทรศัพท์/หน้าจอ"]
  },
  "scores": { "C1": 1, "C2": 1, "C3": 1, "C4": 1, "C5": 1, "C6": 0, "C7": 1, "global": 7 },
  "tier": "fair"
}
```

---

## Running Unit Tests

```bash
# Jest
npx jest psqi-module/utils/psqiScoring.test.ts

# Vitest
npx vitest psqi-module/utils/psqiScoring.test.ts
```

---

## References

Buysse, D. J., Reynolds, C. F., Monk, T. H., Berman, S. R., & Kupfer, D. J. (1989).
The Pittsburgh Sleep Quality Index: A new instrument for psychiatric practice and research.
*Psychiatry Research*, 28(2), 193–213. https://doi.org/10.1016/0165-1781(89)90047-4
