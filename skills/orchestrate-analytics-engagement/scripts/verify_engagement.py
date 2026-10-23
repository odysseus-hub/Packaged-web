#!/usr/bin/env python3
"""Verify copy, contract, handoff, reproducibility, and release gates."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path
from typing import Any


REQUIRED_WORKSTREAM_ENTRIES = [
    "data",
    "notebooks",
    "scripts",
    "outputs",
    "role_brief.md",
    "workstream_plan.md",
    "methods.md",
    "findings.md",
    "limitations.md",
    "handoff.json",
]
REQUIRED_ROLE_FIELDS = [
    "Engagement ID",
    "Role contract ID",
    "Expert ID and role",
    "Assigned agent",
    "Creator agent ID",
    "Independence status",
    "Protocol ID",
    "Computational workstream",
    "Approved at timestamp",
    "Decision supported",
    "Analytical question",
    "In scope",
    "Out of scope",
    "Source manifest path/version",
    "Private data-copy path",
    "Frozen target/estimand",
    "Frozen partitions/origins/horizons",
    "Metrics and uncertainty",
    "Metric definitions and conventions",
    "Required baselines/comparators",
    "Required diagnostics",
    "Unique procedure steps",
    "Unique outputs",
    "Output files",
    "Acceptance criteria",
    "Constraints and prohibited claims",
    "Dependencies",
    "Handoff recipient",
    "Due/review point",
]
REQUIRED_PLAN_FIELDS = [
    "Role contract ID",
    "Question",
    "Steps",
    "Unique outputs",
    "Acceptance criteria",
    "Preflight approval timestamp",
]
HANDOFF_FIELDS = {
    "schema_version",
    "expert_id",
    "creator_agent_id",
    "role_contract_id",
    "protocol_id",
    "status",
    "question_addressed",
    "data_copy",
    "methods_used",
    "unique_procedure_steps",
    "unique_outputs",
    "metric_definitions",
    "frozen_evaluation_contract_followed",
    "files_created",
    "key_evidence",
    "findings",
    "confidence",
    "limitations",
    "unresolved_questions",
    "rejected_approaches",
    "recommended_next_workstream",
    "independent_first_pass_completed_at",
    "other_workstreams_read_before_handoff",
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def defect(
    defects: list[dict[str, str]], gate: str, expert: str, path: str, message: str
) -> None:
    defects.append({"gate": gate, "expert": expert, "path": path, "defect": message})


def markdown_fields(path: Path) -> dict[str, str]:
    fields: dict[str, str] = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        match = re.match(r"^\s*-\s+([^:]+):\s*(.*)$", raw)
        if match:
            fields[match.group(1).strip()] = match.group(2).strip()
    return fields


def nonempty_strings(value: Any) -> bool:
    return isinstance(value, list) and all(isinstance(item, str) for item in value)


def validate_handoff(
    handoff: Any,
    expert: str,
    release: bool,
    defects: list[dict[str, str]],
) -> bool:
    start = len(defects)
    path = "handoff.json"
    if not isinstance(handoff, dict):
        defect(defects, "handoff", expert, path, "root must be an object")
        return False
    missing = HANDOFF_FIELDS - set(handoff)
    extra = set(handoff) - HANDOFF_FIELDS
    if missing:
        defect(defects, "handoff", expert, path, f"missing fields: {sorted(missing)}")
    if extra:
        defect(defects, "handoff", expert, path, f"unexpected fields: {sorted(extra)}")
    if handoff.get("schema_version") != 1:
        defect(defects, "handoff", expert, path, "schema_version must equal 1")
    for field in (
        "expert_id",
        "creator_agent_id",
        "role_contract_id",
        "protocol_id",
        "question_addressed",
        "recommended_next_workstream",
        "independent_first_pass_completed_at",
    ):
        if not isinstance(handoff.get(field), str):
            defect(defects, "handoff", expert, path, f"{field} must be a string")
        elif release and field not in {"recommended_next_workstream"} and not handoff[field].strip():
            defect(defects, "handoff", expert, path, f"{field} must be non-empty at release")
    if handoff.get("status") not in {"complete", "partial", "blocked"}:
        defect(defects, "handoff", expert, path, "status enum is invalid")
    if release and handoff.get("status") != "complete":
        defect(defects, "handoff", expert, path, "status must be complete at release")
    if not isinstance(handoff.get("frozen_evaluation_contract_followed"), bool):
        defect(
            defects,
            "handoff",
            expert,
            path,
            "frozen_evaluation_contract_followed must be boolean",
        )
    elif release and not handoff["frozen_evaluation_contract_followed"]:
        defect(defects, "handoff", expert, path, "evaluation contract was not followed")

    data_copy = handoff.get("data_copy")
    if not isinstance(data_copy, dict) or set(data_copy) != {
        "manifest_path",
        "manifest_version",
        "verified_checksums",
        "exceptions",
    }:
        defect(defects, "handoff", expert, path, "data_copy shape is invalid")
    else:
        if not isinstance(data_copy["manifest_path"], str):
            defect(defects, "handoff", expert, path, "manifest_path must be a string")
        if not isinstance(data_copy["manifest_version"], (int, str)):
            defect(defects, "handoff", expert, path, "manifest_version type is invalid")
        if not isinstance(data_copy["verified_checksums"], bool):
            defect(defects, "handoff", expert, path, "verified_checksums must be boolean")
        elif release and not data_copy["verified_checksums"]:
            defect(defects, "handoff", expert, path, "checksums are not verified")
        if not isinstance(data_copy["exceptions"], list):
            defect(defects, "handoff", expert, path, "data_copy.exceptions must be an array")

    for field in (
        "methods_used",
        "unique_procedure_steps",
        "unique_outputs",
        "files_created",
        "findings",
        "limitations",
        "unresolved_questions",
        "rejected_approaches",
        "other_workstreams_read_before_handoff",
    ):
        if not nonempty_strings(handoff.get(field)):
            defect(defects, "handoff", expert, path, f"{field} must be an array of strings")
    for field in ("methods_used", "unique_procedure_steps", "unique_outputs", "files_created"):
        if release and isinstance(handoff.get(field), list) and not handoff[field]:
            defect(defects, "handoff", expert, path, f"{field} must be non-empty at release")

    evidence = handoff.get("key_evidence")
    if not isinstance(evidence, list):
        defect(defects, "handoff", expert, path, "key_evidence must be an array")
    else:
        for index, item in enumerate(evidence):
            if not isinstance(item, dict) or set(item) != {"claim", "artifact", "location"}:
                defect(
                    defects,
                    "handoff",
                    expert,
                    path,
                    f"key_evidence[{index}] shape is invalid",
                )
            elif not all(isinstance(item[key], str) for key in item):
                defect(
                    defects,
                    "handoff",
                    expert,
                    path,
                    f"key_evidence[{index}] values must be strings",
                )
        if release and not evidence:
            defect(defects, "handoff", expert, path, "key_evidence must be non-empty at release")

    definitions = handoff.get("metric_definitions")
    if not isinstance(definitions, list):
        defect(defects, "handoff", expert, path, "metric_definitions must be an array")
    else:
        for index, item in enumerate(definitions):
            if not isinstance(item, dict) or set(item) != {"id", "formula", "convention"}:
                defect(
                    defects,
                    "handoff",
                    expert,
                    path,
                    f"metric_definitions[{index}] shape is invalid",
                )
            elif not all(isinstance(item[key], str) for key in item):
                defect(
                    defects,
                    "handoff",
                    expert,
                    path,
                    f"metric_definitions[{index}] values must be strings",
                )
            elif release and not all(item[key].strip() for key in item):
                defect(
                    defects,
                    "handoff",
                    expert,
                    path,
                    f"metric_definitions[{index}] values must be non-empty at release",
                )

    confidence = handoff.get("confidence")
    if not isinstance(confidence, dict) or set(confidence) != {"level", "basis"}:
        defect(defects, "handoff", expert, path, "confidence shape is invalid")
    else:
        if confidence["level"] not in {"low", "medium", "high"}:
            defect(defects, "handoff", expert, path, "confidence.level enum is invalid")
        if not isinstance(confidence["basis"], str):
            defect(defects, "handoff", expert, path, "confidence.basis must be a string")
        elif release and not confidence["basis"].strip():
            defect(defects, "handoff", expert, path, "confidence.basis is empty")
    return len(defects) == start


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("engagement_root", type=Path)
    parser.add_argument("--stage", choices=("copy", "preflight", "release"), default="preflight")
    args = parser.parse_args()

    root = args.engagement_root.resolve()
    manifest_path = root / "01_source_manifest" / "source_manifest.json"
    defects: list[dict[str, str]] = []
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except Exception as exc:
        print(json.dumps({"release_ready": False, "defects": [str(exc)]}, indent=2))
        return 1

    role_fields: dict[str, dict[str, str]] = {}
    handoffs: dict[str, dict[str, Any]] = {}
    copy_valid = True
    contract_valid = True
    handoff_valid = True
    reproducibility_valid = True
    definition_valid = True
    independence_valid = True

    for expert in manifest["experts"]:
        workstream = root / "02_workstreams" / expert
        for name in REQUIRED_WORKSTREAM_ENTRIES:
            if not (workstream / name).exists():
                defect(defects, "copy", expert, name, "required entry is missing")
                copy_valid = False
        for item in manifest["files"]:
            relative = item["relative_path"]
            copied = workstream / "data" / Path(relative)
            if not copied.is_file():
                defect(defects, "copy", expert, relative, "data copy is missing")
                copy_valid = False
            elif sha256(copied) != item["sha256"]:
                defect(defects, "copy", expert, relative, "checksum mismatch")
                copy_valid = False

        role_path = workstream / "role_brief.md"
        plan_path = workstream / "workstream_plan.md"
        if role_path.is_file():
            fields = markdown_fields(role_path)
            role_fields[expert] = fields
            for field in REQUIRED_ROLE_FIELDS:
                if not fields.get(field, "").strip():
                    defect(defects, "contract", expert, "role_brief.md", f"{field} is blank")
                    contract_valid = False
            if fields.get("Computational workstream", "").lower() not in {"true", "false"}:
                defect(
                    defects,
                    "contract",
                    expert,
                    "role_brief.md",
                    "Computational workstream must be true or false",
                )
                contract_valid = False
        else:
            contract_valid = False
        if plan_path.is_file():
            plan = markdown_fields(plan_path)
            for field in REQUIRED_PLAN_FIELDS:
                if not plan.get(field, "").strip():
                    defect(defects, "contract", expert, "workstream_plan.md", f"{field} is blank")
                    contract_valid = False
            if (
                expert in role_fields
                and plan.get("Role contract ID")
                != role_fields[expert].get("Role contract ID")
            ):
                defect(
                    defects,
                    "contract",
                    expert,
                    "workstream_plan.md",
                    "role-contract ID does not match role brief",
                )
                contract_valid = False
        else:
            contract_valid = False

        handoff_path = workstream / "handoff.json"
        try:
            handoff = json.loads(handoff_path.read_text(encoding="utf-8"))
            handoffs[expert] = handoff
            if not validate_handoff(
                handoff, expert, args.stage == "release", defects
            ):
                handoff_valid = False
        except Exception as exc:
            defect(defects, "handoff", expert, "handoff.json", f"invalid JSON: {exc}")
            handoff_valid = False

    if args.stage == "release":
        definition_registry: dict[str, tuple[str, str, str]] = {}
        creator_by_expert: dict[str, str] = {}
        signature_registry: dict[tuple[tuple[str, ...], tuple[str, ...]], str] = {}
        validator_creators: set[str] = set()
        nonvalidator_creators: set[str] = set()

        for expert, handoff in handoffs.items():
            fields = role_fields.get(expert, {})
            creator = handoff.get("creator_agent_id", "")
            creator_by_expert[expert] = creator
            if creator != fields.get("Creator agent ID", ""):
                defect(
                    defects,
                    "independence",
                    expert,
                    "handoff.json",
                    "creator_agent_id does not match role brief",
                )
                independence_valid = False
            for id_field, role_field in (
                ("role_contract_id", "Role contract ID"),
                ("protocol_id", "Protocol ID"),
            ):
                if handoff.get(id_field) != fields.get(role_field, ""):
                    defect(
                        defects,
                        "contract",
                        expert,
                        "handoff.json",
                        f"{id_field} does not match role brief",
                    )
                    contract_valid = False

            is_validator = "validation" in (
                expert + " " + fields.get("Expert ID and role", "")
            ).lower()
            if is_validator:
                validator_creators.add(creator)
            else:
                nonvalidator_creators.add(creator)
                if handoff.get("other_workstreams_read_before_handoff"):
                    defect(
                        defects,
                        "independence",
                        expert,
                        "handoff.json",
                        "first-pass expert read other workstreams",
                    )
                    independence_valid = False
                signature = (
                    tuple(handoff.get("unique_procedure_steps", [])),
                    tuple(handoff.get("unique_outputs", [])),
                )
                if signature in signature_registry:
                    defect(
                        defects,
                        "independence",
                        expert,
                        "handoff.json",
                        f"procedure/output signature duplicates {signature_registry[signature]}",
                    )
                    independence_valid = False
                else:
                    signature_registry[signature] = expert

            for definition in handoff.get("metric_definitions", []):
                if not isinstance(definition, dict):
                    continue
                metric_id = definition.get("id", "")
                signature = (
                    definition.get("formula", ""),
                    definition.get("convention", ""),
                )
                if metric_id in definition_registry:
                    old_formula, old_convention, old_expert = definition_registry[metric_id]
                    if signature != (old_formula, old_convention):
                        defect(
                            defects,
                            "definition",
                            expert,
                            "handoff.json",
                            f"metric {metric_id} conflicts with {old_expert}",
                        )
                        definition_valid = False
                elif metric_id:
                    definition_registry[metric_id] = (*signature, expert)

            computational_value = fields.get("Computational workstream", "").lower()
            if computational_value not in {"true", "false"}:
                defect(
                    defects,
                    "reproducibility",
                    expert,
                    "role_brief.md",
                    "computational status is unknown, so reproducibility cannot be cleared",
                )
                reproducibility_valid = False
            computational = computational_value == "true"
            if computational:
                executable_files = [
                    path
                    for folder in ("scripts", "notebooks")
                    for path in (root / "02_workstreams" / expert / folder).rglob("*")
                    if path.is_file()
                ]
                if not executable_files:
                    defect(
                        defects,
                        "reproducibility",
                        expert,
                        "scripts|notebooks",
                        "computational workstream has no executable artifact",
                    )
                    reproducibility_valid = False
                clean_path = (
                    root / "02_workstreams" / expert / "outputs" / "clean_run.json"
                )
                try:
                    clean = json.loads(clean_path.read_text(encoding="utf-8"))
                    required_clean = {"status", "command", "executed_at", "artifact"}
                    if set(clean) != required_clean or clean.get("status") != "pass":
                        raise ValueError("clean-run shape/status is invalid")
                    if not all(
                        isinstance(clean[key], str) and clean[key].strip()
                        for key in required_clean - {"status"}
                    ):
                        raise ValueError("clean-run fields must be non-empty strings")
                    artifact = root / "02_workstreams" / expert / clean["artifact"]
                    if not artifact.is_file():
                        raise ValueError("clean-run artifact path does not exist")
                except Exception as exc:
                    defect(
                        defects,
                        "reproducibility",
                        expert,
                        "outputs/clean_run.json",
                        str(exc),
                    )
                    reproducibility_valid = False

        if not validator_creators:
            defect(
                defects,
                "independence",
                "",
                "02_workstreams",
                "no independent validation workstream is identifiable",
            )
            independence_valid = False
        if validator_creators & nonvalidator_creators:
            defect(
                defects,
                "independence",
                "",
                "02_workstreams",
                "validator creator also created reviewed work",
            )
            independence_valid = False

    release_ready = args.stage == "release" and all(
        (
            copy_valid,
            contract_valid,
            handoff_valid,
            reproducibility_valid,
            definition_valid,
            independence_valid,
        )
    )
    result = {
        "stage": args.stage,
        "copy_integrity_valid": copy_valid,
        "contract_valid": contract_valid,
        "handoff_valid": handoff_valid,
        "reproducibility_valid": reproducibility_valid,
        "definition_consistency_valid": definition_valid,
        "independence_valid": independence_valid,
        "release_ready": release_ready,
        "expert_count": len(manifest["experts"]),
        "source_file_count": manifest["source_file_count"],
        "defects": defects,
    }
    print(json.dumps(result, indent=2))
    if args.stage == "copy":
        return 0 if copy_valid else 1
    if args.stage == "preflight":
        return 0 if copy_valid and contract_valid and handoff_valid else 1
    return 0 if release_ready else 1


if __name__ == "__main__":
    raise SystemExit(main())
