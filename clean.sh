#!/bin/bash
# Exit immediately if a command exits with a non-zero status.
set -e

echo "
🧹 Starting a full clean and reset of your Expo project...
"

# --- Step 1: Clean up project-specific files ---
echo "1. Removing node_modules, lock file, and local caches..."
rm -rf node_modules
rm -f package-lock.json yarn.lock
rm -rf .expo


# --- Step 2: Clear system-level caches ---
echo "2. Clearing system caches (npm, Expo, Metro)..."
npm cache clean --force
rm -rf ~/.expo
rm -rf /tmp/metro-*
rm -rf /tmp/react-*


# --- Step 3: Reinstall dependencies ---
echo "3. Installing dependencies with npm..."
npm install


# --- Step 4: Sync native dependencies with Expo ---
echo "4. Syncing native dependencies with 'expo install --fix'..."
npx expo install --fix


echo "
✅ Clean-up complete!"
echo "
🚀 To start your project, run one of the following commands:

   npx expo start
   # or to reset caches on start:
   npx expo start --clear
"
