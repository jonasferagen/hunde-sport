---
trigger: always_on
---

# Hundesport — Code Style Guide

*Last updated: 2025‑08‑20*

## Philosophy

* **Clarity over cleverness.** Prefer readable, explicit code.
* **Consistency beats preference.** If it’s in this guide, follow it.
* **Mobile-first UX.** Fast startup, smooth navigation, consistent typography.

---

## Tech Stack

* **Runtime:** React Native (Expo SDK 53), Expo Router.
* **Language:** TypeScript (strict-ish).
* **UI:** Tamagui.
* **State:** Zustand for local state; TanStack Query v5 for server state.
* **Networking:** apisauce.

---

## File & Folder Conventions

* **App entry:** `index.ts` imports `'react-native-gesture-handler'` first, then router entry.
* **Routes:** `app/` uses Expo Router; group routes in folders like `app/(app)/...`.
* **Components:** Reusable UI in `components/` (co-locate styles with components).
* **Screens:** Screen-level containers in `screens/` (if used alongside router).
* **State:** Stores in `stores/` (one file per store, light selectors).
* **Hooks:** `hooks/` for React hooks (prefix `use...`).
* **Domain:** Pure/domain logic in `domain/`.
* **Config:** Build/runtime config in `config/`.
* **Assets:** `assets/images`, `assets/fonts` (TTFs only for installed faces).
* **Aliases:** Use `@` as project root alias.

---

## Imports & Module Resolution

* Use absolute imports from root via `@/...`.

---

## Components

* **Default:** Arrow components.
* **Top‑level providers / root layout:** `function` declarations (hoisting + nicer inference).
* Use named exports for reusable components (avoid default exports in shared code).
* Props interfaces: `FooProps` (no `I` prefix).
* Children prop typed as `React.ReactNode`.

```tsx
// Arrow component (default)
export const Card: React.FC<CardProps> = ({ children, ...props }) => {
  return <YStack {...props}>{children}</YStack>;
};

// Top-level provider (function)
export function AppTamaguiProvider({ children, ...props }: TamaguiProviderProps) {
  return (
    <OGProvider {...props}>
      <PortalProvider shouldAddRootHost>{children}</PortalProvider>
    </OGProvider>
  );
}
```

### Hooks

* One hook per file, `useThing.ts`.
* Hooks may import stores, never the other way around.

### Screens

* Keep screens thin: orchestrate hooks, pass data to presentational components.

---

## TypeScript

* Enable type‑safety; prefer explicit return types for public functions.
* Use discriminated unions for status where helpful.
* Avoid `any`. If unavoidable, fence it: `// eslint-disable-next-line @typescript-eslint/no-explicit-any`.
* Add `declarations.d.ts` for image modules:



## Navigation (Expo Router)

* Root layout in `app/_layout.tsx` wraps providers (QueryClientProvider, GestureHandlerRootView, Tamagui, Toasts, Portals).
* Hide headers globally; provide per‑screen as needed.
* Deep link scheme: `hundesport`.

---


## State Management

* **Zustand:** colocate store in `stores/`. Keep minimal state and selectors.
* **TanStack Query v5:** for server state; infinite queries for lists. Use `enabled: false` if sequencing in Preloader.

---

## Networking

* apisauce client in `lib/api.ts`. Single base URL from env.
* Wrap calls in lightweight service functions; avoid sprinkling `api.get` across UI.

---


## Logging

* Use `react-native-logs` for app logs.
* Strip `console.*` in **production only** with `transform-remove-console` (keep `warn`, `error`).

---


## Android/iOS Identifiers

* **Android package:** `com.anonymous.hundesport` (prod), `com.anonymous.hundesport.dev` (dev). Immutable after store release.
* **iOS bundleIdentifier:** mirror the above pre‑store.
* **Scheme:** `hundesport` (avoid dots).

---

## Git & Secrets

* `.gitignore`: `dist/`, `.env*`, `credentials/`, `android-keys/`, `credentials.json`.
* Back up keystores and passwords in a secure manager.

---

## Code Style (ESLint/Prettier)

* Use `eslint-config-expo` base; fix on save.
* 2‑space indent, semicolons on, single quotes.
* Trailing commas where valid (multi-line), object shorthand, no var.
* Prefer `const`; limit `let` to mutations.

---

## Patterns to Prefer

* **Presentational vs container**: keep screens light, components dumb.
* **Derived state over duplicates**: compute from source where possible.
* **Small PRs**: one theme per change (feature/bug/perf).

---

## Patterns to Avoid

* Business logic in components (push to hooks/services).
* Global mutable singletons (other than Zustand stores).
* Over‑using context when a hook + store works.

---


**Preloader loop for all pages (Query v5)**

```ts
await q.refetch();
while (q.hasNextPage) { await q.fetchNextPage(); }
setCategoriesInStore(q.items ?? []);
```


---

## Review & Maintenance

* Revisit this guide when upgrading Expo SDK or changing architectural choices.
* PRs that change patterns should update this document.
