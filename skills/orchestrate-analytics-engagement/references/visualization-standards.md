# Visualization standards

## Start from the comparison

Write the question, reader, intended comparison, source dataset, canonical result IDs, and claim before choosing a chart.

Choose:

- line for ordered trends;
- bar/dot for categorical comparison or ranking;
- histogram/ECDF/box/violin for distribution with sample context;
- scatter for relationships at observation grain;
- interval/error bars or bands for uncertainty;
- small multiples for repeated comparable structure;
- funnel/cohort/heatmap only when their structure matches the data.

Avoid decorative 3D, unjustified dual axes, pie overload, truncated magnitude bars, area encodings for precise comparison, and color-only distinctions.

## Required annotations

Show units, denominator, date range, population, sample size where material, aggregation, uncertainty meaning, and exclusions. Use truthful scales and label any nonzero baseline or transformation prominently.

## Accessibility and final-context QA

- Use accessible palettes plus shape, label, line style, or position where needed.
- Check contrast, font size, overlap, clipping, legends, tooltips, screen-reader text where supported, and grayscale interpretation.
- Inspect the chart inside its final notebook, dashboard, document, spreadsheet, or slide.
- Verify every plotted value against figure-ready canonical data.
- Keep chart code and source data reproducible.

## Chart map

Record chart ID, analytical question, claim, canonical source/version/checksum, filters, encodings, artifact destination, owner, reviewer, and validation status. Never modify data to improve appearance.

