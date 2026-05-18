import "@testing-library/jest-native/extend-expect";

jest.mock("react-native-reanimated", () => {
  const mockComp = ({ children }) => children ?? null;

  const animationMock = {
    duration: () => animationMock,
    delay: () => animationMock,
    springify: () => animationMock,
    damping: () => animationMock,
    stiffness: () => animationMock,
    mass: () => animationMock,
    withInitialValues: () => animationMock,
  };

  const Animated = {
    View: mockComp,
    Text: mockComp,
    ScrollView: mockComp,
  };

  return {
    __esModule: true,

    default: Animated,

    View: mockComp,
    Text: mockComp,
    ScrollView: mockComp,

    createAnimatedComponent: (Comp) => Comp,

    useSharedValue: (v) => ({
      value: v,
    }),

    useAnimatedStyle: (fn) => (typeof fn === "function" ? fn() : {}),

    useDerivedValue: (fn) => ({
      value: typeof fn === "function" ? fn() : undefined,
    }),

    useAnimatedProps: (fn) => (typeof fn === "function" ? fn() : {}),

    withTiming: (v) => v,
    withSpring: (v) => v,
    withRepeat: (v) => v,
    withDelay: (_d, v) => v,
    withSequence: (...args) => args[0],

    cancelAnimation: jest.fn(),

    runOnJS: (fn) => fn,
    runOnUI: (fn) => fn,

    FadeIn: animationMock,
    FadeOut: animationMock,

    FadeInDown: animationMock,
    FadeOutDown: animationMock,

    FadeInUp: animationMock,
    FadeOutUp: animationMock,

    FadeInLeft: animationMock,
    FadeOutLeft: animationMock,

    FadeInRight: animationMock,
    FadeOutRight: animationMock,

    SlideInRight: animationMock,
    SlideOutLeft: animationMock,

    ZoomIn: animationMock,
    ZoomOut: animationMock,

    Layout: animationMock,
    LinearTransition: animationMock,

    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      in: jest.fn(),
      out: jest.fn(),
      inOut: jest.fn(),
      bezier: jest.fn(),
    },
  };
});

jest.mock("jail-monkey", () => ({
  isJailBroken: jest.fn(() => false),
  canMockLocation: jest.fn(() => false),
  hookDetected: jest.fn(() => false),
}));

jest.mock("expo-image", () => ({
  Image: "ExpoImageMock",
}));

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),

  ImpactFeedbackStyle: {
    Medium: "medium",
    Light: "light",
  },

  NotificationFeedbackType: {
    Success: "success",
    Error: "error",
  },
}));

jest.mock("expo-local-authentication", () => ({
  hasHardwareAsync: jest.fn(async () => true),

  isEnrolledAsync: jest.fn(async () => true),

  authenticateAsync: jest.fn(async () => ({
    success: true,
  })),

  supportedAuthenticationTypesAsync: jest.fn(async () => [1]),

  AuthenticationType: {
    FINGERPRINT: 1,
    FACIAL_RECOGNITION: 2,
    IRIS: 3,
  },
}));

jest.mock("lucide-react-native", () => {
  return new Proxy(
    {},
    {
      get: (_, prop) => `LucideIcon-${String(prop)}`,
    },
  );
});

jest.mock("expo-router", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return {
    router: {
      back: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
    },

    Redirect: jest.fn(({ href }) =>
      React.createElement(Text, null, `Redirect Mock to ${href}`),
    ),

    useLocalSearchParams: () => ({
      id: "mock-id",
    }),
  };
});

jest.mock("nativewind", () => ({
  useColorScheme: () => ({
    colorScheme: "dark",
    toggleColorScheme: jest.fn(),
  }),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({
    top: 44,
    left: 0,
    right: 0,
    bottom: 34,
  }),

  SafeAreaProvider: ({ children }) => children,

  SafeAreaView: ({ children }) => children,
}));

jest.mock("@/store/useAuth", () => ({
  useAuth: jest.fn(() => ({
    user: {
      id: "1",
    },

    token: "mock-token",

    hydrated: true,

    hydrate: jest.fn(),
  })),
}));

// const originalError = console.error;

// beforeAll(() => {
//   console.error = (...args) => {
//     if (
//       typeof args[0] === "string" &&
//       (args[0].includes("An error occurred in the <BootScreen> component") ||
//         args[0].includes("Warning:"))
//     ) {
//       return;
//     }

//     originalError(...args);
//   };
// });

// afterAll(() => {
//   console.error = originalError;
// });
