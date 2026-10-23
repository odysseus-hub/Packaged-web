# Deep-learning and TensorFlow protocol

## Justification gate

- Document why data volume, unstructured structure, representation learning, or sequence/multimodal requirements may benefit from deep learning.
- Assign a separate simpler-baseline owner using the same partitions and metrics.
- Estimate GPU/CPU, memory, training time, inference latency, and deployment constraints.
- Reject deep learning when a simpler model is likely sufficient and the user receives no material benefit.

## Reproducible training

1. Freeze dataset version, split manifest, preprocessing, label mapping, and leakage boundary.
2. Set Python, NumPy, TensorFlow, sampler, and data-loader seeds where supported; record nondeterministic operations.
3. Version architecture, optimizer, loss, schedule, batch size, augmentation, callbacks, and package/hardware details.
4. Fit preprocessing only on training data.
5. Use checkpoints, early stopping, learning-rate controls, and bounded tuning.
6. Save the best-by-validation checkpoint and evaluate the untouched holdout once.

## Required diagnostics

- Data adequacy and label-quality review.
- Train/validation loss and metric curves; overfit and instability assessment.
- Comparison with simpler baseline on identical examples.
- Architecture/feature/augmentation ablations that test claimed benefits.
- Seed or restart variability for unstable training.
- Confusion/residual analysis, calibration, subgroup performance, and hard examples.
- Robustness to missing/corrupted inputs and distribution shift where relevant.
- Parameter count, checkpoint size, training/inference cost, latency, throughput, and memory.

## Outputs

- architecture rationale and diagram;
- deterministic data/training/evaluation pipeline and config;
- checkpoints and experiment registry;
- learning curves, ablations, holdout predictions, calibration and error analysis;
- model card, resource/deployment profile, and handoff.

## Rejection rules

Reject a neural candidate that cannot beat the simpler baseline materially and reliably, overfits without defensible control, depends on leakage, has unstable results, violates compute/latency constraints, lacks reproducible checkpoints, or cannot support required calibration and subgroup behavior.

