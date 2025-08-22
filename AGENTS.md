# AGENTS.md

This file provides essential information for AI agents working with the Deca Pal codebase.

## Build, Lint, and Test Commands

### Development
```bash
npm run dev          # Start development server on http://localhost:3000
```

### Production
```bash
npm run build        # Build for production
npm start            # Start production server
```

### Code Quality
```bash
npm run lint         # Run Next.js linting
```

### Testing
```bash
# Install Jest types if needed
npm install --save-dev @types/jest

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run a specific test file
npm test -- app/utils/__tests__/clientIdentification.test.ts

# Run tests with coverage
npm test -- --coverage
```

**Note**: Tests use Jest framework but may need `@types/jest` installed for TypeScript support.

## Code Style Guidelines

### TypeScript Configuration
- **Strict mode**: Enabled with full type checking
- **Target**: ES5 with modern lib support (DOM, DOM.iterable, ESNext)
- **Module resolution**: Bundler with ESNext modules
- **JSX**: Preserve mode for Next.js compatibility

### Import Organization
```typescript
// 1. React imports first
import React, { useState, useEffect } from 'react'

// 2. Next.js imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// 3. Third-party libraries (alphabetical)
import { UserCircle, Menu } from 'lucide-react'
import { auth } from 'firebase/app'

// 4. Local imports (relative paths)
import { useAuth } from '../context/AuthContext'
import { Datashape } from '../types'
```

### Naming Conventions
- **Components**: PascalCase (`Header`, `Navigation`)
- **Functions/Methods**: camelCase (`getClientIdentifier`, `handleLogout`)
- **Variables**: camelCase (`userData`, `isMenuOpen`)
- **Interfaces**: PascalCase (`Datashape`, `DECAEvent`)
- **Types**: PascalCase (`ScoringCriteria`, `VideoSession`)
- **Constants**: SCREAMING_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **Files**: kebab-case for components (`header.tsx`), camelCase for utilities (`clientIdentification.ts`)

### Component Structure
```typescript
'use client'  // Add for client components

import { useState } from 'react'

interface Props {
  title: string
  onClick?: () => void
}

export default function MyComponent({ title, onClick }: Props) {
  const [state, setState] = useState(false)

  // Event handlers
  const handleClick = () => {
    // Implementation
  }

  return (
    <div>
      {/* JSX content */}
    </div>
  )
}
```

### Error Handling
```typescript
// Async operations
const handleAsyncOperation = async () => {
  try {
    const result = await someAsyncFunction()
    return result
  } catch (error) {
    console.error('Operation failed:', error)
    // Handle error appropriately
    throw error
  }
}

// Event handlers
const handleUserAction = () => {
  try {
    // Implementation
  } catch (error) {
    console.error('User action failed:', error)
    // Show user-friendly error message
  }
}
```

### Type Definitions
```typescript
// Interface for objects
export interface User {
  id: string
  email: string
  name?: string
  createdAt: Date
}

// Union types for specific values
export type Category =
  | "MANAGEMENT"
  | "MARKETING"
  | "FINANCE"
  | "HOSPITALITY"
  | "ENTREPRENEURSHIP"

// Generic types
export interface ApiResponse<T> {
  data: T
  error?: string
  success: boolean
}
```

### Comments and Documentation
```typescript
// Use JSDoc for complex functions
/**
 * Generates a client identifier from request headers
 * @param request - Next.js request object
 * @returns Client identifier string
 */
export function getClientIdentifier(request: NextRequest): string {
  // Implementation with inline comments for complex logic
}

// Explain business logic and non-obvious decisions
// This approach prioritizes performance over type safety for hot paths
```

### Testing Patterns
```typescript
// Use describe blocks to group related tests
describe('getClientIdentifier', () => {
  test('should extract IP from cf-connecting-ip header', () => {
    // Test implementation
  })

  test('should handle missing headers gracefully', () => {
    // Test implementation
  })
})

// Mock external dependencies
function createMockRequest(headers: Record<string, string> = {}): NextRequest {
  // Mock implementation
}
```

### Performance Considerations
- Use React.memo for expensive components
- Implement proper loading states
- Optimize bundle splitting (configured in next.config.js)
- Use proper TypeScript types to catch errors at compile time

### Security Best Practices
- Never commit secrets or API keys
- Validate user input on both client and server
- Use Firebase Admin SDK for server-side operations
- Implement rate limiting for API endpoints
- Mask sensitive data in logs (use maskIdentifier utility)

### File Organization
```
/app                    # Next.js App Router
  /api                  # API routes
  /components           # Reusable UI components
  /context              # React contexts
  /firebase             # Firebase configuration
  /utils                # Utility functions and helpers
  /types.ts             # TypeScript type definitions
```

### Git Workflow
- Follow conventional commit messages
- Create feature branches for new work
- Write tests for new functionality
- Run lint and build before committing
- Never commit directly to main branch

## Architecture Notes

### Tech Stack
- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript 5.7.2 (strict mode)
- **UI**: React 19.1.0 + Tailwind CSS
- **Auth**: Firebase Authentication + Admin SDK
- **Database**: Firebase (for auth and potentially data)
- **Icons**: Lucide React

### Key Patterns
- Server and client component separation
- Firebase authentication with session management
- Context providers for global state
- API routes for server-side functionality
- Dynamic routing for category-based pages

### Environment Setup
- Requires Node.js >= 20.0.0
- Firebase configuration needed
- Environment variables for secrets
- Standalone output for containerization

## Common Issues and Fixes

### Testing Setup
If you encounter TypeScript errors in test files:
```bash
npm install --save-dev @types/jest
```

### Unused Imports
Remove unused imports to keep code clean:
```typescript
// Remove unused imports like UserCircle, LogOut from lucide-react
import { Menu, X, Moon, Sun } from 'lucide-react'
```

### Type Safety
- Always define proper TypeScript interfaces for data structures
- Use union types for specific value sets (like categories)
- Avoid `any` type - use proper typing instead

### Performance
- Bundle splitting is configured in `next.config.js`
- Use `React.memo` for expensive components
- Implement proper loading states for async operations

### Code Quality
- Run `npm run lint` before committing
- Fix any TypeScript strict mode errors
- Follow the established naming conventions
- Add comments for complex business logic