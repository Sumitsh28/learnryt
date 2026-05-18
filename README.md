# 🚀 Learnryt

**Learnryt** is a high-performance, offline-first mobile Learning Management System (LMS) built with React Native and Expo Router. Designed with a deep focus on UX, security, and integrations (like AI-driven tutoring), Learnryt delivers a frictionless, gamified educational experience.

---

## 🔗 Quick Links

- **📥 Download APK:** [Click here to download the latest Android build](https://github.com/Sumitsh28/learnryt/releases/download/v1.0.0/Learnryt.apk)
- **🎬 Demo Video:** [Watch the full app walkthrough](https://drive.google.com/file/d/1gFMmmidjqaohm7bFEto-XAyVUzJw3oB4/view?usp=drive_link)

---

## 📸 App Gallery

<table>
  <tr>
    <td align="center">
      <h4>Home Screen</h4>
      <img src="YOUR_IMAGE_1" width="250"/>
    </td>
    <td align="center">
      <h4>Profile Screen</h4>
      <img src="YOUR_IMAGE_2" width="250"/>
    </td>
  </tr>

  <tr>
    <td align="center">
      <h4>Chat Screen</h4>
      <img src="YOUR_IMAGE_3" width="250"/>
    </td>
    <td align="center">
      <h4>Settings Screen</h4>
      <img src="YOUR_IMAGE_4" width="250"/>
    </td>
  </tr>

  <tr>
    <td align="center">
      <h4>Dark Mode</h4>
      <img src="YOUR_IMAGE_5" width="250"/>
    </td>
    <td align="center">
      <h4>Notifications</h4>
      <img src="YOUR_IMAGE_6" width="250"/>
    </td>
  </tr>
</table>

---

## 🏗️ Architecture & Tech Stack

Learnryt utilizes a modern, modular architecture focusing on separation of concerns, rapid rendering, and offline resilience.

### Core Technologies

- **Framework:** React Native + Expo (SDK 55)
- **Routing:** Expo Router (File-based Group Routing)
- **Styling:** NativeWind v4 (Tailwind CSS for React Native)
- **State Management:** Zustand (Global) + TanStack React Query (Server State)
- **Local Storage:** `AsyncStorage` (Fast, synchronous) + `expo-secure-store` (Tokens)
- **Performance:** `@legendapp/list` (60fps scrolling), Reanimated 3 (Fluid UI)

### System Strategy

1. **Network Layer:** Configured Axios instance with exponential backoff, automated timeout handling, and a sophisticated `401 Unauthorized` interceptor that pauses queues, refreshes tokens via SecureStore, and resumes requests.
2. **Offline-First:** Seamless AsyncStorage caching ensures UI loads without connectivity. `expo-file-system` caches WebView HTML/images, falling back to `loadLocalUri()` when `@react-native-community/netinfo` detects offline status.
3. **Security:** Built-in `jailmonkey` integration detects rooted/jailbroken devices or hooked environments. Falls back to `expo-local-authentication` (FaceID/Fingerprint) for secure session recovery.

---

## 🗂️ Project Structure

Built using Expo Router's Group Routing for scalable domain separation.

```plaintext
src/
├── api/                  # Axios configuration, interceptors, queryClient
├── components/           # Atomic UI components, OfflineBanner, Animated Icons
├── hooks/                # Custom business logic (useNotifications, useSecurity)
├── store/                # Zustand stores (useAuth, useBookmarks, useEnrollments)
├── services/             # Native bridging (storage, analytics, webview wrappers)
├── constants/            # Theme, Colors, Env variables
└── app/
    ├── _layout.tsx       # Global Providers (Zustand, React Query, Error Boundary)
    ├── index.tsx         # Boot Screen (Validates SecureStore token, Security checks)
    ├── (auth)/           # 🔒 Gateway Group
    │   ├── _layout.tsx
    │   ├── welcome.tsx   # Landing screen with features carousel
    │   ├── login.tsx     # Hook Form + Zod, Forgot password, Biometric fallback
    │   └── register.tsx  # Account creation form
    ├── (app)/            # 📱 Main Authenticated App
    │   ├── _layout.tsx   # Bottom Tab Navigator
    │   ├── (tabs)/
    │   │   ├── index.tsx     # Home: Search, Connectivity Banner, LegendList Catalog
    │   │   ├── dashboard.tsx # Stats: Reanimated SVG charts, streaks, bookmarks
    │   │   └── profile.tsx   # Avatar upload, user stats, app settings, logout
    │   ├── details/
    │   │   └── [id].tsx      # Course UI: Hero image, Details, Reanimated Enroll button
    │   └── viewer/
    │       └── [id].tsx      # WebView Player: Passed headers, loading bar, Keep-awake
    └── modals/           # 🛠️ Overlays
        ├── ai-tutor.tsx          # Slide-up OpenAI Chat interface
        ├── recommendations.tsx   # AI-powered smart search results
        └── dev-menu.tsx          # Hidden tools (Triple-tap triggered)

```

---

## 🌟 "The Wow Factor" (Elite Integrations)

We didn't just build an LMS; we built an experience.

- **🧠 AI Study Buddy:** Integrated OpenAI SDK. A FAB inside the course screen opens an AI chat pre-prompted with contextual course data to answer student questions in real-time.
- **📊 Interactive Data Dashboards:** The Stats tab leverages `react-native-svg` and Reanimated 3 to visualize learning progress.
- **🎮 Gamification:** Tracks daily learning streaks using `date-fns`. Hitting 3-day or 7-day milestones triggers immersive `react-native-confetti-cannon` animations.
- **⏰ Smart Notifications:** Uses `expo-notifications` and `AppState` tracking. If a user backgrounds the app during a lesson, a scheduled 24-hour "Come back and learn" local notification is queued (and instantly cancelled if they return).

---

## 🧪 Testing & Quality Assurance

Reliability is paramount. We implemented a robust testing pipeline achieving **>75% global code coverage**.

- **Unit & Integration:** **Jest** combined with **React Native Testing Library (v14)** handles logic, hooks, and complex component branching (like our `BootScreen` security checks).
- **End-to-End (E2E):** **Detox** is configured for iOS/Android simulator automation to test critical user flows (Authentication, Course Enrollment).
- **Environment Mocks:** Full structural mocks implemented for Reanimated, NativeWind, JailMonkey, and Expo Router to ensure pure, isolated testing.

### Coverage Report

---

## 🛠️ Setup & Installation

### Prerequisites

- Node.js (v18+)
- EAS CLI (`npm install -g eas-cli`)
- iOS Simulator / Android Emulator

### Running Locally

1. **Clone the repository**

```bash
git clone https://github.com/Sumitsh28/learnryt.git
cd learnryt
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_URL=https://api.freeapi.app/api/v1
EXPO_PUBLIC_OPENAI_KEY=your_openai_api_key
```

4. **Start the Development Server**

```bash
# Clear cache to ensure NativeWind v4 compiles CSS correctly
npx expo start -c
```

5. **Run Tests**

```bash
# Run Jest coverage suite
npm run test:coverage
```

---

## 🔒 DevOps & CI/CD

- **Error Tracking:** Wrapped Root Layout in Error Boundaries.
- **CI/CD:** Configured with GitHub Actions for automated PR checks (Lint, Typecheck, Test).
- **Deployment:** Powered by Expo Application Services (EAS). `eas build` for native binaries, and `eas update` for Over-The-Air (OTA) bug fixes without going through app store reviews.

---
