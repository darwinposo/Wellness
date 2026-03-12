# T01: Journal Detail + Insights Screen
Slice: M001/S03
Created: 2026-03-12

## Goal
Design the journal entry detail view and the Insights/mood history screen — the latter serving as the long-term retention driver showing users their emotional patterns over time.

## Steps
1. Design JOURNAL-DETAIL: full entry view with AI conversation thread
2. Design INSIGHTS: mood calendar/heatmap + streak stats + mood trend graph area
3. Create the Skia graph placeholder frame (wireframe box with annotation)
4. Design empty state for INSIGHTS (new user, no data yet)

## Must-Haves

### Truths
- [ ] JOURNAL-DETAIL shows the full AI conversation thread (not just user text)
- [ ] JOURNAL-DETAIL has mood badge at top (shows the mood recorded at entry time)
- [ ] INSIGHTS has a monthly mood calendar/heatmap (GitHub-style grid, color = mood)
- [ ] INSIGHTS shows streak count + total entries count prominently
- [ ] Skia graph area is clearly annotated as "[MOOD TREND GRAPH — Skia]" placeholder
- [ ] INSIGHTS empty state is encouraging, not cold ("Mulai perjalananmu hari ini!")

### Artifacts
- [ ] JOURNAL-DETAIL frame (390×844 or scrollable)
- [ ] INSIGHTS frame with calendar grid + stats + graph placeholder
- [ ] INSIGHTS-empty frame

## Notes
- The mood calendar heatmap is the "wow" moment when users have 30+ days of data. Design it to look like a beautiful artifact, not a utility chart.
- Skia graph: in Figma, just draw a smooth wave line with mood color gradient fill as placeholder. Annotate with [NO_CODE_NEEDED_IN_FIGMA].
