# PxD Location Engine — Field Reference Card
**Companion to SPEC.md v1.1 · Engine rev G · GATE PENDING**
**Expiry: this card is a crutch. Napkin test due 48h from first use — reproduce the matrix blind or keep studying.**

---

## 1. VERDICT LEGEND — what the cell says / what it means / WHAT YOU DO

| Cell | Trigger | Plain meaning | YOUR ACTION |
|---|---|---|---|
| **LONG VALID** | Discount + Confirmed Uptrend | River trade. Bull trend on a dip, price cheap. | Full system: fib the displacement leg, stalk OTE, target continuation. |
| **SHORT VALID** | Premium + Confirmed Downtrend | Mirror. Bear trend on a bounce, price expensive. | Same, short side. |
| **LONG VALID (rng)** | Discount + Sideways OR Unconfirmed Bullish | Bounce trade. Range floor, or fresh bullish break at cheap location (trade #1 anatomy). | Long allowed. ROTATION targets (EQ / range top). Humble exits. Do NOT hold like a trend trade. |
| **SHORT VALID (rng)** | Premium + Sideways OR Unconfirmed Bearish | Ball at the ceiling / fresh bearish break, expensive. | Short allowed. Rotation targets. Take profit early. |
| **CT WATCH** | Any fade: Disc+Down, Prem+Up, or fading a fresh unconfirmed break | The 88% club — ON PROBATION (n≥20 decides). | NOT a signal. A summons: manual review + strong HTF zone REQUIRED. Log it whether taken or skipped. |
| **EQ (NO TRADE)** | Location 40–60%, any trend | Dead center. No edge. Tag names the cause — do not confuse with NO ACTION. | Nothing. Absolute. Trade #6 is the tombstone. Set 40/60 alerts, walk away. |
| **NO ACTION** | Residual cell | Matches nothing tradeable. | Nothing. |
| **—** (dash) | No computable location | Engine honestly says "I don't know." | Chart it manually or skip the pair. |

### Modifiers (not verdicts — flags on the numbers)
| Flag | Meaning | YOUR ACTION |
|---|---|---|
| **\*** on Loc% | FALLBACK leg (no close-beyond break in window) — displacement rule couldn't fire | Second-class reading. Weigh lighter, verify leg on chart yourself. |
| **Loc% <0 or >100** | Price ran beyond the measured leg | MANUAL CHECK section per Friday workflow. Not a "deep discount gift." |
| **Unconfirmed** status | Regime broke in, count 0–1, unproven | This is WHY the verdict routes through (rng) or WATCH. Transition ≠ trend. |

## 2. THE MATRIX — quick grid (Location down, Direction across)

|  | **Conf. Up** | **Conf. Down** | **Sideways** | **Unconf. Bull** | **Unconf. Bear** |
|---|---|---|---|---|---|
| **Discount <40** | LONG VALID | CT WATCH | LONG VALID (rng) | LONG VALID (rng) | CT WATCH |
| **EQ 40–60** | NO TRADE | NO TRADE | NO TRADE | NO TRADE | NO TRADE |
| **Premium >60** | CT WATCH | SHORT VALID | SHORT VALID (rng) | SHORT VALID (rng) | CT WATCH |

**Governing law: the engine NEVER auto-greenlights a fade. Every fade = WATCH = your eyes + HTF zone.**

## 3. VERIFICATION CHECKLIST — run in order, log each result

| # | Check | How | PASS = |
|---|---|---|---|
| 1 | Matrix audit | All 20 pairs, both rows: trace each Verdict cell to grid above | Every cell traceable. One untraceable = STOP + screenshot |
| 2 | Arithmetic | 3 pairs (5-digit, JPY, cross): (price−LegL)/(LegH−LegL)×100 on calculator vs Loc% | Matches within rounding on all 3 |
| 3 | MTF consistency | Same pair, D row read from Daily chart vs 4H chart (and 4H row both ways) | Identical cells both windows |
| 4 | Replay determinism | Bar replay EURUSD 4H through the June LL→HL→break. Step bar by bar | Confirmed pivots NEVER move; regime flips ONLY on bar close; end state = Night 3 certified state |
| 5 | Edge branches | Find one \* (fallback) pair + one out-of-range Loc% on watchlist | Each makes sense on the chart (genuinely no break / price beyond leg) |
| GATE | **Blind fib — FRESH EYES ONLY** | 5 pairs Daily (incl. AUDUSD): manual fib FIRST, sealed, then reveal engine Leg H/L | Legs agree, or every disagreement survives the one-sentence test |

## 4. KNOWN DIFFERENCES — expected, pre-logged, do NOT panic

1. **Strength column absent** — deliberately not cloned. Ignore in all comparisons.
2. **Equal-pivot convention** — engine is STRICT (>, <); Toolkit labels use >=. Label mismatches near equal pivots = this.
3. **Shallow-window pivots** — engine registers swings the paid tool skips in grinding trends (USDJPY 4H: 2/25 extra). May reach Confirmed one pivot earlier. LOG every case.
4. **Right-edge lag** — engine's newest pivot confirms later than paid tool's repainting zigzag point. Strictness, not a bug.
5. **MTF rows breathe intraday** — Loc% updates live on the developing HTF bar, settles at its close. Regime flips still require closed bars.

## 5. VALIDATION LOG ENTRY FORMAT (one line per disagreement)
`DATE | PAIR TF | engine: X | paid: Y | my blind read: Z | hindsight: __ | bin: rule-gap / freelance / discretion / known-diff #`

---
*Cell you can't explain = napkin rep owed. Engine enforcing rules you can't recite = a document, not a system.*
