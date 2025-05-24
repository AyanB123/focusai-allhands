# Task Tracking

This document outlines the task tracking system for ProductivityPro, including GitHub Projects configuration, issue templates, and workflow.

## GitHub Projects Configuration

ProductivityPro uses GitHub Projects for task tracking with a Kanban board approach.

### Board Structure

1. **To Do**: New tasks awaiting assignment
2. **In Progress**: Tasks currently being worked on
3. **Review**: Tasks in PR review or QA
4. **Done**: Completed and merged tasks

### Task Categories

Tasks are categorized using labels:

- **Frontend** (blue): Dashboard, Analytics, Scheduler, etc.
- **Backend** (green): Activity Tracker, Event Processor, etc.
- **AI/ML** (purple): Transformer, GNN, LSTM, CNN, GAN
- **DevOps** (yellow): CI/CD, Testing, Documentation, etc.

### Priority Labels

- **Priority: High** (red)
- **Priority: Medium** (orange)
- **Priority: Low** (gray)

### Phase Labels

- **Phase 1** (green)
- **Phase 2** (blue)
- **Phase 3** (purple)
- **Phase 4** (orange)

## Task Creation Process

1. **Create Issue**: Use the Task issue template
2. **Add Labels**: Add appropriate category, priority, and phase labels
3. **Assign to Project**: Add the issue to the ProductivityPro Development project
4. **Set Status**: Set the status to "To Do"

## Task Workflow

1. **Assignment**: Developer assigns themselves to a task
2. **Status Update**: Move the task to "In Progress"
3. **Branch Creation**: Create a branch following the naming convention `feature/t[phase].[task]-[description]`
4. **Implementation**: Implement the task
5. **Pull Request**: Create a PR and link it to the task
6. **Status Update**: Move the task to "Review"
7. **Code Review**: Get at least two approvals
8. **Merge**: Merge the PR
9. **Status Update**: Move the task to "Done"

## Task Template

```markdown
# Task

## Task ID
[e.g., T1.1]

## Description
[Detailed task description]

## Component
[e.g., Dashboard, Activity Tracker]

## Phase
[e.g., Phase 1: Core Tracking]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Dependencies
- Task [T1.2]
- Task [T1.3]

## Estimate
[e.g., 16h]

## Branch
[e.g., `feature/t1.1-activity-tracker`]

## Documentation
- [ ] Code documentation
- [ ] API documentation
- [ ] User documentation
```

## GitHub Projects Views

### Main Kanban View

- **Group by**: Status
- **Sort by**: Priority, then Task ID

### Phase View

- **Group by**: Phase
- **Sort by**: Task ID

### Component View

- **Group by**: Component
- **Sort by**: Task ID

### Developer View

- **Group by**: Assignee
- **Sort by**: Status, then Priority

## Automation Rules

### Status Automation

- When an issue is assigned, move to "In Progress"
- When a PR is opened and linked to an issue, move to "Review"
- When a PR is merged and closes an issue, move to "Done"

### Label Automation

- Issues with "bug" label get "Priority: High" by default
- Issues with "documentation" label get "Priority: Low" by default
- PRs with failing checks get "needs-attention" label

## Reporting

### Burndown Chart

- Track progress through each phase
- X-axis: Time (days/weeks)
- Y-axis: Remaining story points

### Velocity Chart

- Track team velocity over time
- X-axis: Sprints/weeks
- Y-axis: Completed story points

### Cumulative Flow Diagram

- Track work in each status over time
- X-axis: Time (days/weeks)
- Y-axis: Number of issues in each status

## Integration with Development Workflow

The task tracking system is integrated with the development workflow:

1. **Planning**: Tasks are created and prioritized
2. **Development**: Tasks are assigned and implemented
3. **Review**: Tasks are reviewed and tested
4. **Deployment**: Tasks are deployed to production

This ensures a smooth flow from task creation to deployment, with clear visibility into the status of each task and the overall project progress.