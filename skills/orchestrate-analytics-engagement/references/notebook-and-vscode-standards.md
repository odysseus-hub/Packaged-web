# Notebook and VS Code standards

## Repository layout

Separate configuration, source, notebooks, tests, data contracts, models, outputs, and deliverables. Use relative paths rooted through one configuration mechanism. Never depend on an analyst's working directory or undocumented global package state.

## Environment

- Pin or bound direct dependencies and record Python/runtime version.
- Provide one deterministic environment setup and one canonical run command.
- Keep secrets out of notebooks, source control, outputs, and logs.
- Record seeds and known nondeterminism.
- Add formatting, linting, tests, tasks, and debug configuration when they reduce handoff ambiguity.

## Notebook narrative

Order sections:

1. purpose, decision, inputs, and acceptance criteria;
2. configuration, versions, paths, parameters, and seeds;
3. loading and checksum/schema verification;
4. cleaning and data-quality decisions;
5. exploration tied to analytical questions;
6. modeling/estimation and diagnostics;
7. evaluation against frozen rules;
8. canonical result export;
9. limitations, conclusions, and next actions.

Put reusable transformations and model code in modules when complexity warrants it. Add concise markdown before consequential code. Bound previews and logs; never embed huge tables or accidental secrets.

## Clean-run gate

- Restart the kernel and execute top to bottom.
- Fail on hidden variables, order dependence, missing paths, stale outputs, or uncaught errors.
- Confirm stored execution order is monotonic.
- Confirm narrative values match executed outputs and canonical results.
- Run unit/data-contract tests and record results.
- Preserve a machine-readable execution log and environment details.

## Production boundary

The VS Code/IPYNB specialist may restructure validated code and improve reproducibility but must not silently change target definitions, filters, metrics, results, or conclusions. Route analytical changes back to the method owner and validator.

