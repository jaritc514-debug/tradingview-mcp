# PxD Location Engine — VALIDATION LOG

**Opened: July 7, 2026 · Engine: rev H (strings frozen) · SPEC v1.1
Rule: every entry written at time of observation, not from memory. Hindsight column filled later.**

\---

## A. NIGHT 4 GATE — Blind Fib Comparison (Daily, 5 pairs)

Procedure: engine leg lines OFF → manual fib → record sealed read → reveal → compare.
PASS = all agree, OR every disagreement binned with its one-sentence rule.

|Pair|MY Leg H|MY Leg L|MY Loc%|MY Zone (Disc/EQ/Prem)|ENGINE Leg H|ENGINE Leg L|ENGINE Loc%|ENGINE Zone|Match?|Bin (1 rule-gap / 2 freelance / 3 discretion) + one-sentence|
|-|-|-|-|-|-|-|-|-|-|-|
|AUDUSD|0.72777|0.68334|25.9|Disc|0.72777|0.68334|25.9|Disc|Yes||
|USDJPY|162.840|155.032|90.9|Prem|162.840 (developing leg H)|155.032|90.9|Prem|Yes||
|AUDNZD|1.22869|1.19859|69|Prem|1.22346|1.19859|84.5|Prem|leg NO, zone yes (luck)|1 — rule-gap, engine side /"Leg origin must be the true high of the move that broke — engine anchored to|
|EURUSD|1.17967|1.13246|25|Disc|1.17967|1.13246|25|Disc|Yes|"leg low = unconfirmed running extreme — correct per breathing-endpoint rule, both sides agree."|
|GBPJPY|217.219|212.400|92|Prem|217.219|212.400|92|Prem|Yes|same as EURUSD but bearish situation|

**| GBPCHF | 1.07986 | 1.02902 | 100% | Premium | 1.17230 | 1.01733 | 40.5% | EQ (NO TRADE) | NO | stale-leg mini-gate |	rev K: FIXED, matches**

**| CADJPY | 117.520 | 113.333 | 25% | Discount | 118.864 | 101.260 | 74.2% | Short valid | no | stale-leg mini-gate |	rev K: FIXED, matches**

**| AUDCHF | 0.56869 | 0.54630 | 67% | Premium  | 0.57628 | 0.49992 | 80.4% | Short valid | no | stale-leg mini-gate |	rev K: open — engine EQ/small leg vs my Prem/major leg — VALIDATION WATCH #1, fails safe**



**GATE VERDICT:** x☐ PASSED ☐ FAILED — notes:4/5 match, 1/5 Bin-1 (AUDNZD stale origin — fixed rev I, re-check clean, engine now 1.22869/\~69% matching manual). Seals per amended markup-as-seal protocol; GBPJPY pristine.

\---

## B. MECHANICAL CHECKS (reference card §3)

|#|Check|Result|Notes / screenshots taken|
|-|-|-|-|
|1 re-run post-rev-K|Matrix audit — 20 pairs × 2 rows, every verdict traced to grid|X PASS ☐ FAIL|untraceable cells:|
|2 re-run post-rev-K|Arithmetic — 3 quote conventions vs calculator|X PASS ☐ FAIL|pairs used: EU,AUDJPY,AUDNZD|
|3|MTF consistency — same rows from both windows|X PASS ☐ FAIL|pair used: EURCHF|
|4|Replay determinism — EURUSD 4H June sequence, bar-by-bar|X PASS ☐ FAIL|pivots moved? mid-bar flips? end state = Night 3 cert?|
|5|Edge branches — one \* fallback + one out-of-range Loc% found \& sane|☐ PASS ☐ FAIL|pairs: None present on watchlist tonight|

\---

## C. DISAGREEMENT LOG (ongoing — one line per event, spec §8 format)

`DATE | PAIR TF | engine: X | paid: Y | my blind read: Z | hindsight: \\\\\\\\\\\\\\\_\\\\\\\\\\\\\\\_ | bin: rule-gap / freelance / discretion / known-diff #`



* Jul 7 | RULE WATCH | flip-triggered re-anchor could churn in chop — watch ranging pairs during validation
* \- Jul 7 | RULE | rev J: leg re-anchors only on close past own stamped endpoints (EURUSD replay finding) | rev K: also re-anchors on true trend flip (stale-leg finding) | both verified vs my markups
* \- Jul 7 | WATCH | AUDCHF: flip re-anchor gave smaller leg than my major-leg read — collect sister cases during validation before any rev L
* \- Jul 7 | WATCH | GBPAUD: sister case #2 — fresh unconfirmed flip, engine took flip-leg (77.7% Prem), my hands hold prior dominant leg (\~82% Prem) — same zone/verdict, fails safe

\---

## D. KNOWN DIFFS (pre-approved — log occurrences, do not panic)

1. Strength column absent (out of scope)
2. Equal-pivot convention (labels >= vs engine strict)
3. Shallow-window pivots in strong trends (USDJPY class) — watch for earlier Confirmed
4. Right-edge pivot lag (engine strictness)
5. MTF Loc% breathes intraday, settles at HTF close

## E. DUAL-MAPPING AUDIT (at every Unconfirmed occurrence)

`DATE | PAIR TF | Hybrid says: | Pure-A would say: | Pure-B would say: | hindsight right answer:`

* 

