# Copilot instructions for graphfinder

## Repository state
- This repository is currently a greenfield skeleton.
- Tracked files at onboarding time are limited to `README.md` and `LICENSE`.
- There is no application code, no dependency manifest, no build configuration, no CI workflow, and no existing test suite yet.

## How to work efficiently here
- Start every task by confirming whether new source files, a project structure, or a language/toolchain need to be introduced, because the repository does not establish them yet.
- Treat `README.md` as the only existing project documentation until more docs are added.
- Keep changes small and intentional; in an empty repository, even small additions define future structure and conventions.
- Prefer creating the minimum scaffolding needed for the requested task instead of inventing broad architecture up front.
- When adding the first implementation, also add the corresponding basic developer workflow documentation so future agents can discover how to build, lint, and test it.

## Validation expectations
- Before claiming that lint, build, or test steps passed, first verify that the corresponding tooling actually exists in the repository.
- At onboarding time, there are no known lint, build, or test commands to run.
- If a task introduces tooling, document the exact commands in the README or other project docs and keep this file aligned with that workflow.

## Environment and exploration notes
- The repository does not currently contain a `.github` directory other than this onboarding file, so do not assume the presence of workflows, issue templates, or PR templates.
- There is only a minimal README, so git history and direct file inspection are the best sources of truth until the project grows.
- If requirements are ambiguous, ask for clarification instead of assuming a language, framework, storage model, or deployment target.

## Errors encountered during onboarding
- Attempting to inspect `/.github` initially failed because the directory did not exist.
- Work-around: inspect the repository root, README, and git tree/history directly, then create `/.github/copilot-instructions.md`.
- No build, lint, or test commands were available to run during onboarding because the repository has no project tooling yet.
