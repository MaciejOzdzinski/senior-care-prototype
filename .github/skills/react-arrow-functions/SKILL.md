---
name: react-arrow-functions
description: "Enforce and convert to arrow function syntax in React TypeScript. Use when: refactoring function declarations to arrow functions, reviewing code style, converting components or hooks from function keyword to const arrow syntax."
argument-hint: "Paste code or describe what to convert"
---

# React Arrow Functions

Convert **function declarations** to **arrow function expressions** in React TypeScript code.

## When to Use

- Refactoring existing code that uses `function` keyword
- Reviewing a file for style compliance
- Converting a batch of components/hooks to arrow syntax

## Procedure

1. Find all `function` declarations in the target file(s)
2. Convert each to a `const` arrow function expression:
   - `function Foo(props: P) { ... }` → `const Foo = (props: P) => { ... };`
   - `export default function Foo() { ... }` → `const Foo = () => { ... }; export default Foo;`
   - `function useFoo() { ... }` → `const useFoo = () => { ... };`
3. Preserve:
   - Generic type parameters: `function Foo<T>()` → `const Foo = <T,>() => { ... };` (trailing comma for TSX disambiguation)
   - `forwardRef` wrapping
   - Return types if explicitly annotated
4. Verify the file still compiles without errors

## Conversion Rules

| Before                                   | After                                                   |
| ---------------------------------------- | ------------------------------------------------------- |
| `function Component(props: P) {}`        | `const Component = (props: P) => {};`                   |
| `export function Component() {}`         | `export const Component = () => {};`                    |
| `export default function Component() {}` | `const Component = () => {}; export default Component;` |
| `function useHook() {}`                  | `const useHook = () => {};`                             |
| `function handler(e: Event) {}`          | `const handler = (e: Event) => {};`                     |
| `function identity<T>(x: T) {}`          | `const identity = <T,>(x: T) => {};`                    |

## Notes

- Prefer named exports (`export const`) over default exports
- Implicit return is fine for single-expression JSX: `const Icon = () => <svg />;`
- Props interfaces should be defined directly above the component
