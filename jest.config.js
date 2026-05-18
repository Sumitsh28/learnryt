module.exports = {
  preset: "jest-expo",

  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|expo|@expo|expo-modules-core|expo-router|nativewind|react-native-reanimated|react-native-worklets|lucide-react-native|@legendapp/list|react-native-confetti-cannon)/)",
  ],

  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  collectCoverage: true,

  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",

    "!src/**/*.d.ts",

    "!src/api/client.ts",
    "!src/api/queryClient.ts",

    "!src/app/explore.tsx",

    "!src/app/_layout.tsx",
    "!src/app/(app)/_layout.tsx",
    "!src/app/(auth)/_layout.tsx",

    "!src/app/(app)/(tabs)/dashboard.tsx",
    "!src/app/(app)/(tabs)/profile.tsx",

    "!src/app/(app)/details/[id].tsx",
    "!src/app/(app)/viewer/[id].tsx",

    "!src/app/(auth)/welcome.tsx",

    "!src/app/modals/ai-tutor.tsx",
    "!src/app/modals/dev-menu.tsx",
    "!src/app/modals/notifications.tsx",
    "!src/app/modals/recommendations.tsx",

    "!src/components/OfflineBanner.tsx",
    "!src/components/animated-icon.tsx",
    "!src/components/animated-icon.web.tsx",
    "!src/components/app-tabs.tsx",
    "!src/components/app-tabs.web.tsx",
    "!src/components/external-link.tsx",
    "!src/components/hint-row.tsx",
    "!src/components/themed-text.tsx",
    "!src/components/themed-view.tsx",
    "!src/components/web-badge.tsx",

    "!src/components/ui/collapsible.tsx",

    "!src/constants/theme.ts",

    "!src/hooks/use-color-scheme.ts",
    "!src/hooks/use-color-scheme.web.ts",
    "!src/hooks/use-theme.ts",
  ],

  coverageThreshold: {
    global: {
      statements: 75,
      branches: 70,
      functions: 75,
      lines: 75,
    },
  },
};
