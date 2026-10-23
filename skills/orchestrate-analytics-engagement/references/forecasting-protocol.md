# General forecasting protocol

## Define the task

- Fix series grain, frequency, forecast creation time, horizon, target availability delay, hierarchy, and update cadence.
- Identify missing periods, zeros, censoring, stockouts, holidays, promotions, price, structural breaks, and exogenous-feature availability at forecast time.
- Route intermittent or lumpy series to the intermittent-demand protocol.

## Backtesting

1. Preserve chronology and define rolling/expanding origins that mimic deployment.
2. Use identical origins, horizons, available information, and aggregation weights for every candidate.
3. Include naive, last-value, seasonal-naive, and other decision-relevant baselines.
4. Fit preprocessing and feature engineering separately within each origin.
5. Score by horizon, origin, series, hierarchy level, and operational segment.
6. Reserve a final recent period if enough history remains.

## Candidates

Use only justified families: moving averages, exponential smoothing/ETS, ARIMA/SARIMA, state-space, dynamic regression, lag/rolling-feature regression, boosted models, hierarchical reconciliation, or Prophet when its structural assumptions fit. Avoid automatic model proliferation.

## Metrics and diagnostics

- Report bias plus MAE/RMSE and scale-free measures such as MASE or WAPE as appropriate.
- Use sMAPE cautiously; avoid undefined/misleading percentage errors around zero.
- Evaluate quantile loss and empirical interval coverage when uncertainty is delivered.
- Inspect residual autocorrelation, seasonality, heteroskedasticity, breaks, and horizon degradation.
- Test sensitivity to cutoff, window length, hyperparameters, and exogenous assumptions.
- Reconcile hierarchy coherently when totals and components are both used.

## Outputs

- series/data-availability diagnostics;
- origin/horizon manifest and baseline definitions;
- fold-level predictions and comparable score table;
- bias, residual, interval-coverage, horizon, segment, and hierarchy diagnostics;
- approved forecast with uncertainty and monitoring/retraining triggers;
- handoff.

## Rejection rules

Reject random splits, comparisons with unequal information, future exogenous variables unavailable at issue time, weak baselines, models unstable across origins, uncontrolled bias, incoherent hierarchy, or prediction intervals without defensible coverage evidence.

