# PxD Location Engine — VALIDATION LOG

**Opened: July 7, 2026 · Engine: rev H (strings frozen) · SPEC v1.1
Rule: every entry written at time of observation, not from memory. Hindsight column filled later.**

\---

## A. NIGHT 4 GATE — Blind Fib Comparison (Daily, 5 pairs)

Procedure: engine leg lines OFF → manual fib → record sealed read → reveal → compare.
PASS = all agree, OR every disagreement binned with its one-sentence rule.

|Pair|MY Leg H|MY Leg L|MY Loc%|MY Zone (Disc/EQ/Prem)|ENGINE Leg H|ENGINE Leg L|ENGINE Loc%|ENGINE Zone|Match?|Bin (1 rule-gap / 2 freelance / 3 discretion) + one-sentence|
|-|-|-|-|-|-|-|-|-|-|-|
|AUDUSD|||||||||||
|USDJPY|||||||||||
|AUDNZD|||||||||||
|EURUSD|||||||||||
|(blind pick)|||||||||||

**GATE VERDICT:** ☐ PASSED ☐ FAILED — notes:

\---

## B. MECHANICAL CHECKS (reference card §3)

|#|Check|Result|Notes / screenshots taken|
|-|-|-|-|
|1|Matrix audit — 20 pairs × 2 rows, every verdict traced to grid|☐ PASS ☐ FAIL|untraceable cells:|
|2|Arithmetic — 3 quote conventions vs calculator|☐ PASS ☐ FAIL|pairs used:|
|3|MTF consistency — same rows from both windows|☐ PASS ☐ FAIL|pair used:|
|4|Replay determinism — EURUSD 4H June sequence, bar-by-bar|☐ PASS ☐ FAIL|pivots moved? mid-bar flips? end state = Night 3 cert?|
|5|Edge branches — one \* fallback + one out-of-range Loc% found \& sane|☐ PASS ☐ FAIL|pairs:|

\---

## C. DISAGREEMENT LOG (ongoing — one line per event, spec §8 format)

`DATE | PAIR TF | engine: X | paid: Y | my blind read: Z | hindsight: \_\_ | bin: rule-gap / freelance / discretion / known-diff #`

* 

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

