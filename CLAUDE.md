# TradingView MCP — Claude Instructions

68 tools for reading and controlling a live TradingView Desktop chart via CDP (port 9222).

## Decision Tree — Which Tool When

### "What's on my chart right now?"
1. `chart_get_state` → symbol, timeframe, chart type, list of all indicators with entity IDs
2. `data_get_study_values` → current numeric values from all visible indicators (RSI, MACD, BBands, EMAs, etc.)
3. `quote_get` → real-time price, OHLC, volume for current symbol

### "What levels/lines/labels are showing?"
Custom Pine indicators draw with `line.new()`, `label.new()`, `table.new()`, `box.new()`. These are invisible to normal data tools. Use:

1. `data_get_pine_lines` → horizontal price levels drawn by indicators (deduplicated, sorted high→low)
2. `data_get_pine_labels` → text annotations with prices (e.g., "PDH 24550", "Bias Long ✓")
3. `data_get_pine_tables` → table data formatted as rows (e.g., session stats, analytics dashboards)
4. `data_get_pine_boxes` → price zones / ranges as {high, low} pairs

Use `study_filter` parameter to target a specific indicator by name substring (e.g., `study_filter: "Profiler"`).

### "Give me price data"
- `data_get_ohlcv` with `summary: true` → compact stats (high, low, range, change%, avg volume, last 5 bars)
- `data_get_ohlcv` without summary → all bars (use `count` to limit, default 100)
- `quote_get` → single latest price snapshot

### "Analyze my chart" (full report workflow)
1. `quote_get` → current price
2. `data_get_study_values` → all indicator readings
3. `data_get_pine_lines` → key price levels from custom indicators
4. `data_get_pine_labels` → labeled levels with context (e.g., "Settlement", "ASN O/U")
5. `data_get_pine_tables` → session stats, analytics tables
6. `data_get_ohlcv` with `summary: true` → price action summary
7. `capture_screenshot` → visual confirmation

### "Change the chart"
- `chart_set_symbol` → switch ticker (e.g., "AAPL", "ES1!", "NYMEX:CL1!")
- `chart_set_timeframe` → switch resolution (e.g., "1", "5", "15", "60", "D", "W")
- `chart_set_type` → switch chart style (Candles, HeikinAshi, Line, Area, Renko, etc.)
- `chart_manage_indicator` → add or remove studies (use full name: "Relative Strength Index", not "RSI")
- `chart_scroll_to_date` → jump to a date (ISO format: "2025-01-15")
- `chart_set_visible_range` → zoom to exact date range (unix timestamps)

### "Work on Pine Script"
1. `pine_set_source` → inject code into editor
2. `pine_smart_compile` → compile with auto-detection + error check
3. `pine_get_errors` → read compilation errors
4. `pine_get_console` → read log.info() output
5. `pine_get_source` → read current code back (WARNING: can be very large for complex scripts)
6. `pine_save` → save to TradingView cloud
7. `pine_new` → create blank indicator/strategy/library
8. `pine_open` → load a saved script by name

### "Practice trading with replay"
1. `replay_start` with `date: "2025-03-01"` → enter replay mode
2. `replay_step` → advance one bar
3. `replay_autoplay` → auto-advance (set speed with `speed` param in ms)
4. `replay_trade` with `action: "buy"/"sell"/"close"` → execute trades
5. `replay_status` → check position, P&L, current date
6. `replay_stop` → return to realtime

### "Screen multiple symbols"
- `batch_run` with `symbols: ["ES1!", "NQ1!", "YM1!"]` and `action: "screenshot"` or `"get_ohlcv"`

### "Draw on the chart"
- `draw_shape` → horizontal_line, trend_line, rectangle, text (pass point + optional point2)
- `draw_list` → see what's drawn
- `draw_remove_one` → remove by ID
- `draw_clear` → remove all

### "Manage alerts"
- `alert_create` → set price alert (condition: "crossing", "greater_than", "less_than")
- `alert_list` → view active alerts
- `alert_delete` → remove alerts

### "Navigate the UI"
- `ui_open_panel` → open/close pine-editor, strategy-tester, watchlist, alerts, trading
- `ui_click` → click buttons by aria-label, text, or data-name
- `layout_switch` → load a saved layout by name
- `ui_fullscreen` → toggle fullscreen
- `capture_screenshot` → take a screenshot (regions: "full", "chart", "strategy_tester")

### "TradingView isn't running"
- `tv_launch` → auto-detect and launch TradingView with CDP on Mac/Win/Linux
- `tv_health_check` → verify connection is working

## Context Management Rules

These tools can return large payloads. Follow these rules to avoid context bloat:

1. **Always use `summary: true` on `data_get_ohlcv`** unless you specifically need individual bars
2. **Always use `study_filter`** on pine tools when you know which indicator you want — don't scan all studies unnecessarily
3. **Never use `verbose: true`** on pine tools unless the user specifically asks for raw drawing data with IDs/colors
4. **Avoid calling `pine_get_source`** on complex scripts — it can return 200KB+. Only read if you need to edit the code.
5. **Avoid calling `data_get_indicator`** on protected/encrypted indicators — their inputs are encoded blobs. Use `data_get_study_values` instead for current values.
6. **Use `capture_screenshot`** for visual context instead of pulling large datasets — a screenshot is ~300KB but gives you the full visual picture
7. **Call `chart_get_state` once** at the start to get entity IDs, then reference them — don't re-call repeatedly
8. **Cap your OHLCV requests** — `count: 20` for quick analysis, `count: 100` for deeper work, `count: 500` only when specifically needed

### Output Size Estimates (compact mode)
| Tool | Typical Output |
|------|---------------|
| `quote_get` | ~200 bytes |
| `data_get_study_values` | ~500 bytes (all indicators) |
| `data_get_pine_lines` | ~1-3 KB per study (deduplicated levels) |
| `data_get_pine_labels` | ~2-5 KB per study (capped at 50) |
| `data_get_pine_tables` | ~1-4 KB per study (formatted rows) |
| `data_get_pine_boxes` | ~1-2 KB per study (deduplicated zones) |
| `data_get_ohlcv` (summary) | ~500 bytes |
| `data_get_ohlcv` (100 bars) | ~8 KB |
| `capture_screenshot` | ~300 bytes (returns file path, not image data) |

## Tool Conventions

- All tools return `{ success: true/false, ... }`
- Entity IDs (from `chart_get_state`) are session-specific — don't cache across sessions
- Pine indicators must be **visible** on chart for pine graphics tools to read their data
- `chart_manage_indicator` requires **full indicator names**: "Relative Strength Index" not "RSI", "Moving Average Exponential" not "EMA", "Bollinger Bands" not "BB"
- Screenshots save to `screenshots/` directory with timestamps
- OHLCV capped at 500 bars, trades at 20 per request
- Pine labels capped at 50 per study by default (pass `max_labels` to override)

## Architecture

```
Claude Code ←→ MCP Server (stdio) ←→ CDP (localhost:9222) ←→ TradingView Desktop (Electron)
```

Pine graphics path: `study._graphics._primitivesCollection.dwglines.get('lines').get(false)._primitivesDataById`

## Status — July 6 (Night 1: inventory complete)
- EntryLevels.pine: rendering layer GOOD (reuse for v2); leg-selection brain is naive recency (no MSS/BOS gate) — fibs internal legs, replace entirely per SPEC v2
- Toolkit v3: MSS/BOS module already close-based (spec-compliant); HTF Context = v0 of Location Engine BUT uses lookahead_on (REPAINTS) — DO-NOT-CONSUME by any tool/module; DELETE from toolkit on v1 cutover. Owner never uses its shading (location is manual fib, 2-window Daily/4H setup) — no live contamination
- Toolkit equal-pivot inconsistency: labels use >=, trend uses strict > — validation log note
- Live chart swing period = 6, code default = 5 — align in v2
- Next: Night 2 = ZigZag 12/3/1 port, verify pivot-for-pivot vs paid tool on EURUSD D+4H
- Night 2 PASSED 50/50 EURUSD D+4H (ZigZag Layer 1 committed)
- Night 3 PASSED 8/8 (EURUSD, AUDUSD, USDJPY, AUDNZD × D+4H — rev D committed)
- Known diffs for validation log: (1) equal-pivot convention (labels >= vs strict >), (2) engine registers shallow-window pivots the paid tool skips in strong trends (USDJPY 4H, 2/25 extra) — possible earlier Confirmed status, watch during validation
- Next: Night 4 = location module + verdict matrix + MTF dashboard (1D+4H rows). Night 4 GATE requires fresh eyes — manual fib comparison on 5 pairs, NOT to be run end-of-shift
- Night 4 code COMPILED (rev G committed) — location + hybrid verdict + MTF dashboard + chart-TF-first rows. GATE NOT RUN. Gate = fresh eyes: manual fib vs engine leg lines on 5 pairs Daily, verdict cells traced to SPEC matrix. First live verdicts sane: EURUSD D 21.6% CT WATCH ✔, 4H 58.5% NO TRADE ✔
- TWIN ALERT (from home PC merge): pxd_toolkit_modified.pine (40.8KB) vs pxd_toolkit_v3.pine (53KB) — diff and resolve before any v2 work; one toolkit file survives
- Night 4 GATE PASSED (4/5 match, 1/5 Bin-1: AUDNZD stale leg origin — fixed in rev I, re-check verified vs manual fib). LOCATION MODULE CERTIFIED. Remaining: section B mechanical checks, then Night 5 = alerts + MCP diff harness, then validation clock starts.
- Aug 12: REVAMP — OTE/Killshot retired from this system (traded manually now). Rebuilt for HTF Supply & Demand zone scanning only: Weekly+Daily zones from Supply & Demand Pro, Trend Direction Pro and Campus Valuation Tool as confluence tags (never filters), leg-out quality computed from raw candles, risk tiers mapped to the ote-journal Playbook. Location Engine (SPEC.md, pivot/regime/verdict-matrix) and the OTE workflow scripts retired — full history preserved in git if ever needed. rules.json, CLAUDE.md, scan.txt, batch-scan.txt rewritten (renamed from prefilter.txt/batch-prefilter.txt shortly after — "prefilter" was a leftover name from when there was a separate deep-analysis step after it). Not yet live-tested against the real indicator (Campus Valuation Tool output format still unverified).

## System Rules

These implement rules.json — see that file for the full rulebook. OTE/Killshot is now traded manually,
outside this system; these rules are HTF Supply & Demand only.

Rule 1 — Trend Direction (tag only, never a filter):
"Trend direction and status are read from the Trend Direction Pro indicator table. Use data_get_pine_tables(study_filter='Trend Direction Pro'). Read the 1D row for Daily and the 1W row for Weekly.

This is a confluence TAG, never a hard filter. A demand zone with a Bearish Daily trend is still reported — flagged as trend-conflicting, not discarded. Never exclude a zone based on trend, status, or strength."

Rule 2 — Tool Hierarchy:
Weekly → Supply & Demand Pro (zone context, HTF Coverage source) + Trend Direction Pro (Weekly bias tag)
Daily → Supply & Demand Pro (primary zone scan target) + Trend Direction Pro (Daily bias tag)
Both → Campus Valuation Tool (confluence tag, unverified — see rules.json)

There is no separate LTF/4H execution system anymore. Weekly and Daily zones are the whole scan.

Rule 3 — Zone Detection & Tags:
"Read data_get_pine_boxes(study_filter='Supply & Demand Pro', verbose=true) on both Weekly and Daily. Read tags directly from the indicator — do not recompute what it already tells you: formation (RBD/RBR/DBR/DBD), F (flip zone), O (original zone), LoL (level on level).

Freshness from bgColor: Fresh = 2569935900 or 2586713116. 1st Touch = 858659868. Inactive = null, ignore entirely.

Base length is already filtered by the indicator (max 6 candles) — do not re-validate it."

Rule 4 — HTF Coverage:
"For each Daily zone, check whether it sits inside or overlaps a Weekly zone of the same type (both supply or both demand). HTF Coverage = Yes/No. Not mandatory — zones without it are still valid and reported. This is a confluence tier, not a filter."

Rule 5 — Leg-Out Quality (Daily zones only):
"Weekly zones never get a risk tier or Entry/SL/TP, so don't compute this for them at all — skip the OHLCV fetch entirely, not just the output. Not tagged by the indicator — compute it for Daily zones. Pull candles via data_get_ohlcv around the zone's formation and classify the candle that broke the base: ≤49% body = indecisive, 50-75% = decisive, >75% (and abnormally large vs. surrounding candles) = explosive. Leg-out quality = Explosive or Decisive. An indecisive breaking candle is unusual — the indicator likely wouldn't have drawn the zone in the first place."

Rule 6 — Valuation Confluence (tag only, three separate indicators — pick by asset type):
"There is no single valuation indicator — there are three, and you must pick the right one per symbol, not try all three. Currency futures, FX majors, commodities, and metals → study_filter='CampusValuationTool' (exact, one word, no spaces — a prior attempt used 'Campus Valuation Tool' with spaces and got nothing back, likely just a name mismatch, not a real read failure). Index futures (NQ/YM/ES/RTY) → study_filter='Supreme Valuation'. FX cross pairs (non-USD, e.g. EURGBP, GBPJPY) → study_filter='MTF Cross Pairs Valuation'. Read via data_get_pine_tables, or data_get_study_values as fallback. If the corrected name still fails, the indicator's bottom pane may need to be actively visible before TradingView renders its data for CDP reads.

Read on the DAILY timeframe only — never Weekly. One read per symbol, reused for both that symbol's Weekly and Daily zone reports.

Classify the raw numeric value into 5 states (rules.json valuation_confluence.classification, confirmed by the user): value >= 75 Extreme Overvalued, 0.5 to 74.99 Overvalued, -0.5 to 0.5 Neutral, -74.99 to -0.5 Undervalued, value <= -75 Extreme Undervalued. Sign = directional lean (negative supports longs, positive supports shorts, per the trader's own rule), magnitude = strength — extreme readings are the strongest confluence. Tag only, same as trend — never exclude a zone based on this, even once readable."

## HTF Supply & Demand Scan Checklist

1. Weekly pass: read Supply & Demand Pro zones, tags, and freshness
2. Daily pass: same, on Daily
3. HTF Coverage: does a Daily zone sit inside a Weekly zone of the same type?
4. Leg-out quality: classify the breaking candle from raw OHLCV — Daily zones only, skip entirely for Weekly (Rule 5)
5. Trend tag: Trend Direction Pro Daily + Weekly rows (Rule 1 — never disqualifies)
6. Valuation tag: pick CampusValuationTool / Supreme Valuation / MTF Cross Pairs Valuation by asset type (Rule 6 — never disqualifies)
7. Profit check: nearest opposing Fresh/1st Touch zone in the direction out of this zone — Clear or Boxed in
8. Risk tier: map to 2% / 1.5% / 1% / 0.5% per rules.json risk_tiers, checked top-down — 2% ("All Stars Aligned") requires HTF Coverage + strong_leg_out (Explosive or 2 consecutive Decisive) + Weekly trend aligned + Extreme valuation matching direction, all four at once
9. Report the zone regardless of trend/valuation alignment — those are tags for the trader's judgment, not gates
10. Alerts are manual for now — automated proximity alerts are a later phase, not built yet
