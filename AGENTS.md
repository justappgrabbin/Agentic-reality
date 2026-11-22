# Codex instructions — Agentic Reality

## Non-negotiable source fidelity
- Work from the user's **actual existing source files**, not reconstructed lookalikes.
- Preserve source history and provenance. Put unmodified, audited source under `vendor/originals/`; adaptations belong under `packages/`.
- Never silently replace functioning source with stubs, mock implementations, screenshots, or prose.
- Read `docs/INTEGRATION_PLAN.md` and `sources/ARCHIVE_MANIFEST.md` before changing architecture.
- Before modifying original code, document the specific original file, proposed change, rationale, affected interfaces, and verification plan. Prefer adapter layers.
- Do not assume claims in README files or archived test reports mean the runtime passes today. Execute and record tests.
- Distinguish source present, source imported, builds, tests, and end-to-end integration.
- Do not commit credentials, personal records, hidden .git directories, node_modules, Python virtualenvs, model weights, caches, or large generated files.
- Maintain the exact 13-field address: `planetary.dimension.gate.line.color.tone.base.degree.minute.second.arc.zodiac.house`.
- Preserve five contextual dimensions: Movement, Evolution, Being, Design, Space.
- Preserve identity/state continuity independently of viewpoint and visual expression.
- Humans and agents act autonomously; scripted events establish circumstances but do not force outcomes.
- Preserve the Resonance Network as a distinct social project, not the name or replacement of this runtime.
- Prefer phone-friendly browser execution and local-first runtime where feasible; verify resource demands.
- Avoid branding the new project after names embedded in historical filenames.

## Priority
1. Import and inspect ConsciousnessRealm and Klein-Mesh.
2. Identify the canonical persistent world state and the existing Klein game-context boundaries.
3. Implement an explicit adapter and test one cross-game state transition.
4. Add relational possibilities, agent autonomy, save/reload, and visual projection.
5. Integrate video, scripts, learning and other assets incrementally.

## Definition of done
Provide reproducible install/build/test commands, test logs, real screenshots where applicable, and a live playable interaction. A passing static type check alone is not an end-to-end integration.
