# Coding Standards

This document outlines the coding standards and best practices for the ProductivityPro project. Following these standards ensures code consistency, maintainability, and quality across the codebase.

## General Guidelines

### Code Formatting

- Use consistent indentation (2 spaces for JavaScript/TypeScript, 4 spaces for Python)
- Limit line length to 100 characters
- Use meaningful variable and function names
- Follow the principle of "clean code" - code should be readable and self-explanatory
- Use ESLint, Prettier, and Black for automated formatting

### Comments and Documentation

- Write self-documenting code with clear variable and function names
- Add comments for complex logic that isn't immediately obvious
- Document public APIs with JSDoc (JavaScript) or docstrings (Python)
- Keep comments up-to-date with code changes
- Use TODO, FIXME, and NOTE comments for temporary markers, but address them promptly

### Error Handling

- Use try-catch blocks for error-prone operations
- Provide meaningful error messages
- Log errors with appropriate severity levels
- Handle edge cases explicitly
- Avoid swallowing exceptions without proper handling

### Testing

- Write unit tests for all new code
- Maintain test coverage above 80%
- Test edge cases and error conditions
- Use meaningful test descriptions
- Follow the AAA pattern (Arrange, Act, Assert)

## Frontend Standards (JavaScript/TypeScript)

### React Components

- Use functional components with hooks instead of class components
- Keep components small and focused on a single responsibility
- Use TypeScript interfaces for props and state
- Implement proper prop validation
- Follow the container/presentational component pattern

Example:

```tsx
// Good example
import React, { useState, useEffect } from 'react';

interface UserProfileProps {
  userId: string;
  showDetails: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, showDetails }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const userData = await api.getUser(userId);
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  if (loading) return <Spinner />;
  if (!user) return <ErrorMessage message="User not found" />;

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      {showDetails && (
        <div className="user-details">
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
```

### State Management

- Use React Context API for global state when appropriate
- Consider Redux for complex state management
- Keep state as local as possible
- Use immutable state updates
- Separate UI state from application state

### Styling

- Use CSS modules or styled-components for component styling
- Follow BEM naming convention for CSS classes
- Use variables for colors, spacing, and typography
- Ensure responsive design for all components
- Implement dark mode support

### Performance

- Use React.memo for expensive components
- Implement virtualization for long lists
- Optimize re-renders with useCallback and useMemo
- Use code splitting with React.lazy and Suspense
- Monitor and optimize bundle size

## Backend Standards (Node.js)

### API Design

- Follow RESTful principles
- Use consistent URL patterns
- Implement proper HTTP status codes
- Version APIs appropriately
- Document APIs with OpenAPI/Swagger

### Express.js Structure

- Organize routes by resource
- Use middleware for cross-cutting concerns
- Implement proper error handling middleware
- Validate request inputs
- Use async/await with proper error handling

Example:

```javascript
// Good example
const express = require('express');
const { body, validationResult } = require('express-validator');
const UserService = require('../services/userService');

const router = express.Router();

// Create a new user
router.post(
  '/',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('name').notEmpty().withMessage('Name is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  async (req, res, next) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Create user
      const user = await UserService.createUser(req.body);
      return res.status(201).json(user);
    } catch (error) {
      if (error.code === 'DUPLICATE_EMAIL') {
        return res.status(409).json({ message: 'Email already in use' });
      }
      next(error);
    }
  }
);

module.exports = router;
```

### Database Access

- Use an ORM or query builder
- Implement database migrations
- Use transactions for multi-step operations
- Optimize queries for performance
- Implement proper indexing

### Security

- Sanitize user inputs
- Implement proper authentication and authorization
- Use HTTPS for all communications
- Store passwords with bcrypt or Argon2
- Implement rate limiting for sensitive endpoints

## AI/ML Standards (Python)

### Code Organization

- Follow PEP 8 style guide
- Use type hints
- Organize code into modules and packages
- Use classes for complex functionality
- Implement proper logging

Example:

```python
# Good example
import logging
from typing import List, Optional, Dict, Any
import numpy as np
from sklearn.base import BaseEstimator

logger = logging.getLogger(__name__)

class ActivityClassifier(BaseEstimator):
    """Classifier for user activities based on application usage patterns."""
    
    def __init__(self, feature_extractor: Optional[Dict[str, Any]] = None):
        """Initialize the activity classifier.
        
        Args:
            feature_extractor: Configuration for feature extraction
        """
        self.feature_extractor = feature_extractor or {}
        self.model = None
        logger.info("Initialized ActivityClassifier")
    
    def fit(self, X: np.ndarray, y: np.ndarray) -> 'ActivityClassifier':
        """Train the classifier on activity data.
        
        Args:
            X: Feature matrix of shape (n_samples, n_features)
            y: Target labels of shape (n_samples,)
            
        Returns:
            self: The trained classifier
        """
        logger.info(f"Training classifier on {X.shape[0]} samples")
        # Implementation details...
        return self
    
    def predict(self, X: np.ndarray) -> np.ndarray:
        """Predict activity labels for new data.
        
        Args:
            X: Feature matrix of shape (n_samples, n_features)
            
        Returns:
            np.ndarray: Predicted labels of shape (n_samples,)
        """
        if self.model is None:
            raise ValueError("Model not trained. Call fit() first.")
        
        logger.info(f"Predicting labels for {X.shape[0]} samples")
        # Implementation details...
        return predictions
```

### Model Development

- Document model architecture and hyperparameters
- Implement reproducible training pipelines
- Version control datasets and models
- Implement proper evaluation metrics
- Use TensorFlow or PyTorch for deep learning

### API Integration

- Use FastAPI for model serving
- Implement proper input validation
- Document API endpoints
- Implement proper error handling
- Optimize for inference performance

## DevOps Standards

### Docker

- Use multi-stage builds for smaller images
- Specify exact versions for base images
- Don't run containers as root
- Use .dockerignore to exclude unnecessary files
- Implement health checks

### CI/CD

- Automate testing for all pull requests
- Implement linting and code quality checks
- Use semantic versioning for releases
- Automate deployment processes
- Implement proper environment separation

### Monitoring

- Log meaningful events
- Use structured logging
- Implement application metrics
- Set up alerting for critical issues
- Monitor system resources

## Version Control

### Git Workflow

- Follow the [Git workflow](git-workflow.md) document
- Write meaningful commit messages
- Keep commits focused and atomic
- Use feature branches for all changes
- Require code reviews for all pull requests

### Commit Messages

Follow the conventional commits format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- feat: A new feature
- fix: A bug fix
- docs: Documentation changes
- style: Code style changes (formatting, etc.)
- refactor: Code changes that neither fix bugs nor add features
- perf: Performance improvements
- test: Adding or fixing tests
- chore: Changes to the build process or auxiliary tools

Example:

```
feat(analytics): implement focus score calculation

- Add time-weighted scoring algorithm
- Integrate with activity tracking
- Add unit tests for edge cases

Closes #123
```

## Compliance

### Accessibility

- Follow WCAG 2.1 AA standards
- Implement proper semantic HTML
- Ensure keyboard navigation
- Provide alternative text for images
- Test with screen readers

### Privacy

- Minimize data collection
- Implement proper data anonymization
- Follow GDPR and CCPA requirements
- Document data retention policies
- Implement proper consent mechanisms

## Code Review Checklist

When reviewing code, check for:

- Adherence to coding standards
- Proper error handling
- Adequate test coverage
- Performance considerations
- Security vulnerabilities
- Documentation completeness
- Accessibility compliance

## Conclusion

Following these coding standards will help maintain a high-quality, maintainable codebase for ProductivityPro. These standards will evolve over time, and feedback is welcome to improve them.