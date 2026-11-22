# Agentic Reality

A continuous, agentic reality in which autonomous participants inhabit a persistent shared world and engage in games, learning, creation, social encounters, and other activities. Different activities are projections of one reality, not disconnected save files.

## Existing foundations
- **ConsciousnessRealm**: candidate world runtime, agent lifecycle, embodiment, perception, morphing.
- **Klein-Mesh Game Engine v5.1**: game grammar, sensory observation, relationship transformation, cross-game mechanics.
- **Relational Mesh / Reciprocal Life / Dream Habitat**: relational possibilities, mutual influence, habitat state.
- **Morph3D / animation / motion matching / UniRig**: character expression and physical motion.
- **Autonove / video studio / generative systems**: video perception, script/scene creation, cinematics and authored situations.
- **HD Field Learning Platform / SynthWorld**: educational and game activities within the reality.
- **Resonance Network**: distinct social product; integrate through explicit interfaces only, without conflating its purpose with the reality runtime.

## Current status
This repository is an **integration staging area**, not yet a runnable complete world. The initial commit records original archive locations, integration boundaries, acceptance tests, and Codex instructions. The source archives remain in the user's Google Drive until their original source trees are imported and checked. Do not treat archive inventory as implemented functionality.

## Start here
1. Read [AGENTS.md](AGENTS.md).
2. Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/INTEGRATION_PLAN.md](docs/INTEGRATION_PLAN.md).
3. Use [sources/ARCHIVE_MANIFEST.md](sources/ARCHIVE_MANIFEST.md) to obtain and verify original source.
4. Import sources into `vendor/originals/<archive-slug>/` without modifying originals, excluding secrets, caches, dependencies, embedded .git histories, and generated binaries. Record SHA-256 and origin for every import.
5. Build adapters in `packages/` only after testing the real source APIs.

**First acceptance milestone:** an agent acts in activity A; the world records the event; activity B observes the same consequence; save/reload preserves agent identity and event history.
