---
applyTo: "**/*.{ts,tsx}"
description: "Enforce arrow function syntax in React TypeScript files. Use when: writing components, hooks, handlers, or utility functions in .ts/.tsx files."
---

# Arrow Functions Only

Always use **arrow function expressions** (`const`) instead of **function declarations** in React TypeScript code.

## Applies To

- React components
- Custom hooks
- Event handlers and callbacks
- Helper / utility functions inside component files

## Correct

```tsx
// Component
export const ProfileCard = ({ name }: ProfileCardProps) => {
  return <div>{name}</div>;
};

// Custom hook
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  return { user };
};

// Handler
const handleClick = (e: React.MouseEvent) => {
  e.preventDefault();
};

// forwardRef
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input ref={ref} {...props} />;
});

// Simple implicit return
const Icon = () => <svg />;
```

## Incorrect

```tsx
function ProfileCard({ name }: ProfileCardProps) { ... }
function useAuth() { ... }
function handleClick(e: React.MouseEvent) { ... }
export default function App() { ... }
```

## Notes

- Prefer named exports (`export const`) over default exports.
- Props interface defined directly above the component.
- Implicit return is fine for single-expression JSX.
