# Complete clean reset for Expo/React Native project

# 1. Stop all running processes
# Kill any running Metro bundler, Expo dev server, etc.

# 2. Clear all caches
npx expo install --fix
npx expo . -c

# 3. Clear Metro cache specifically
npx react-native start --reset-cache

# 4. Clear npm/yarn cache
npm cache clean --force

# 5. Remove node_modules and reinstall
rm -rf node_modules
rm package-lock.json

npm install

# 6. Clear Expo cache directories
rm -rf ~/.expo
rm -rf .expo


# 8. Clear Android cache
npx expo run:android --reset-cache


# 10. Clear temp directories
rm -rf /tmp/metro-*
rm -rf /tmp/react-*

# 11. Restart with clean cache
npx expo start --clear --reset-cache

