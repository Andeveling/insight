---
trigger: always_on
---

General Guidelines

1. **Language**: English only.
2. **Types**: Declare explicit types; avoid `any`.
3. **Comments**: Use JSDoc for public methods and classes.
4. **Exports**: One export per file.
5. **Naming**:

   - **Classes/interfaces** → `PascalCase`
   - **Variables/functions** → `camelCase`
   - **Files/directories** → `kebab-case`
   - **Constants** → `UPPERCASE`
   - **Boolean flags** → verb-based (e.g., `isLoading`)

6. **Package Manager**: Use `bun` consistently.
7. **classNames**: If we need using conditional or merge styles never use literal templates, using `/lib/cn.ts` this util contain `cn` function.
8. **CSS Colors**: Not use colors elements example text-red-500, use `global.css` theme variables always.
9. UI always in Spanish and code commets in English

Folders
components: Reusable components shadcn and other providers
app: All project with sub folders follow rules nextjs 16
data: db local
docs: documentation
lib: utils and formaters