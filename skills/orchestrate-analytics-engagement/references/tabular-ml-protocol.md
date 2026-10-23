# Tabular machine-learning protocol

## Eligibility gate

- Confirm row/target grain, prediction time, feature availability, action, and cost of errors.
- Reject random splitting for grouped or temporal leakage structures.
- Separate a final holdout before feature selection or tuning.
- Define a naive baseline and an interpretable baseline.

## Procedure

1. Profile target prevalence/distribution, missingness, cardinality, groups, time, duplicates, and potential leakage.
2. Build one pipeline containing imputing, encoding, scaling where needed, feature selection, and estimator.
3. Evaluate naive and linear/regularized baselines.
4. Add tree ensembles or boosting only if the baseline leaves material value.
5. Use group-, stratification-, or time-aware cross-validation matching deployment.
6. Tune inside training folds; never tune against the final holdout.
7. Use class weights, thresholds, resampling, or specialized objectives only within folds.
8. Evaluate once on the untouched holdout after freezing the candidate.

## Required diagnostics

- Fold and holdout metrics with dispersion, sample sizes, and uncertainty.
- Calibration curve and proper score when predicted probabilities matter.
- Threshold/cost analysis; do not default to 0.5 without a decision rationale.
- Residual/error slices by time, subgroup, missingness, and operationally important segment.
- Learning curve or evidence about data sufficiency.
- Feature importance plus a stable explanation method; state correlation/causality limits.
- Sensitivity to seeds, split boundaries, weighting, and influential features.
- Inference latency, model size, dependency burden, and maintainability.

## Outputs

- executable training/evaluation pipeline and environment;
- split manifest, target/feature dictionary, and leakage review;
- baseline/candidate comparison and tuning trace;
- holdout predictions and metrics;
- calibration, residual, subgroup, stability, and explanation artifacts;
- model card and handoff.

## Rejection rules

Reject or block a candidate that lacks a meaningful baseline, uses contaminated validation, fails material subgroup/stability checks, relies on unavailable future features, is materially uncalibrated for its use, or adds complexity without decision-relevant gain.

