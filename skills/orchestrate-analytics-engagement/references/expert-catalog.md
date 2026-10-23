# Expert catalog

Use only roles that materially change the work. A role must own a question, procedure, diagnostics, and deliverables.

## Permanent core

### Engagement Director / Chief Data Scientist

- Frame the decision, estimand or prediction target, audience, constraints, acceptance tests, and stopping rules.
- Route specialists after inspecting data shape and requested artifacts.
- Freeze shared definitions, splits, forecast origins, and evaluation rules.
- Maintain engagement state, resolve disagreements, convene the model panel, and approve canonical results.
- Deliver: engagement brief, roster, decision log, integrated analysis, model registry, and release decision.

### Data Engineering and Architecture Specialist

- Profile formats, schemas, grain, keys, relationships, types, time zones, units, and lineage.
- Build deterministic loaders, joins, transformations, and feature pipelines.
- Test row-count conservation, key cardinality, referential integrity, duplicated joins, mixed grain, and type drift.
- Deliver: source manifest, schema/lineage map, reusable preparation code, prepared-data contract, and reconciliation checks.

### Data Quality, Privacy, and Governance Specialist

- Verify checksums, containment, permissions, duplication, completeness, validity, uniqueness, consistency, freshness, drift, leakage, and sensitive fields.
- Define severity, affected scope, remediation, and blocking status for each defect.
- Block claims that depend on critically defective or unauthorized data.
- Deliver: quality profile, privacy register, issue log, leakage review, and gate decision.

### Business and Decision Analyst

- Translate estimates into addressable scale, operational action, cost, risk, constraints, and expected decision value.
- Test whether outputs answer the actual decision and whether differences are material.
- Separate analytical evidence from business assumptions.
- Deliver: decision map, impact scenarios, recommendation, risks, and next actions.

### Independent Validation / Red-Team Specialist

- Recompute headline metrics and inspect source-to-claim lineage without reusing the creator's conclusions.
- Challenge joins, filters, denominators, splits, leakage, assumptions, calibration, subgroup behavior, causal wording, and alternative explanations.
- Execute code from clean state and trace artifacts to canonical results.
- Deliver: validation plan, independent calculations, defect register, retest evidence, and signed release opinion.
- Never validate work this same agent created.

## Modeling and methodology bench

### Tabular Machine-Learning Expert

- Use linear/regularized models, trees, random forests, extra trees, LightGBM, XGBoost, or CatBoost when justified.
- Start with naive and interpretable baselines; use leakage-safe cross-validation and untouched holdout evaluation.
- Diagnose missingness, categorical encoding, imbalance, weighting, calibration, residuals, subgroup stability, feature interactions, monotonicity, and inference cost.
- Deliver: pipeline, split manifest, baseline table, tuning trace, holdout metrics, calibration/residual diagnostics, explanations, and model card.

### Deep-Learning and TensorFlow Expert

- First test whether data volume, structure, and signal justify neural networks.
- Build reproducible TensorFlow/Keras training with explicit seeds, splits, callbacks, checkpoints, early stopping, and learning-rate controls.
- Compare against a simpler baseline on identical data and metrics.
- Diagnose learning curves, overfit gap, instability, imbalance, leakage, calibration, subgroup behavior, latency, memory, and deployment needs.
- Deliver: architecture rationale, training pipeline/config, checkpoints, learning curves, ablations, holdout evaluation, and deployment profile.

### General Time-Series Forecasting Expert

- Identify frequency, seasonality, trend, structural breaks, missing periods, holidays, promotions, hierarchy, and exogenous availability.
- Compare naive/seasonal-naive, ETS, ARIMA/SARIMA, state-space, lag regression, and boosted forecasting as appropriate.
- Use rolling-origin backtesting with identical cutoffs and horizons; quantify bias and uncertainty.
- Deliver: series diagnostics, backtest design, fold-level results, interval coverage, horizon/segment errors, final forecast, and monitoring plan.

### Intermittent-Demand Forecasting Expert

- Classify demand using average demand interval and squared coefficient of variation.
- Model occurrence and positive size; compare zero, seasonal-naive, Croston, SBA, TSB, ADIDA, IMAPA, and hurdle approaches as justified.
- Avoid misleading percentage errors around zeros; evaluate obsolescence and inventory consequences.
- Deliver: intermittency classification, occurrence/size diagnostics, comparable backtests, service/inventory impact, and forecast distribution.

### Statistical Inference Expert

- Define population, sample, parameter, contrast, uncertainty, assumptions, and multiplicity plan.
- Use effect sizes, confidence intervals, bootstrap, GLM, mixed effects, survival, Bayesian analysis, design, or power methods as justified.
- Check independence, distributional assumptions, sample adequacy, influential observations, missingness, and subgroup reliability.
- Deliver: analysis plan, assumption checks, estimates with uncertainty, sensitivity analyses, and defensible interpretation.

### Causal-Inference and Experimentation Expert

- State treatment, outcome, estimand, population, assignment mechanism, causal graph, assumptions, and identification threats.
- Use randomized experiments, difference-in-differences, matching/weighting, regression discontinuity, synthetic control, or instrumental variables only when their assumptions are supportable.
- Test balance, overlap, pre-trends, manipulation, interference, attrition, contamination, and sensitivity to hidden bias.
- Deliver: identification memo, design/estimand, diagnostics, effect estimates, robustness checks, and allowed causal language.
- Refuse causal claims when only association is identified.

### Segmentation, Clustering, and Anomaly-Detection Expert

- Transform and scale features appropriately; separate anomaly detection from data-quality triage.
- Compare k-means/k-medoids, hierarchical methods, mixtures, DBSCAN/HDBSCAN, isolation forests, one-class, statistical, or change-point methods as appropriate.
- Test cluster stability, separation, sensitivity, business interpretability, and actionability.
- Deliver: feature rationale, candidate comparison, stability diagnostics, segment profiles or anomaly cases, and operational rules.
- Reject invented segments when mathematical or practical separation is weak.

### Optimization, Simulation, and Operations-Research Expert

- Define objective, decision variables, constraints, units, uncertainty, and feasibility.
- Use linear/mixed-integer programming, networks/routing, queueing, Monte Carlo, scenario analysis, or inventory optimization as appropriate.
- Compare the solution against current state and simple heuristics; test sensitivity and infeasibility.
- Deliver: mathematical formulation, data/assumption table, solver model, feasibility checks, baseline comparison, sensitivity/frontier, and implementable policy.

### Domain Expert

- Interpret variable meaning, operational constraints, safety/regulatory context, realistic ranges, and action feasibility.
- Challenge technically valid but implausible assumptions and recommendations.
- Deliver: domain brief, constraint register, plausibility review, and implementation risks.
- Specialize for supply chain, finance, marketing, product, healthcare, education, reliability, risk, geospatial, NLP, computer vision, or the actual domain.

## Technical production bench

### VS Code Workspace and Analytics-Engineering Expert

- Organize portable source, notebooks, configs, tests, models, outputs, and documentation.
- Add dependency specification, tasks, launch/debug settings, linting, formatting, and tests where useful.
- Remove hidden state, absolute-path breakage, and environment ambiguity.
- Deliver: openable workspace, environment lock/spec, tasks, tests, and run instructions.
- Do not modify validated analytical conclusions.

### Jupyter Notebook / IPYNB Expert

- Organize configuration, loading, validation, exploration, modeling, evaluation, visualization, and conclusions top to bottom.
- Make paths, parameters, seeds, versions, and assumptions visible; bound noisy outputs.
- Execute from a clean kernel and confirm narrative claims match outputs.
- Deliver: executed notebook, execution log, environment details, and clean-run evidence.

### Data Visualization and Information-Design Expert

- Select the simplest honest chart for the intended comparison.
- Make units, denominators, date ranges, sample sizes, uncertainty, scales, and encodings explicit.
- Test accessibility, labels, clipping, final-context legibility, and consistency with canonical data.
- Deliver: figure-ready data, chart files, source/claim chart map, and visual QA record.
- Never alter validated values for appearance.

### Dashboard and Interactive-Analytics Expert

- Use interactivity only for recurring monitoring or genuine exploration.
- Design KPI hierarchy, filters, drill-downs, tooltips, empty states, update behavior, and provenance.
- Test responsiveness, filter interactions, totals, access states, and metric consistency.
- Deliver: dashboard, metric dictionary, filter contract, QA cases, and refresh notes.

### Spreadsheet and Financial-Modeling Expert

- Separate inputs, calculations, checks, assumptions, and outputs.
- Avoid unexplained hard-codes; preserve formats, units, dates, currencies, and print layout.
- Add formula, balance, reconciliation, and sensitivity checks; recalculate before delivery.
- Deliver: workbook, assumptions register, formula map, check sheet, and independent formula review.

### Word, PDF, and Document-Formatting Expert

- Transform canonical content into a structured document with consistent typography, tables, figures, captions, navigation, source notes, and appendices.
- Render and inspect every page for overflow, clipping, page breaks, image quality, and accessibility.
- Deliver: editable source, final PDF if requested, render proof, and QA checklist.
- Pull important values from canonical outputs; never retype them manually.

### Presentation and Executive-Storytelling Expert

- Build a decision story: situation, evidence, implication, recommendation, risk, and next action.
- Prefer charts/tables to walls of text and preserve technical appendix evidence.
- Render and inspect the deck; reconcile every number with canonical results.
- Deliver: editable deck, rendered preview, storyline map, and QA checklist.

### Technical Editor and Deliverable-Reconciliation Expert

- Compare notebooks, reports, workbooks, dashboards, decks, model cards, and canonical results.
- Detect stale figures, inconsistent rounding, definition drift, contradictory claims, missing caveats, and broken references.
- Deliver: reconciliation matrix, defect log, corrected artifact versions, and release recommendation.

