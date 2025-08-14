# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application called "Deca Pal" - an educational platform for DECA (Distributive Education Clubs of America) students. It provides performance indicators and practice tests across various business categories.

## 📚 Comprehensive Documentation

For detailed documentation on various aspects of the project, please refer to the `/docs` directory:

- **[/docs/README.md](./docs/README.md)** - Documentation overview and navigation guide
- **[/docs/architecture.md](./docs/architecture.md)** - System design, technical stack, and infrastructure details
- **[/docs/spec.md](./docs/spec.md)** - Product specifications, features, and business model
- **[/docs/userflow.md](./docs/userflow.md)** - User journeys, personas, and engagement mechanics
- **[/docs/tasks.md](./docs/tasks.md)** - Development roadmap, priorities, and resource allocation
- **[/docs/changes.md](./docs/changes.md)** - Release history, version tracking, and deployment procedures

## Key Commands

```bash
# Development
npm run dev          # Start development server on http://localhost:3000

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run Next.js linting
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript 5.7.2 with strict mode
- **UI**: React 19.1.0 + Tailwind CSS
- **Auth**: Firebase Authentication + Admin SDK
- **Icons**: Lucide React

### Project Structure

```
/app                    # Next.js App Router directory
  /api                  # API routes
    /auth               # Authentication endpoints (session, logout)
  /components           # Shared UI components
  /context              # React contexts (AuthContext)
  /firebase             # Firebase configuration
    config.ts           # Client-side Firebase
    admin.ts            # Server-side Firebase Admin
  /config               # App configuration
    allowedEmails.ts    # Email whitelist
  /performance          # Performance indicators section
  /test                 # Testing/quiz section
  /login, /signup       # Auth pages
  layout.tsx            # Root layout with providers
  middleware.ts         # Auth middleware for route protection
```

### Key Architectural Patterns

1. **Authentication Flow**
   - Firebase Auth for client-side authentication
   - Session cookies managed via `/api/auth/session`
   - Middleware protects authenticated routes
   - Email whitelist in `/app/config/allowedEmails.ts`

2. **Content Organization**
   - Performance indicators stored in `/app/performanceIndicators.tsx`
   - Quiz questions in `/app/questions.tsx`
   - Categories: MANAGEMENT, MARKETING, FINANCE, HOSPITALITY, ENTREPRENEURSHIP
   - Note: There's a typo in types.ts - "MANAGMENT" should be "MANAGEMENT"

3. **Routing Structure**
   - Dynamic routes: `/performance/[category]/[ia]/page.tsx`
   - Search functionality: `/performance/search/page.tsx`
   - Test sections by category: `/test/[category]/page.tsx`

4. **State Management**
   - AuthContext provides user state across the app
   - No global state management library - relies on React context

### Development Notes

- Next.js configured for standalone output (optimized for containerization)
- Custom webpack config for code splitting and optimization
- No test suite currently configured
- Minimal README.md - this CLAUDE.md serves as primary documentation

### Common Tasks

When working on performance indicators or questions:
- Data structures are defined in `/app/types.ts`
- Performance indicators database: `/app/performanceIndicators.tsx`
- Questions database: `/app/questions.tsx`

When modifying authentication:
- Client auth logic: `/app/context/AuthContext.tsx`
- Server session handling: `/app/api/auth/session/route.ts`
- Protected route middleware: `/middleware.ts`
- Never try to run the code