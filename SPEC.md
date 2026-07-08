# PxD Location Engine — Specification v1.1
**Date locked:** July 5, 2026 (v1.0 evening session; v1.1 amendments same night)
**Status:** Spec complete + amended. Code phase next. Validation phase after.
**Replaces:** prefilter.txt + batch-prefilter.txt (both DEPRECATED on ship)

---

## Purpose
Self-contained Pine Script v6 indicator that outputs Location, Direction/Status, and a trade Verdict per the OTE x PxD swing framework, with native TradingView alerts across the 20-pair FX watchlist. Replaces the LLM/MCP prefilter workflow. Removes dependency on the paid trend indicator after validation.

---

## 1. Pivot Engine (foundation — TWO-RESOLUTION ARCHITECTURE, Amendment 1)
**Layer 1 — Regime/Trend/Location (v1, sole authority for ALL v1 outputs):**
- Algorithm: MetaTrader-style ZigZag
- Settings: **Depth 12, Deviation 3, Backstep 1** (exposed as inputs, these defaults)
- Parameter definitions (per paid tool): Depth = minimum bars required to form a new pivot; Deviation = minimum price deviation in TICKS required to form a new pivot; Backstep = bars to look back to confirm a pivot high/low
- Deviation note: 3 ticks is near-inert on 5-digit FX quotes (~0.3 pips) — structure effectively governed by Depth 12 + Backstep 1. Cloned as-is for validation fidelity.
- Applies to BOTH dashboard rows (1D and 4H): trend AND location (confirmed July 5 — 4H premium/discount measured on coarse Depth-12 structure, same lens as trend)

**Layer 2 — Execution legs (v2 ONLY, zero vote in verdicts):**
- Toolkit-style swing pivots, **period 6** — the legs actually fibbed for 4H entries
- Powers the future OTE overlay (golden zone 70.5/78.6/88.6, SL/TP levels)
- Coarse and fine streams WILL identify different legs on the same chart — by design. Coarse decides regime; fine decides execution.
- **IRON LAW:** State machine consumes CONFIRMED pivots only. The developing/repainting extreme is never a pivot: it does not count toward status, does not anchor legs, does not set break levels.
- Known cost: verdict flips lag the visual zigzag by design. Accepted — no repaint > early signal.
- PxD Toolkit H1–H3/L1–L3 table = cosmetic in v1. Engine ZigZag is the only structural authority for verdicts. Unification = v2.

## 2. Structure Labeling
- Every confirmed pivot labeled: HH / HL / LH / LL
- High-stream and low-stream tracked **independently** (a HL between two LHs does not reset the LH count, and vice versa)
- **Equal pivots: STRICT rule.** HH requires strictly higher, LH strictly lower (mirror for lows). An exactly-equal pivot counts as NEITHER — it does not extend, break, or reset either count. Chosen for clone fidelity with the paid tool.
- **Validation watchlist item:** near-equal pivots (within a few ticks) get strict classification and may count liquidity raids as continuation. Any regime flip/confirmation hinging on a near-equal pivot gets logged during validation. Tolerance band = possible v1.1 knob, ONLY if logged cases show wrong verdicts.
- **Cold start:** state machine initializes as Sideways; full-history replay converges state long before the current bar. Non-issue in practice, defined for completeness.

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
- Architecture: **single dynamic alert() call per pair** (NOT one alertcondition per verdict type). Fires on any verdict transition into: LONG VALID, SHORT VALID, LONG/SHORT VALID (range), COUNTER-TREND WATCH. Message carries specifics, e.g. "EURUSD 4H: NO ACTION → COUNTER-TREND WATCH (Discount + Unconfirmed Bearish)"
- Budget: 20 pairs = 20 alert slots. Plan-proof by design (fits Plus/Premium easily). ACTION ITEM: confirm TV plan tier before rollout; if Essential, existing Friday-workflow price alerts compete for the same ~20 slots.
- Delivery: push notification + email, both enabled on each alert
- Pre-rollout test: fire one dummy alert end-to-end to phone at work — verify push survives battery/notification settings before trusting the system
- No alerts for NO TRADE / NO ACTION transitions
- Expected volume: a handful/day across 20 pairs. Sustained firehose during validation = regime machine flipping too fast = investigate the engine, not the notifications

## 8. Validation Protocol (mandatory before cutover)
1. Run engine dashboard beside paid indicator dashboard, full 20-pair watchlist, **2–4 weeks**
2. Log EVERY disagreement: pair, date/time, engine said, paid tool said, hindsight verdict
2b. **Three-way BLIND comparison:** during Friday analysis, write own manual call FIRST (trend state, location bucket, leg choice, verdict) BEFORE looking at engine dashboard. Sealed prediction, then reveal, then compare. Every engine-vs-me disagreement sorted into three bins: (1) engine missed an articulable rule → extract, spec, code it; (2) I broke my own rules → engine caught freelancing, no code change; (3) genuine discretion (news, monthly levels, correlations) → stays human forever. One-sentence test decides bin 1 vs bin 2: if the manual read can't be defended as a rule that applies to any chart, the engine wins.
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
- **v2 (defined, parked, builds ONLY after v1 validation cutover):** entry overlay on Layer-2 period-6 legs — auto-drawn golden zone (70.5/78.6/88.6), SL above leg pivot, TP at leg origin, optional OTE-entry alert. FIRST step of v2 scoping: inventory PxD_EntryLevels.pine (already in repo) — no twins built.
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

## Amendment Log (July 5, late session)
9. Parameter definitions recorded (Depth/Deviation-in-ticks/Backstep); deviation near-inert on FX, cloned as-is
10. Equal pivots → STRICT (neither stream); near-equal raids on validation watchlist
11. Cold start → init Sideways, history converges
12. Alerts → single dynamic alert() per pair, push + email, plan-tier check pending, dummy-alert end-to-end test required
13. Amendment 1: two-resolution architecture — Layer 1 ZigZag 12/3/1 for ALL v1 verdicts (1D + 4H rows, trend AND location); Layer 2 period-6 swing pivots for v2 entry legs only
14. 4H location → coarse Depth-12 structure (confirmed by owner)
15. Validation → three-way blind protocol (engine vs paid tool vs owner's sealed manual reads)

## Amendment Log 2 (July 7)
16. Amendment 2 (rev J): location leg re-anchors ONLY on close beyond its own stamped endpoints — interior breaks flip regime but never redraw the leg. Verified: EURUSD replay + all gate rows.
17. Amendment 3 (rev K): leg ALSO re-anchors on a true regime flip (MSS-class). Verified: GBPCHF + CADJPY mini-gate. Synthesis: leg dies by endpoint break (BOS-class) or trend flip (MSS-class), nothing else.
18. Open watch items: AUDCHF + GBPAUD — on fresh unconfirmed flips, owner's hands hold the prior dominant leg until the new direction builds multi-BOS structure; engine takes the flip-leg immediately. Both cases fail safe (same/adjacent zone, no verdict divergence). Collect sister cases during validation before any rev L.
