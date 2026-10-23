# Expert handoff contract

Write `handoff.json` with this structure:

```json
{
  "schema_version": 1,
  "expert_id": "",
  "creator_agent_id": "",
  "role_contract_id": "",
  "protocol_id": "",
  "status": "complete|partial|blocked",
  "question_addressed": "",
  "data_copy": {
    "manifest_path": "",
    "manifest_version": "",
    "verified_checksums": true,
    "exceptions": []
  },
  "methods_used": [],
  "unique_procedure_steps": [],
  "unique_outputs": [],
  "metric_definitions": [
    {"id": "", "formula": "", "convention": ""}
  ],
  "frozen_evaluation_contract_followed": true,
  "files_created": [],
  "key_evidence": [
    {"claim": "", "artifact": "", "location": ""}
  ],
  "findings": [],
  "confidence": {"level": "low|medium|high", "basis": ""},
  "limitations": [],
  "unresolved_questions": [],
  "rejected_approaches": [],
  "recommended_next_workstream": "",
  "independent_first_pass_completed_at": "",
  "other_workstreams_read_before_handoff": []
}
```

List any deviation explicitly. Never mark the pass independent if another expert's findings were visible first.

Conform exactly:

- `status` must be `complete`, `partial`, or `blocked`;
- `confidence.level` must be `low`, `medium`, or `high`; put qualifications in `confidence.basis`;
- boolean fields must be `true` or `false`, not custom strings or `null`;
- preserve every required field, using empty arrays or strings where no value exists.

Validate against `references/expert-handoff.schema.json` before submission.
