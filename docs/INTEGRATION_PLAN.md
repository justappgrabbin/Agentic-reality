# Codex integration plan

## Phase 0 — preserve originals and establish evidence
- Retrieve original archives from the Drive links in `sources/ARCHIVE_MANIFEST.md`.
- Check archive integrity, nested archives, licensing, secrets, executable entrypoints, and dependencies.
- Record SHA-256, archive entry count, extracted source paths, source version, import commit, and exact tests.
- Exclude archived `.git`, `node_modules`, `.venv`, `dist`, `build`, generated video, model weights and private material from normal source imports. Preserve provenance in manifests.
- Run unmodified test suites where possible; mark unverified claims as unverified.

## Phase 1 — establish canonical runtime
- Examine ConsciousnessRealm `EmbodiedWorldEngine.ts`, `AgentWorld.tsx`, `MorphKernel.ts`, `embodiedAgent.ts`, `World3D.tsx`, `AgentLifeEngine.ts`.
- Locate any existing `agentReality` core matching `AgenticRealityPage.tsx` before implementing an alternative.
- Trace agent IDs, world clock, actions, events, save/restart, observer/perspective and render loops.
- Select and test a single authoritative world-state owner.

## Phase 2 — integrate Klein-Mesh
- Inspect original `core-engine`, `klein-mesh-game-engine`, `sensory-adapter`, `gamengen-adapter`, `pipeline`, `ato-engine`.
- Inspect `PATCH_NOTES_v5.1.md`; separate per-game contexts are a known issue requiring shared substrate.
- Define a typed bridge: `WorldObservation -> GameContext -> ProposedAction -> ValidatedWorldEvent -> WorldState`.
- Preserve original game grammar behavior. Test cross-context observation and state persistence.
- Verify whether v0.5.4 checkpoint already bundles a compatible Klein engine before copying duplicates.

## Phase 3 — social possibilities and embodiment
- Compare Relational Mesh, Reciprocal Life, Dream Habitat and v0.5.5 algebra APIs.
- Use explicit relationship operators to create available situations, not forced character decisions.
- Integrate morphing, rigs, animations and host-specific visual projection through adapters.

## Phase 4 — generative situations
- Connect Autonove video perception and the existing Video Lab JSON timeline to a structured scene proposal.
- Separate scripted **setup** from autonomous **outcome**.
- Use video studios for authored clips and cinematic presentation; retain event log as source of truth.
- Add educational activities and content ingestion through their existing modules.

## Acceptance tests
- A game event is validated, recorded once and observable in another activity.
- Agent acts with no human participant connected.
- Restart retains identity, event history and relations.
- Host expression changes the view, not the visitor's identity.
- Scripted setup does not override agent choices.
- A malformed or unqualified action cannot mutate canonical state.
- Every test identifies exact source versions and reproducible commands.

## Status
Initial repository documentation staged. Original archives are **not yet imported**, and no integrated runtime is claimed.
