# Codex handoff — first working integration

Repository: https://github.com/justappgrabbin/Agentic-reality

## Current verified repository state
- Architecture, integration plan and original-source manifest are committed.
- Two unchanged original text sources have been imported:
  - `vendor/originals/sensory-input-adapter/sensory_input_adapter-1.py`
  - `vendor/originals/agentic-reality-page/AgenticRealityPage.tsx`
- Most archive sources are **still in Google Drive**, not in this repository. Do not claim the full runtime is imported or playable.

## Codex assignment
1. Read `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/INTEGRATION_PLAN.md`, and `sources/ARCHIVE_MANIFEST.md`.
2. Retrieve the **actual** ConsciousnessRealm and Klein-Mesh v5.1 archives using the manifest. If Codex cannot access the linked Google Drive or Library sources, ask the user to attach those two original archives. Never recreate them from descriptions.
3. Inventory source trees and original tests. Audit embedded `.git`, dependency directories, secrets, licensing, binary assets, nested archives and duplicate engines. Record source hashes.
4. Import audited, unmodified source trees to `vendor/originals/` or a clearly documented equivalent. Keep third-party notices. Do not import heavy binary model weights or bundled dependencies into ordinary Git.
5. Identify the authoritative ConsciousnessRealm world loop and Klein-Mesh per-game context boundaries. Verify whether the v0.5.4 checkpoint already integrates Klein-Mesh and reuse proven integration.
6. Implement a small adapter in `packages/` that accepts observations, proposes actions, validates world events, and projects updated state to multiple game contexts. Do not replace original engines.
7. Demonstrate one autonomous agent participating in activity A, changing persistent world state, and observing the same consequence from activity B. Test restart and event provenance.
8. Add relational possibilities and scripted scene setup later, preserving independent agent decisions and human autonomy.
9. Report actual commands, build/test results, unresolved source dependencies, and any unverified functionality.

## Hard constraints
- Exact 13-field address: `planetary.dimension.gate.line.color.tone.base.degree.minute.second.arc.zodiac.house`.
- Five contextual dimensions: Movement, Evolution, Being, Design, Space.
- One canonical world; multiple expressions and game contexts.
- Host expression can shape a visitor's view; identity and autonomy persist.
- Resonance Network is a separate social product.
- No mock-only success claims, no undocumented rewrites, no silent substitution.

## Immediate milestone
A reproducible runnable example and test that proves **one event crosses two game contexts without losing identity or world-state continuity**.
