# Complete clean reset for Expo/React Native project

# 1. Stop all running processes
# Kill any running Metro bundler, Expo dev server, etc.

# 2. Clear all caches
npx expo install --fix
npx expo r -c
# or
npx expo start --clear

# 3. Clear Metro cache specifically
npx react-native start --reset-cache

# 4. Clear npm/yarn cache
npm cache clean --force
# or if using yarn:
yarn cache clean

# 5. Remove node_modules and reinstall
rm -rf node_modules
rm package-lock.json
# or if using yarn:
rm yarn.lock

npm install
# or
yarn install

# 6. Clear Expo cache directories
rm -rf ~/.expo
rm -rf .expo

# 7. Clear iOS simulator cache (if on Mac)
npx expo run:ios --clear-cache

# 8. Clear Android cache
npx expo run:android --clear-cache

# 9. Reset Watchman (if installed)
watchman watch-del-all

# 10. Clear temp directories
rm -rf /tmp/metro-*
rm -rf /tmp/react-*

# 11. Restart with clean cache
npx expo start --clear --reset-cache

# Alternative one-liner for quick cache clear:
npx expo r -c && rm -rf node_modules package-lock.json && npm install
