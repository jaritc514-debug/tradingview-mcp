# PxD Location Engine — Specification v1.0
**Date locked:** July 5, 2026
**Status:** Spec complete. Code phase next. Validation phase after.
**Replaces:** prefilter.txt + batch-prefilter.txt (both DEPRECATED on ship)

---

## Purpose
Self-contained Pine Script v6 indicator that outputs Location, Direction/Status, and a trade Verdict per the OTE x PxD swing framework, with native TradingView alerts across the 20-pair FX watchlist. Replaces the LLM/MCP prefilter workflow. Removes dependency on the paid trend indicator after validation.

---

## 1. Pivot Engine (foundation — single source of structural truth)
- Algorithm: MetaTrader-style ZigZag
- Settings: **Depth 12, Deviation 3, Backstep 1** (exposed as inputs, these defaults)
- Deviation unit: to be defined precisely in code phase (points vs pips on 5-digit quotes) — must behave identically across all FX pairs
- **IRON LAW:** State machine consumes CONFIRMED pivots only. The developing/repainting extreme is never a pivot: it does not count toward status, does not anchor legs, does not set break levels.
- Known cost: verdict flips lag the visual zigzag by design. Accepted — no repaint > early signal.
- PxD Toolkit H1–H3/L1–L3 table = cosmetic in v1. Engine ZigZag is the only structural authority for verdicts. Unification = v2.

## 2. Structure Labeling
- Every confirmed pivot labeled: HH / HL / LH / LL
- High-stream and low-stream tracked **independently** (a HL between two LHs does not reset the LH count, and vice versa)

## 3. Regime State Machine (Direction + Status)
- **Regime flip trigger:** candle CLOSE beyond the most recent opposing pivot level.
  - Close above most recent LH → Bullish regime
  - Close below most recent HL → Bearish regime
  - Wicks NEVER flip regime.
- **Break buffer:** input exists (ATR-fraction, close must exceed level + buffer). **Default OFF. Hardcoded off during validation.** May be enabled post-validation only with replay/demo evidence.
- **Status within regime:**
  - Bullish: count consecutive HLs (launch HL of the breaking move = #1). 1 HL = Unconfirmed Bullish. 2+ consecutive HLs = Confirmed Bullish.
  - Bearish: mirror with LHs.
  - Opposing-stream pivots are ignored for status; they matter only if they produce an opposite regime-flipping close.
- **Regime death:** opposite close-beyond break. Nothing else.

## 4. Location Module
- **Leg anchor (primary):** displacement leg — origin pivot to post-break extreme of the most recent leg that closed beyond a prior swing (BOS/MSS)
- **Fallback:** most recent adjacent confirmed H/L pivot pair, used only when no BOS exists in the tracked pivot window (ranging regime)
- H and L must come from the same move. Cross-leg pairing forbidden.
- Position % = (price − leg low) / (leg high − leg low)
- **Buckets:** Discount = 0 to <40 | Equilibrium = 40–60 inclusive | Premium = >60 to 100. Every price has exactly one bucket. No undefined ranges.
- EQ zone (40–60) ON PROBATION: if trades in the 40–45 / 55–60 bands bleed, zone reverts to 33–66. No relitigating.

## 5. Verdict Matrix
Direction input mapping (HYBRID — locked):
- Confirmed Bullish → Uptrend
- Confirmed Bearish → Downtrend
- Unconfirmed (either) → Sideways, EXCEPT the two fade-against-fresh-break cells (below)

| Location | Direction | Verdict |
|---|---|---|
| Equilibrium | any | **NO TRADE** (no exceptions) |
| Discount | Uptrend | **LONG VALID** |
| Premium | Downtrend | **SHORT VALID** |
| Discount | Sideways | **LONG VALID (range)** |
| Premium | Sideways | **SHORT VALID (range)** |
| Discount | Downtrend | **COUNTER-TREND WATCH** |
| Premium | Uptrend | **COUNTER-TREND WATCH** |
| Premium | Unconfirmed Bullish | **COUNTER-TREND WATCH** (fade vs fresh break — never auto-valid) |
| Discount | Unconfirmed Bearish | **COUNTER-TREND WATCH** (fade vs fresh break — never auto-valid) |
| everything else | | **NO ACTION** |

Governing principle: **the engine never auto-greenlights a fade.** All fades = WATCH = manual review + strong HTF zone required.

COUNTER-TREND WATCH is ON PROBATION (n=8, 88% WR as of Jul 5 journal): promote to full verdict at n≥20 if edge holds; demote if it doesn't.

## 6. Timeframes / Dashboard
- Dashboard rows: **1D and 4H**, computed via request.security (lookahead off, confirmed bars only), visible from any chart TF
- HTF system reads the 1D row for bias; LTF system reads the 4H row
- Dashboard format mirrors the paid indicator's table (Time | Status | Trend) for side-by-side validation. **No Strength column in v1** — intentionally not cloned; excluded from validation scope. ATR-slope port from May work is the benched v1.1 candidate if Unconfirmed-as-Sideways misclassifies.

## 7. Alerts
- alertcondition() on any verdict TRANSITION into: LONG VALID, SHORT VALID, LONG/SHORT VALID (range), COUNTER-TREND WATCH
- No alerts for NO TRADE / NO ACTION transitions

## 8. Validation Protocol (mandatory before cutover)
1. Run engine dashboard beside paid indicator dashboard, full 20-pair watchlist, **2–4 weeks**
2. Log EVERY disagreement: pair, date/time, engine said, paid tool said, hindsight verdict
3. **Dual-log at every Unconfirmed occurrence:** verdicts under Hybrid / Pure-A / Pure-B mappings + hindsight. Data picks the final mapping.
4. Strength column disagreements: ignored (out of scope)
5. Cutover criteria: high agreement rate AND every disagreement explainable by a consciously accepted rule difference
6. **Until cutover: paid indicator remains source of record. Live trading process does not change.**

## 9. Out of Scope for v1 (parked, not forgotten)
- Break buffer active (input exists, off)
- Strength/Trending-Ranging metric
- Toolkit pivot unification
- Multi-TF beyond 1D + 4H
- Any S&D zone detection
- Any additional features whatsoever. v1 = this document, nothing else.

## 10. Standing Conditions
- **Journal keeps filling during the build.** Trading does not pause for tooling.
- One cumulative clean script per revision (May protocol). No patchwork snippets.
- CLAUDE.md status section updated every working session or deleted.

## Decision Log (July 5, 2026)
1. Sideways markets → range mean-reversion allowed at extremes (kills dead-code bug)
2. Counter-bias setups → COUNTER-TREND WATCH, on probation to n≥20
3. Leg rule → displacement leg + recent-range fallback
4. EQ zone → 40–60 (probationary; owner acknowledges preference, not data)
5. Trend source → build own engine (option 4); paid tool logic reverse-engineered
6. Regime trigger → close-beyond, wicks excluded; buffer dormant
7. Unconfirmed mapping → Hybrid, dual-log audit
8. Pivots → ZigZag Depth 12 / Deviation 3 / Backstep 1; confirmed pivots only
