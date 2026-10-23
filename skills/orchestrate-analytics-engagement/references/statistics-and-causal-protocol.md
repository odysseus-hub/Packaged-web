# Statistics and causal protocol

## Statistical inference

1. Define population, sampling process, unit, parameter, contrast, outcome, covariates, and decision threshold.
2. Prestate hypotheses, effect-size scale, uncertainty level, multiplicity handling, and subgroup plan.
3. Inspect missingness, dependence, distribution, influential observations, censoring, clustering, and sample adequacy.
4. Choose bootstrap, GLM, mixed effects, survival, Bayesian, or other methods because assumptions fit.
5. Report effect sizes and intervals, not p-values alone.
6. Run sensitivity and robustness checks; distinguish statistical from decision relevance.

Block inference when the sampling/measurement process cannot support the target population or dependence is ignored.

## Causal identification

Before estimation, state:

- treatment, outcome, estimand, population, time zero, follow-up, and treatment versions;
- assignment mechanism and causal graph;
- identification assumptions: exchangeability, positivity/overlap, consistency, no interference, correct timing, and method-specific conditions;
- threats: confounding, selection, attrition, spillovers, anticipation, measurement error, and post-treatment adjustment.

### Method checks

- Randomized experiment: verify assignment, balance, attrition, noncompliance, interference, sample-ratio mismatch, and estimand.
- Difference-in-differences: inspect pre-trends, timing heterogeneity, anticipation, composition, spillovers, and robust estimators.
- Matching/weighting: inspect overlap, balance before/after, extreme weights, effective sample size, and sensitivity to unmeasured confounding.
- Regression discontinuity: test manipulation, bandwidth sensitivity, continuity, functional form, and local interpretation.
- Synthetic control: inspect pre-fit, donor sensitivity, placebo distribution, and post-treatment contamination.
- Instrumental variables: defend relevance, exclusion, independence, monotonicity, weak-instrument diagnostics, and LATE interpretation.

## Outputs

- analysis/identification memo and causal graph when applicable;
- assumption and sample-adequacy checks;
- estimates with uncertainty, multiplicity handling, and sensitivity analyses;
- diagnostic tables/plots and alternative specifications;
- permitted claim language, decision relevance, limitations, and handoff.

## Language gate

Use causal language only when design and diagnostics support identification. Otherwise describe association, prediction, or descriptive difference explicitly.

