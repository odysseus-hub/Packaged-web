---
name: orchestrate-analytics-engagement
description: Orchestrate rigorous, reproducible analytical engagements with a small routed team of genuinely specialized experts, independent first passes, checksum-verified data copies, method-specific validation, canonical results, model-selection panels, and reconciled notebooks, code workspaces, charts, dashboards, spreadsheets, reports, PDFs, or presentations. Use for substantial data analysis, machine learning, forecasting, causal inference, experimentation, segmentation, anomaly detection, optimization, or multi-artifact analytics work where conclusions must be independently challenged and production deliverables must remain numerically consistent.
---

# Orchestrate an Analytics Engagement

Act as the Engagement Director. Build the smallest team that fully covers the decision, methods, requested artifacts, and independent review. Differentiate experts through procedures and output contracts, never titles alone.

## Non-negotiable rules

- Frame the decision before choosing methods.
- Profile the available data before fixing the roster.
- Give every activated expert a written question, complete checksum-verified source-data copy, isolated folder, method protocol, and output contract.
- Keep each expert's first pass independent. Do not expose another expert's findings, recommendations, or selected model before that pass is handed off.
- Use the same target definitions, partitions, forecast origins, horizons, and scoring rules for competing model families.
- Require a meaningful naive or interpretable baseline before accepting complex models.
- Assign independent validation to an agent that did not create the reviewed work.
- Block downstream claims when critical data, leakage, identification, or reproducibility defects remain unresolved.
- Publish important values only through the canonical-results layer. Do not manually retype or silently recalculate them in production artifacts.
- Create only activated workstream folders.
- Treat subagent folder isolation as procedural, not a security boundary. Keep sensitive data inside the user-authorized workspace and tools.

## Start with an engagement brief

Record:

- user goal, decision, audience, and operational action;
- source files, formats, grain, keys, approximate size, sample size, target, time index, and known relationships;
- requested artifacts and update cadence;
- constraints: privacy, compute, software, deadline, interpretability, deployment, regulation, and storage;
- acceptance criteria, required comparisons, and prohibited claims;
- unresolved questions and assumptions.

Inspect data and local instructions before asking the user for facts that can be discovered safely. Ask only when a missing choice would materially change the engagement.

## Route the team

Read [expert-catalog.md](references/expert-catalog.md) and [expert-routing-matrix.md](references/expert-routing-matrix.md). Always assign an Engagement Director. Add Data Engineering, Data Quality/Privacy, Business/Decision, and Independent Validation roles when their responsibilities are material; a small engagement may combine compatible core duties, but the creator and validator must remain different agents.

Activate method and production experts only when justified. If two model families can credibly compete, assign separate first-pass owners. Add a domain expert when variable meaning, operational constraints, safety, or plausibility cannot be judged generically.

Write the final roster and justification before analysis. For each expert, copy and complete [expert-role-brief.md](templates/expert-role-brief.md).
Freeze a unique role-contract ID, creator agent ID, protocol ID, metric conventions, unique procedure steps, unique outputs, and approval timestamp. Complete `workstream_plan.md` before dispatch. Do not start an expert with blank contract fields.

### Subagent execution

When Codex collaboration tools are available and the user requested or authorized agent work, pass the appropriate prompt from [subagent-role-prompts.md](references/subagent-role-prompts.md) with the role brief, workstream path, data manifest, and required protocol. Give each agent a bounded workstream. Do not pass other experts' findings during the independent first pass.

If subagents are unavailable or not authorized, execute the workstreams sequentially yourself while preserving separate folders, role briefs, methods, and first-pass boundaries. Never pretend that one pass was independent.

## Scaffold and verify the workspace

Use:

```powershell
python scripts/scaffold_engagement.py ENGAGEMENT_ROOT --source SOURCE_PATH --experts tabular_ml statistical_inference validation --plan-only
python scripts/scaffold_engagement.py ENGAGEMENT_ROOT --source SOURCE_PATH --experts tabular_ml statistical_inference validation
```

Pass `--source` more than once for multiple files or directories. Run `--plan-only` first and review the multiplied byte count before copying very large or sensitive sources. The script refuses a non-empty engagement root. It creates:

```text
00_engagement/
01_source_manifest/
02_workstreams/<activated_expert>/
03_canonical_results/
04_integrated_analysis/
05_deliverables/
06_validation/
```

Each activated workstream contains:

```text
data/  notebooks/  scripts/  outputs/
role_brief.md  workstream_plan.md  methods.md
findings.md  limitations.md  handoff.json
```

Run:

```powershell
python scripts/verify_engagement.py ENGAGEMENT_ROOT --stage copy
python scripts/verify_engagement.py ENGAGEMENT_ROOT --stage preflight
```

Run `copy` immediately after scaffolding. Complete and approve role briefs/plans, then run `preflight` before dispatch. Stop if either gate fails.

## Run independent first passes

Require every expert to:

1. Confirm its question, data-copy checksum, exclusions, and acceptance criteria.
2. Follow its assigned protocol.
3. Produce executable code or a reproducible notebook when computation is involved.
4. Record assumptions, diagnostics, evidence, failures, and limitations.
5. Separate observed facts, estimates, interpretations, and recommendations.
6. Complete [expert-handoff.md](templates/expert-handoff.md) as `handoff.json` and validate it against [expert-handoff.schema.json](references/expert-handoff.schema.json).
7. Submit findings before reading other workstreams.

For every computational workstream, save deterministic code or an executed notebook and `outputs/clean_run.json` containing `status: "pass"`, the exact command, execution timestamp, and artifact path. A narrative description of arithmetic is not reproducibility evidence.

Read only the protocols needed for the activated roster:

- [tabular-ml-protocol.md](references/tabular-ml-protocol.md)
- [deep-learning-protocol.md](references/deep-learning-protocol.md)
- [forecasting-protocol.md](references/forecasting-protocol.md)
- [intermittent-demand-protocol.md](references/intermittent-demand-protocol.md)
- [statistics-and-causal-protocol.md](references/statistics-and-causal-protocol.md)

For segmentation, anomaly detection, optimization, simulation, and engagement-specific domain work, use the catalog's role contract and add a task-specific protocol to the role brief.

## Integrate without erasing disagreement

After first-pass handoffs:

1. Reconcile data versions, target definitions, grains, exclusions, and denominators.
2. Build an evidence table linking each claim to source, code/notebook, output, and reviewer.
3. Investigate material disagreement; do not average incompatible estimates.
4. Label results as validated, provisional, rejected, or blocked.
5. Preserve alternative explanations and negative results.
6. Record decision implications separately from statistical or predictive performance.

Treat handoff schema violations and unrecorded metric-definition differences (including variance conventions) as integration defects. Reconcile them before approving evidence.

## Convene the model-selection panel

Use the Engagement Director and Independent Validator. Include owners of serious candidates, but do not let them approve their own work.

Compare candidates using [model-comparison.md](templates/model-comparison.md) across:

- meaningful baseline and out-of-sample performance;
- leakage risk and partition fairness;
- stability across folds, periods, origins, or subgroups;
- calibration, uncertainty, residuals, and failure modes;
- interpretability, robustness, and data requirements;
- runtime, inference cost, maintainability, and deployment complexity;
- business usefulness and operational constraints.

Do not select a model solely because it has the best single metric. Reject models that fail leakage, holdout, identification, stability, or reproducibility gates. Save the signed decision to `04_integrated_analysis/model_registry.json` and create a reader-facing comparison.

## Establish canonical results

Copy [canonical-results-register.md](templates/canonical-results-register.md) into `03_canonical_results/`. Store:

- approved metric definitions and denominators;
- validated headline numbers and confidence/uncertainty;
- approved model-performance tables and predictions/forecasts;
- figure-ready datasets and chart registry;
- assumptions, caveats, source/notebook references;
- version, checksum, owner, reviewer, and approval status.

Production work must read from this layer. Any correction must update the canonical result first, increment its version, and trigger reconciliation of all dependent artifacts.

## Produce and reconcile deliverables

Load only the standards needed:

- [notebook-and-vscode-standards.md](references/notebook-and-vscode-standards.md)
- [visualization-standards.md](references/visualization-standards.md)
- [document-and-presentation-standards.md](references/document-and-presentation-standards.md)

Use [chart-map.md](templates/chart-map.md) for every figure and [deliverable-reconciliation.md](templates/deliverable-reconciliation.md) before release. Use the dedicated spreadsheet, document, PDF, presentation, visualization, or dashboard skill when the artifact type triggers it; this skill governs analytical architecture and handoffs, not file-format mechanics.

## Independent validation and release gate

The Independent Validator must:

- recompute critical metrics from the verified copy;
- inspect split logic, time boundaries, leakage, joins, denominators, filters, and statistical assumptions;
- test sensitivity, calibration, subgroup behavior, residuals, and plausible alternative explanations as applicable;
- trace every headline claim and visual to canonical data;
- execute notebooks from a clean kernel and run relevant tests;
- render and inspect final artifacts;
- record defects, severity, owner, remediation, and retest status.

Release only when:

- acceptance criteria are met or explicitly waived by the user;
- no critical unresolved data, privacy, leakage, causal-identification, or reproducibility defect remains;
- selected models passed the panel;
- all headline values reconcile to canonical results;
- all requested artifacts open, execute, render, and agree;
- limitations and unresolved risks are visible;
- the validator signs off without being the creator of the reviewed work.

Finally run `python scripts/verify_engagement.py ENGAGEMENT_ROOT --stage release`. Treat its separate copy-integrity, contract, handoff, reproducibility, definition-consistency, and independence gates as release evidence, not as a substitute for expert review.

If a gate fails, continue remediation within scope. If completion needs new authority, data, or an external-state change, report the specific blocker and the minimum user action required.
