### **`kajoo-2.0-guidelines.md`**


# Kajoo 2.0 Development Guidelines  
*A unified standard for clean architecture, reusable component design, scalable React/Next.js patterns, and strict design-system adherence.*


# 1. General Code Guidelines

## 1.1 Clean Code Principles
- **Single Responsibility Principle**: Each component, hook, or module must have exactly one purpose.
- **DRY (Don’t Repeat Yourself)**: No duplicated JSX, logic, or styling. Extract into:
  - Shared components
  - Hooks
  - Utils
  - Constants
- **Prefer Composition Over Inheritance**: Build components by composing primitives rather than creating large, complex components.
- **Extract Hardcoded Values**: Move strings, numbers, config, and static data into `/constants/` or `/config/`.
- **Strict Type Safety**: Every component must define TypeScript types/interfaces. Avoid `any`.

## 1.2 React + Next.js Best Practices
- Use **function components + hooks only**.
- Use **React Server Components (RSC)** where appropriate for static and async data.
- Move business logic out of components:
  - Use custom hooks
  - Use `/lib` services
  - Use utilities
- Use correct dependency arrays in hooks.
- Avoid unnecessary state by deriving UI values wherever possible.

## 1.3 Import & File Hygiene
- Remove unused imports and unused variables.
- Import order:
  1. React
  2. Third-party libraries
  3. Project modules (components/hooks/utils)
  4. Styles
- Use absolute imports (`@/...`).


# 2. Component System & Architecture

## 2.1 Centralized Component Library
All reusable UI components **must live in**:



src/components/



No component duplication is allowed anywhere else in the project.

## 2.2 Component Creation Rules
Before creating a component:
1. Search for an existing component.
2. If similar exists → **extend it**, **parameterize it**, or **compose it**.
3. Avoid creating one-off UI elements unless absolutely required.

Component variations must be handled through:
- Props
- Composition
- Wrapper components
- Tailwind utility overrides

## 2.3 Component Categorization (Atomic Design)
Recommended structure:



components/
ui/          → atoms (buttons, inputs, form elements)
layout/      → molecules (grid systems, containers)
modules/     → organisms (cards, forms, feature blocks)
composite/   → templates and screen-level components

## 2.4 shadcn/ui Integration
- Always rely on **shadcn/ui** primitives before building custom ones.
- Customizations should happen via small wrapper components inside `components/ui/`.
- Never create duplicate button/input/alert variations outside the shared library.



# 3. Project Structure Standards

Project structure must follow:



src/
app/ or pages/
components/
features/
hooks/
lib/
utils/
constants/
types/



### 3.1 Feature Folders
Each domain feature should contain its own:
- Components  
- Hooks  
- Services  
- Types  

Example:

features/
authentication/
components/
hooks/
services/
types.ts


# 4. Styling & Design System Standards

## 4.1 Typography
- Use semantic HTML (`h1`, `h2`, `p`, etc.).
- Avoid Tailwind font classes except when overriding.
- Follow global typographic scale.

## 4.2 Colors & Theming
- Brand primary colors:
  - Light mode: `#5F55EE`
  - Dark mode: `#7B73F0`
- Use **CSS variables** (e.g., `--color-primary`).
- No hardcoded hex values in components.
- Support dark mode using theme classes or data-theme attributes.

## 4.3 Layout & Spacing
- Use an 8px spacing system.
- Prefer Flexbox or Grid for layout.
- Avoid absolute positioning unless necessary.
- Maintain consistent padding, margin, and gap conventions.



# 5. Performance & Maintainability

## 5.1 Performance Rules
- Use `React.memo` for expensive re-rendering components.
- Use `useMemo` and `useCallback` when beneficial.
- Lazy load heavy logic or non-critical sections.
- Keep bundle size minimal by avoiding unnecessary libraries.

## 5.2 Error Handling
- All components must implement loading, empty, and error states.
- Use error boundaries for critical UI areas.
- Use a unified logging and error-reporting strategy.



# 6. State Management Guidelines

- Prefer **local state** for isolated UI concerns.
- Extract any multi-step logic into a custom hook.
- Avoid unnecessary global state.
- Use Context or Zustand sparingly and only when state is shared widely.
- Avoid prop drilling beyond 3 levels—use composition or context.



# 7. Code Quality Standards

## 7.1 Functions & Methods
- Keep functions small and single-purpose.
- Use meaningful names for variables, functions, and components.
- Avoid nested logic (> 3 levels).
- Use early returns to reduce cognitive load.
- Keep JSX minimal—extract logic into helpers.

## 7.2 Comments & Documentation
- Prefer self-documenting code through naming.
- Comment only when logic is complex or non-obvious.
- Document component props using TypeScript interfaces.
- Add JSDoc where meaningful.



# 8. Testing Guidelines

- Components must be testable and predictable.
- Separate business logic from UI for easier testing.
- Use dependency injection for external APIs/services.
- Prefer testing:
  - Hooks (logic)
  - Component behavior
  - Integration flows



# 9. Required Output for Any Figma Make Refactor

Every time Figma Make refactors or modifies the codebase, it must output:

### ✔ 9.1 Component Map  
A breakdown of all components, their purpose, and where they’re used.

### ✔ 9.2 Explanation of Major Refactors  
What was:
- Consolidated  
- Renamed  
- Extracted  
- Replaced  
- Removed  

### ✔ 9.3 Architecture Consistency Check  
Verification that:
- No components are duplicated  
- All design-system rules are followed  
- All imports, naming, and structure follow Kajoo 2.0 standards  

---

# End of File
