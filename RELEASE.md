# 📦 Hunde-sport – Google Play Release Checklist

This checklist standardizes our Android release process for the Play Store (Expo + EAS).

---

## 0) Prerequisites

- Logged into Expo CLI and EAS (`npx expo whoami`, `npx eas whoami`).
- Play Console access and signing is set up (EAS-managed signing recommended).
- `.env`/secrets configured for production.

---

## 1) Code & Quality

```sh
npm ci
npm run verify   # typecheck + lint + dead code prune + tests
```

Manual QA (smoke tests):

- Product list/grid renders, images load.
- Variable products: attribute selection, price range, stock states.
- Add to cart → view cart → checkout link/deep link.
- Network offline/online transitions.
- Error surfaces + Sentry receives errors.

---

## 2) Versioning

- `package.json` → bump `version` (semantic versioning).
- `app.json`/`app.config.ts` → bump **android.versionCode** (must **always increase**) and **version**/`versionName`.
- Confirm package ID for **production**: `com.anonymous.hundesport`.

---

## 3) Assets & Metadata

- App icon, adaptive icon, splash verified.
- Play Store listing updated: title, short/long description (NO dev flags), screenshots, feature graphic, content rating.

---

## 4) Build (Android App Bundle)

**Cloud build (recommended):**

```sh
eas build -p android --profile production
```

**Local build (optional):**

```sh
eas build -p android --profile production --local
```

Artifacts: download the `.aab` from EAS (or from local output).

Device sanity check (install a universal APK if needed):

```sh
# If generating an APK for testing only
eas build -p android --profile preview
```

---

## 5) OTA Updates (Expo Updates)

- Ensure the app is configured to use the **production** branch.
- Publish the matching update (if applicable):

```sh
eas update --branch production --platform android --message "Release vX.Y.Z"
```

> Note: OTA updates **do not** replace the Play Store binary. Use `.aab` for new native code or config changes.

---

## 6) Play Console Submission

1. Play Console → **Production** → **Create new release**.
2. Upload `.aab`.
3. Add release notes (mirror the EAS update message when relevant).
4. Start a **staged rollout** (e.g., 10–20%).
5. Resolve any pre-launch report warnings (crashes/ANRs).

---

## 7) Post-Release Monitoring

- Sentry crashes/ANRs, performance, and user sessions.
- In-app update flow works (optional).
- User reviews & support channels.
- Gradually increase rollout to 100% when stable.

---

## 8) Rollback / Hotfix

- **Small JS-only fix:**

```sh
eas update --branch production --platform android --message "Hotfix: <summary>"
```

- **Native or config change:** bump versions, new `.aab`, submit new release, and halt current rollout.

---

## 9) Troubleshooting

**“No compatible builds found…” after `eas update`:**

- OTA updates require a previously installed binary with the same `runtimeVersion`. Ship a `.aab` first when the runtime changes.

**Install fails on device:**

- Ensure `versionCode` increased. Clear old dev builds with conflicting package IDs.

**Assets missing after update:**

- Rebuild with `expo prebuild` if native asset pipeline changed; otherwise republish OTA.

---

## 10) Quick Commands Reference

```sh
# Verify
npm run verify

# Build AAB (cloud)
eas build -p android --profile production

# Publish OTA (JS-only)
eas update --branch production --platform android --message "Release vX.Y.Z"

# Preview build (APK for testing)
eas build -p android --profile preview
```

---

## 11) Release Sign-off

- [ ] Version bumped (package + android.versionCode/Name)
- [ ] `.aab` built and uploaded
- [ ] Release notes added
- [ ] Staged rollout started (10–20%)
- [ ] Sentry/analytics monitored
- [ ] Rollout to 100% when stable
