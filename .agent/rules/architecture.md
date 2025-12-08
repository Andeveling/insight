---
trigger: always_on
---

Architecture Instructions

## NextJS 16 Feature First Architecture with App Router and Server Actions

1. **App Directory**: Use the `app/` directory for all application code, leveraging its support for server components, layouts, and routing.
2. **Feature-Based Structure**: Organize code by feature or domain rather than by type. Each feature folder should contain its own components, styles, and tests. For example:
   ```
   app/
   ├── dashboard/
   │   ├── _components/
   │   ├── _hooks/
   │   ├── _actions/
   │   ├── _utils/
   │   ├── _schemas/
   │   └── page.tsx
   ├── profile/
   │   ├── _components/
   │   ├── _hooks/
   │   ├── _utils/
   │   └── page.tsx
   ```
3. **Server and Client Components**: Default to server components for better performance. Use the `"use client"` directive only when necessary for interactivity.