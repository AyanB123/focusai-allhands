# Git Workflow for ProductivityPro Documentation

This document outlines the Git branching strategy, commit guidelines, and workflow for the ProductivityPro documentation repository.

## Branch Structure

### Main Branches

- **`main`**: Production-ready documentation
- **`develop`**: Integration branch for ongoing documentation work

### Feature Branches

Feature branches follow the naming convention:
```
docs/<category>/<feature-name>
```

Where:
- `<category>` is one of: `architecture`, `development`, `phases`, `tasks`, `api`, `user`
- `<feature-name>` is a brief, hyphenated description of the documentation being added

Examples:
- `docs/architecture/frontend-components`
- `docs/phases/phase3-advanced-ai`
- `docs/tasks/backend-tasks`

### Fix Branches

For small fixes, use the naming convention:
```
fix/<issue-number>-<brief-description>
```

Example:
- `fix/42-broken-links`
- `fix/57-typo-corrections`

## Workflow Steps

### 1. Starting New Documentation

```bash
# Ensure you're on the develop branch and it's up to date
git checkout develop
git pull origin develop

# Create a new feature branch
git checkout -b docs/phases/phase3-advanced-ai

# Work on your documentation files
# ...

# Add your changes
git add architecture/ai-ml/gnn.md
git add architecture/ai-ml/lstm.md

# Commit your changes with a descriptive message
git commit -m "Add GNN and LSTM model documentation"

# Push your branch to the remote repository
git push -u origin docs/phases/phase3-advanced-ai
```

### 2. Making Small Fixes

```bash
# Create a fix branch from develop
git checkout develop
git checkout -b fix/63-fix-broken-links

# Make your fixes
# ...

# Add and commit your changes
git add README.md
git commit -m "Fix broken links in main README"

# Push your branch
git push -u origin fix/63-fix-broken-links
```

### 3. Updating Existing Documentation

```bash
# Check out the existing feature branch
git checkout docs/architecture/frontend-components

# Pull any updates
git pull origin docs/architecture/frontend-components

# Make your changes
# ...

# Add and commit your changes
git add architecture/frontend.md
git commit -m "Update component diagram in frontend architecture"

# Push your updates
git push origin docs/architecture/frontend-components
```

## Commit Message Guidelines

Commit messages should be clear and descriptive, following this format:

```
<type>: <subject>

<body>
```

Where:
- `<type>` is one of:
  - `add`: Adding new documentation
  - `update`: Updating existing documentation
  - `fix`: Fixing issues in documentation
  - `remove`: Removing documentation
  - `restructure`: Reorganizing documentation structure
- `<subject>` is a brief description of the change
- `<body>` (optional) provides additional details

Examples:
```
add: Phase 3 documentation with advanced AI features

Includes task breakdown, dependencies, and deliverables for Phase 3.
```

```
fix: Correct broken links in architecture documentation
```

## Pull Request Process

1. **Create Pull Request**: Create a PR from your feature/fix branch to `develop`
2. **PR Title**: Use the format `[DOCS] <type>: <brief description>`
3. **PR Description**: Include:
   - Summary of changes
   - Related issues
   - Screenshots (if applicable)
   - Checklist of completed items
4. **Review**: Request reviews from at least one team member
5. **Merge**: After approval, merge using squash merge

## Release Process

When ready to publish a new version of the documentation:

1. Create a PR from `develop` to `main`
2. Review the complete set of changes
3. After approval, merge using merge commit (not squash)
4. Tag the release with a version number: `v1.0.0`

## Selective Commits

For working on multiple documentation sections simultaneously:

```bash
# Add only specific files
git add phases/phase3-advanced-ai.md
git add tasks/ai-ml-tasks.md
git commit -m "add: Phase 3 and AI/ML tasks documentation"

# Later, add different files to a separate commit
git add architecture/ai-ml/gnn.md
git add architecture/ai-ml/lstm.md
git commit -m "add: GNN and LSTM model documentation"
```

## Implementation Plan

### Step 1: Initialize Repository Structure

```bash
# Create and switch to develop branch
git checkout -b develop

# Add initial structure
git add README.md
git add .github/
git commit -m "add: Initial documentation structure and GitHub templates"
git push -u origin develop
```

### Step 2: Create Category Branches

Create branches for each major documentation category:

```bash
# Architecture documentation
git checkout develop
git checkout -b docs/architecture/core-components
git push -u origin docs/architecture/core-components

# Phase documentation
git checkout develop
git checkout -b docs/phases/remaining-phases
git push -u origin docs/phases/remaining-phases

# Task documentation
git checkout develop
git checkout -b docs/tasks/remaining-tasks
git push -u origin docs/tasks/remaining-tasks

# Development documentation
git checkout develop
git checkout -b docs/development/guidelines
git push -u origin docs/development/guidelines

# API documentation
git checkout develop
git checkout -b docs/api/endpoints
git push -u origin docs/api/endpoints

# User documentation
git checkout develop
git checkout -b docs/user/guides
git push -u origin docs/user/guides
```

### Step 3: Work on Documentation Categories

Work on each branch independently, making focused commits:

```bash
# Example for phase documentation
git checkout docs/phases/remaining-phases

# Create Phase 3 documentation
# ...
git add phases/phase3-advanced-ai.md
git commit -m "add: Phase 3 documentation with advanced AI features"

# Create Phase 4 documentation
# ...
git add phases/phase4-polish-release.md
git commit -m "add: Phase 4 documentation with polish and release tasks"

git push origin docs/phases/remaining-phases
```

### Step 4: Create Pull Requests

Create PRs for each completed documentation category:

```bash
# Create PR for phases documentation
# Title: [DOCS] add: Phase 3 and 4 documentation
# Description: Adds detailed documentation for Phase 3 (Advanced AI) and Phase 4 (Polish and Release)
```

### Step 5: Review and Merge

After review and approval, merge each PR into develop:

```bash
# Merge PR using GitHub's squash and merge feature
```

### Step 6: Release Documentation

When all categories are complete:

```bash
# Create release PR
# Title: [DOCS] Release v1.0.0 of ProductivityPro Documentation
# Description: Complete documentation for ProductivityPro including all phases, tasks, and architecture

# After approval, merge to main
# Create tag v1.0.0
```

## Branch Management Tips

1. **Keep branches focused**: Each branch should focus on a specific documentation category or feature
2. **Regular rebasing**: Regularly rebase feature branches on develop to avoid conflicts
3. **Clean up branches**: Delete branches after merging
4. **Commit early and often**: Make small, focused commits rather than large changes
5. **Use meaningful commit messages**: Follow the commit message guidelines for clarity