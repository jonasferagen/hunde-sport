---
trigger: always_on
---

# Windsurf Rules

## General
- The application is a **React Native app using Expo**.
- Use **TypeScript** for all files (`.tsx`, `.ts`) and type all props and return values explicitly.
- All components must be **functional components** using arrow function syntax.
- Follow **React Native styling conventions** and use `StyleSheet.create()` for styles.
- Use **absolute imports** (e.g. `@/components/Button` instead of `../../../components/Button`).

## File Structure
- Organize components under `/components/[type]/[ComponentName].tsx`
  - Example: `components/ui/Loader.tsx`
- Each screen should reside in `/screens/[Module]/[ScreenName].tsx`
- Keep hooks in `/hooks` and prefix with `use` (e.g., `useTheme`, `useCart`)
- Shared styles should go in `/styles/` and follow `PascalCase` file names.

## Components
- Components must:
  - Accept props via an explicit interface.
  - Use `React.FC<Props>` only if children are needed, otherwise prefer:  
    ```tsx
    interface MyProps {}
    const MyComponent = (props: MyProps): JSX.Element => { ... }
    ```
  - Remove unused styles
 
### Example Component Structure:
```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ExampleProps {
  title: string;
}

export const Example = ({ title }: ExampleProps): JSX.Element => {
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </V