#!/usr/bin/env python3
"""Create an isolated, checksum-verified analytics engagement workspace."""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
from datetime import datetime, timezone
from pathlib import Path


EXPERT_PATTERN = set("abcdefghijklmnopqrstuvwxyz0123456789_")
WORKSTREAM_FILES = {
    "workstream_plan.md": (
        "# Workstream plan\n\n"
        "- Role contract ID:\n"
        "- Question:\n"
        "- Steps:\n"
        "- Unique outputs:\n"
        "- Acceptance criteria:\n"
        "- Preflight approval timestamp:\n"
    ),
    "methods.md": "# Methods\n\nRecord methods, parameters, splits, seeds, and diagnostics.\n",
    "findings.md": "# Findings\n\nRecord evidence before reading other workstreams.\n",
    "limitations.md": "# Limitations\n\nRecord limitations and unresolved questions.\n",
    "handoff.json": json.dumps(
        {
            "schema_version": 1,
            "expert_id": "",
            "creator_agent_id": "",
            "role_contract_id": "",
            "protocol_id": "",
            "status": "partial",
            "question_addressed": "",
            "data_copy": {
                "manifest_path": "../../01_source_manifest/source_manifest.json",
                "manifest_version": 1,
                "verified_checksums": True,
                "exceptions": [],
            },
            "methods_used": [],
            "unique_procedure_steps": [],
            "unique_outputs": [],
            "metric_definitions": [],
            "frozen_evaluation_contract_followed": False,
            "files_created": [],
            "key_evidence": [],
            "findings": [],
            "confidence": {"level": "low", "basis": "Workstream has not started."},
            "limitations": [],
            "unresolved_questions": [],
            "rejected_approaches": [],
            "recommended_next_workstream": "",
            "independent_first_pass_completed_at": "",
            "other_workstreams_read_before_handoff": [],
        },
        indent=2,
    )
    + "\n",
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def source_files(sources: list[Path]) -> list[tuple[Path, Path]]:
    files: list[tuple[Path, Path]] = []
    for source in sources:
        resolved = source.resolve()
        if not resolved.exists():
            raise FileNotFoundError(f"Source does not exist: {source}")
        if resolved.is_file():
            files.append((resolved, Path(resolved.name)))
        else:
            for item in sorted(p for p in resolved.rglob("*") if p.is_file()):
                files.append((item, Path(resolved.name) / item.relative_to(resolved)))
    relative_paths = [rel.as_posix().casefold() for _, rel in files]
    if len(relative_paths) != len(set(relative_paths)):
        raise ValueError("Source names collide; pass uniquely named source roots.")
    return files


def valid_expert(name: str) -> bool:
    return bool(name) and set(name) <= EXPERT_PATTERN and not name.startswith("_")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("engagement_root", type=Path)
    parser.add_argument("--source", action="append", type=Path, required=True)
    parser.add_argument("--experts", nargs="+", required=True)
    parser.add_argument("--plan-only", action="store_true")
    args = parser.parse_args()

    invalid = [name for name in args.experts if not valid_expert(name)]
    if invalid:
        raise ValueError(f"Expert ids must use lowercase letters, digits, underscores: {invalid}")

    files = source_files(args.source)
    entries = []
    for src, rel in files:
        entries.append(
            {
                "relative_path": rel.as_posix(),
                "source_path": str(src),
                "bytes": src.stat().st_size,
                "sha256": sha256(src),
            }
        )

    planned = {
        "engagement_root": str(args.engagement_root.resolve()),
        "experts": sorted(set(args.experts)),
        "files_per_expert": len(entries),
        "source_bytes_per_expert": sum(item["bytes"] for item in entries),
        "total_copied_bytes": sum(item["bytes"] for item in entries) * len(set(args.experts)),
    }
    if args.plan_only:
        print(json.dumps({"plan_only": True, **planned}, indent=2))
        return 0

    root = args.engagement_root.resolve()
    if root.exists() and any(root.iterdir()):
        raise FileExistsError(f"Refusing to use non-empty engagement root: {root}")
    root.mkdir(parents=True, exist_ok=True)

    for directory in (
        "00_engagement",
        "01_source_manifest",
        "03_canonical_results",
        "04_integrated_analysis",
        "05_deliverables",
        "06_validation",
    ):
        (root / directory).mkdir(exist_ok=True)

    manifest = {
        "schema_version": 1,
        "created_at_utc": datetime.now(timezone.utc).isoformat(),
        "copy_mode": "physical_copy",
        "source_file_count": len(entries),
        "source_bytes": sum(item["bytes"] for item in entries),
        "experts": sorted(set(args.experts)),
        "files": entries,
    }
    (root / "01_source_manifest" / "source_manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )

    skill_root = Path(__file__).resolve().parent.parent
    role_template = (skill_root / "templates" / "expert-role-brief.md").read_text(
        encoding="utf-8"
    )
    for expert in sorted(set(args.experts)):
        workstream = root / "02_workstreams" / expert
        for directory in ("data", "notebooks", "scripts", "outputs"):
            (workstream / directory).mkdir(parents=True, exist_ok=True)
        for filename, content in WORKSTREAM_FILES.items():
            (workstream / filename).write_text(content, encoding="utf-8")
        (workstream / "role_brief.md").write_text(role_template, encoding="utf-8")
        for src, rel in files:
            destination = workstream / "data" / rel
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, destination)
            copied_hash = sha256(destination)
            source_hash = next(
                item["sha256"] for item in entries if item["relative_path"] == rel.as_posix()
            )
            if copied_hash != source_hash:
                raise IOError(f"Checksum mismatch after copying {rel} for {expert}")

    template_destinations = {
        "canonical-results-register.md": root
        / "03_canonical_results"
        / "canonical-results-register.md",
        "chart-map.md": root / "03_canonical_results" / "chart-map.md",
        "model-comparison.md": root / "04_integrated_analysis" / "model-comparison.md",
        "deliverable-reconciliation.md": root
        / "06_validation"
        / "deliverable-reconciliation.md",
    }
    for template_name, destination in template_destinations.items():
        shutil.copy2(skill_root / "templates" / template_name, destination)
    (root / "04_integrated_analysis" / "model_registry.json").write_text(
        json.dumps(
            {
                "schema_version": 1,
                "status": "not_convened",
                "frozen_comparison_contract": {},
                "candidates": [],
                "decision": None,
                "director_approval": None,
                "independent_validator_approval": None,
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )

    print(json.dumps({"plan_only": False, **planned}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
