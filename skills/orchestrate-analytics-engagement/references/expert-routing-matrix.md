# Expert routing matrix

Choose the smallest sufficient team after inspecting goal, data, target, decision, artifacts, constraints, and acceptance criteria.

| Need | Method owners | Required challenge/review | Add when relevant |
|---|---|---|---|
| Descriptive or KPI analysis | Data Engineering + Business Analyst | Data Quality + Validator | Statistical Expert for uncertainty |
| Tabular classification/regression/ranking | Tabular ML | Statistical Expert + Validator | Domain Expert; Deep Learning only with a structural case |
| Large text, image, embedding, multimodal, or sequence task | Deep Learning | Simpler-baseline owner + Validator | Domain specialist, GPU/deployment reviewer |
| Dense time series | Time-Series | Statistical Expert + Validator | Domain Expert; hierarchical or operations specialist |
| Sparse/intermittent demand | Intermittent Demand + Time-Series | Validator | Supply-chain Domain Expert + inventory/OR |
| Hypothesis, interval, survival, or multilevel question | Statistical Inference | Validator | Domain Expert |
| Experiment or causal question | Causal Inference + Statistical Inference | Validator + Domain Expert | Data Engineering for assignment/event logs |
| Segmentation | Clustering/Segmentation + Business Analyst | Validator | Domain Expert |
| Anomaly detection | Anomaly Expert + Data Quality | Validator | Domain Expert or change-point specialist |
| Optimization/resource allocation | Operations Research + Business Analyst | Validator + Domain Expert | Forecast owner when inputs are predicted |
| Reproducible analytical repository | VS Code + IPYNB | Validator | Method owner |
| Notebook deliverable | IPYNB | Method owner + Validator | VS Code for multi-file projects |
| Chart-heavy report | Visualization + Document | Technical Editor | Method owner |
| Interactive monitoring | Dashboard + Visualization | Technical Editor + Validator | Data Engineering for refresh pipeline |
| Spreadsheet/financial model | Spreadsheet | Independent Formula Reviewer | Business/Finance Domain Expert |
| Executive deck | Presentation + Visualization | Technical Editor | Business Analyst |
| Formal report/PDF | Document + Visualization | Technical Editor | Accessibility or domain reviewer |

## Routing gates

1. Add Data Engineering when multiple sources, nontrivial joins, schema drift, repeatable refreshes, or production features exist.
2. Add Data Quality/Privacy for sensitive data, unclear provenance, material missingness, leakage risk, or high-stakes use.
3. Add a Domain Expert when business meaning or constraints determine validity.
4. Keep the Validator separate from all work it reviews.
5. Assign competing model families to separate first-pass owners when both are credible.
6. Do not activate Deep Learning without a written data/structure justification and simpler baseline.
7. Route zeros and sparse occurrence patterns to Intermittent Demand before conventional forecasting.
8. Route a request for "impact," "effect," or "caused" to Causal Inference; downgrade to association if identification fails.
9. Route production experts only for requested artifacts or necessary maintainability.

## Fair comparison contract

Freeze before model work:

- target, unit of analysis, inclusion/exclusion rules, feature cutoff, and leakage boundary;
- train/validation/holdout partitions or forecast origins/horizons;
- metric formulas, aggregation weights, uncertainty method, and subgroup slices;
- compute budget and tuning allowance;
- baseline definition and selection rule.

Allow a deviation only through a dated decision log, then rerun affected candidates. Do not compare candidates trained on different information sets as if the result were fair.
