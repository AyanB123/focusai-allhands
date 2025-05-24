# Development Workflow

This document outlines the development workflow for ProductivityPro, including git branching strategy, pull request process, and CI/CD pipeline.

## Git Branching Strategy

ProductivityPro follows a modified GitFlow branching strategy:

### Main Branches

- **`main`**: Production-ready code, always deployable
- **`develop`**: Integration branch for features, primary branch for development

### Supporting Branches

- **Feature Branches**: `feature/*` (e.g., `feature/activity-tracker`)
- **Task Branches**: `feature/t1.1-*` (e.g., `feature/t1.1-dashboard-timeline`)
- **Bugfix Branches**: `bugfix/*` (e.g., `bugfix/idle-detection`)
- **Release Branches**: `release/*` (e.g., `release/v1.0`)
- **Hotfix Branches**: `hotfix/*` (e.g., `hotfix/crash-fix`)

### Branch Naming Conventions

- Feature branches: `feature/[feature-name]`
- Task branches: `feature/t[phase].[task]-[description]`
- Bugfix branches: `bugfix/[issue-description]`
- Release branches: `release/v[major].[minor].[patch]`
- Hotfix branches: `hotfix/[issue-description]`

## Pull Request Process

1. **Create Branch**: Create a new branch from `develop` (for features) or `main` (for hotfixes)
2. **Implement Changes**: Make your changes in the branch
3. **Write Tests**: Add tests for your changes
4. **Run Tests Locally**: Ensure all tests pass locally
5. **Create Pull Request**: Create a PR to merge your branch into `develop` (for features) or `main` (for hotfixes)
6. **Code Review**: Request review from at least two team members
7. **Address Feedback**: Make changes based on review feedback
8. **CI/CD Checks**: Ensure all CI/CD checks pass
9. **Merge**: Merge the PR into the target branch
10. **Delete Branch**: Delete the branch after merging

### Pull Request Template

```markdown
# Pull Request

## Description
[Describe the changes made in this PR]

## Related Issues
Closes #[issue number]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have added tests that prove my fix/feature works
- [ ] All tests pass locally
- [ ] I have updated the documentation accordingly
- [ ] I have added appropriate comments to my code

## Screenshots (if applicable)
[Add screenshots here]
```

## CI/CD Pipeline

ProductivityPro uses GitHub Actions for CI/CD:

### Workflows

1. **Build and Test**: Triggered on push to any branch and PRs to `main` or `develop`
2. **Documentation**: Triggered on push to `main` or `develop` that changes documentation files
3. **Release**: Triggered manually or on push to `release/*` branches
4. **Deployment**: Triggered on successful release workflow

### Build and Test Workflow

```yaml
name: Build and Test

on:
  push:
    branches: [ develop, feature/*, release/* ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      - name: Install dependencies
        run: |
          npm ci
          pip install -r requirements.txt
      - name: Run tests
        run: |
          npm test
          pytest
      - name: Build application
        run: npm run build
```

## Kanban Board Workflow

ProductivityPro uses a Kanban board with the following columns:

1. **To Do**: New tasks awaiting assignment
2. **In Progress**: Tasks currently being worked on
3. **Review**: Tasks in PR review or QA
4. **Done**: Completed and merged tasks

### Task Card Template

```markdown
## Task ID: [T1.1]

### Description
[Detailed task description]

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### Dependencies
- Task T1.2
- Task T1.3

### Estimate
16h

### Branch
`feature/t1.1-activity-tracker`

### Documentation
- [ ] Code documentation
- [ ] API documentation
- [ ] User documentation
```

## Release Process

1. **Create Release Branch**: Create a `release/v[version]` branch from `develop`
2. **Version Bump**: Update version numbers in package.json and other files
3. **Release Notes**: Create release notes documenting changes
4. **Final Testing**: Perform final testing on the release branch
5. **Create PR**: Create a PR to merge the release branch into `main`
6. **Review and Approve**: Get approval from team leads
7. **Merge to Main**: Merge the release branch into `main`
8. **Tag Release**: Create a git tag for the release
9. **Merge Back**: Merge `main` back into `develop`
10. **Deploy**: Deploy the release to production

## Hotfix Process

1. **Create Hotfix Branch**: Create a `hotfix/[description]` branch from `main`
2. **Implement Fix**: Make the necessary changes
3. **Version Bump**: Update version numbers (patch version)
4. **Create PR**: Create a PR to merge the hotfix branch into `main`
5. **Review and Approve**: Get approval from team leads
6. **Merge to Main**: Merge the hotfix branch into `main`
7. **Tag Release**: Create a git tag for the hotfix
8. **Merge Back**: Merge `main` back into `develop`
9. **Deploy**: Deploy the hotfix to production