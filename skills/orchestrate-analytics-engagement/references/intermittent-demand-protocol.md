# Intermittent-demand protocol

## Classification

For each series, compute:

- average demand interval (ADI): periods divided by nonzero-demand periods;
- squared coefficient of variation of positive demand sizes (CV^2);
- nonzero rate, zero-run distribution, time since last demand, and positive-size distribution.

Freeze the classification reference, threshold, and variance convention as one contract. Record positive-event sample size, mean, sum of squared deviations, variance denominator, `ddof`, CV^2 formula, and threshold. When positive-event count is small, report sample-variance and population-variance CV^2 and do not hide a category change caused by the convention. Classify smooth, erratic, intermittent, or lumpy using documented thresholds; do not treat thresholds as universal truth. Investigate stockouts, batching, censoring, discontinued items, and aggregation effects before modeling.

## Model occurrence and size

1. Freeze time-aware origins and the operational horizon.
2. Include zero, last/nonzero, seasonal-naive, and aggregate-rate baselines.
3. Compare Croston, SBA, TSB, ADIDA, IMAPA, or occurrence/positive-size hurdle models only where assumptions fit.
4. Tune smoothing inside historical origins.
5. Let TSB-like probability decay address obsolescence where relevant.
6. Evaluate aggregate and item-level behavior; do not hide failures through pooling.

## Metrics and diagnostics

- Avoid MAPE when actual demand is zero.
- Report bias, MAE, MASE where defined, cumulative-demand error, inventory-weighted error, and quantile/probabilistic scores where available.
- Evaluate occurrence calibration separately from positive-size error.
- Inspect zero runs, probability decay, obsolescence, bursts, and forecast stability.
- Connect errors to service level, fill rate, stockout risk, holding cost, safety stock, and lead time when the decision is inventory-related.
- Compare candidates at identical origins and aggregation levels.

## Outputs

- series intermittency table and exclusions;
- occurrence/size diagnostics and obsolescence flags;
- fold-level comparable predictions and scores;
- service/inventory scenarios and sensitivity to lead time/cost assumptions;
- forecast distribution or order-policy inputs;
- handoff.

## Rejection rules

Reject a method chosen solely because demand contains zeros, misleading percentage metrics, ordinary random validation, silent treatment of stockouts as zero demand, probability forecasts with poor occurrence calibration, or recommendations disconnected from inventory consequences.
