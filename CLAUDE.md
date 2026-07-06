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

## System Rules

Rule 1 — Trend Direction:
"Trend direction and status are read EXCLUSIVELY from the Trend Direction Pro indicator table (bottom-left corner of chart). Use data_get_pine_tables(study_filter='Trend Direction Pro') to read it. Read the 1D row for Daily bias and the 1W row for Weekly context. Do NOT perform independent pivot analysis for trend direction. Do NOT use HH/HL/LH/LL labels for trend — use them only for swing level identification.

Verdict logic: VALID = clear Daily trend + correct price location. CAUTION = equilibrium or path obstacle. SKIP = table unreadable or no trend at all. Confirmed/Unconfirmed, Ranging/Trending, and Weekly alignment are DATA TAGS only — they never change the verdict and never prevent a trade. Log them in output for the trader's data collection."

Rule 2 — Tool Hierarchy:
HTF system (4H execution):
  Daily → Trend Direction Pro (trend direction, status, strength)
  Daily → PxD Toolkit (swing labels for location fib, BOS/MSS labels, LQ markers, FVG boxes)
  4H → entry frame (BOS/MSS labels, displacement leg, OTE calculation, FVG boxes)

LTF system (15m execution):
  4H → Trend Direction Pro (trend direction, status, strength — replaces Daily as bias)
  4H → PxD Toolkit (swing labels, BOS/MSS, LQ markers, FVG boxes)
  Daily → Trend Direction Pro (logged as background context only — does not override 4H bias)

Rule 3 — Path Obstacle Detection:
"Obstacles in the path to TP are identified using Supply & Demand Pro zones only. Read data_get_pine_boxes(study_filter='Supply & Demand Pro', verbose=true). Fresh (untouched) zones = dark blue = bgColor 2133728284 or 2116951068. Touched/mitigated zones = grey = bgColor 439234094 or null — ignore these entirely. For buys: flag fresh Supply zones between current price and swing high (TP). For sells: flag fresh Demand zones between current price and swing low (TP). LQ labels are never obstacles — they signal liquidity already swept."

Rule 4 — Location Assessment:
"Read HH/HL/LH/LL swing labels using data_get_pine_labels(study_filter='PxD Toolkit', verbose=true). Verbose mode returns all labels with bar_index. Sort by bar_index DESCENDING so the most recent labels are first.

Swing low = most recent HL or LL label (highest bar_index among HL/LL labels)
Swing high = most recent HH or LH label with bar_index HIGHER than the swing low's bar_index
  → If none exists: swing high UNCONFIRMED

Always state the swing low price and its label type (e.g. 'HL @ 0.77954, bar 911')

If swing high confirmed: Location % = (price − swing low) / (swing high − swing low) × 100
If swing high unconfirmed:
  Within 1 ATR above swing low → Discount (provisional)
  1–3 ATR above → Premium (provisional)
  More than 3 ATR above → Extreme Premium (provisional)

Below 50% = Discount | ~50% = Equilibrium | Above 50% = Premium | Above 80% = Extreme Premium"

Rule 4b — Obstacle Definition:
"An obstacle is a fresh Supply & Demand Pro zone (bgColor 2133728284 or 2116951068) sitting between current price and the NEAREST realistic TP only. The nearest TP = closest swing high (buys) or swing low (sells) within the current move. Do not flag zones beyond that TP — they are irrelevant. Do not flag LQ labels as obstacles."

Rule 5 — FVG Detection:
"Read data_get_pine_boxes(study_filter='PxD Toolkit', verbose=true). Filter boxes with bgColor 623783470 — confirmed FVG box color. Check if any FVG is within 1 ATR of the KILLSHOT entry level."

Rule 6 — Liquidity Grab Detection:
"Read LQ labels from data_get_pine_labels(study_filter='PxD Toolkit'). LQ label with arrow = liquidity has already been swept from a previous high or low — this is a PAST EVENT and a positive confluence signal, not an obstacle. Never flag an LQ label as a barrier or obstacle in the path. For confluence: check if an LQ sweep appears immediately BEFORE the most recent BOS or MSS being analyzed. Do not flag old LQ labels from unrelated prior structure. LQ sweep is an odds enhancer — it is not mandatory to take a trade."

## HTF Pre-Trade Checklist (4H Execution)

1. Read Trend Direction Pro 1D row → Daily Trend (Bullish/Bearish), Status (Confirmed/Unconfirmed), Strength (Trending/Ranging)
2. Read Trend Direction Pro 1W row → Weekly Trend, Status, Strength (context only — never disqualifies)
3. Fib the dominant Daily swing leg using PxD Toolkit labels → confirm price is in Discount (buys) or Premium (sells)
4. Switch to 4H → find most recent BOS or MSS in direction of Daily bias
5. Check for LQ sweep immediately before that BOS/MSS (odds enhancer)
6. Identify the displacement leg → calculate OTE entry at 70.5% retracement
7. Confirm FVG present at OTE entry level (PxD Toolkit box bgColor 1531263542)
8. Grade: A (all confluences) / B (3 of 4) / C (2 of 4) / No setup
9. Set limit at OTE entry, SL at 100% fib ± (ATR × 0.10), TP1 at 0% fib
10. Set proximity alert 1 ATR away from entry

## LTF Pre-Trade Checklist (15m Execution)

1. Read Trend Direction Pro 4H row (or 1D row on 4H chart) → 4H Trend, Status, Strength → this is your bias
2. Read Trend Direction Pro 1D and 1W rows → log as background context
3. Fib the dominant 4H swing leg → confirm price location
4. On 4H → find BOS or MSS in direction of 4H bias
5. Check for LQ sweep before BOS/MSS
6. Identify displacement leg → calculate OTE at 70.5%
7. Confirm FVG at entry
8. Grade and set parameters same as HTF checklist
