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
      <h4>Welcome Screen</h4>
      <img width="1080" height="2400" alt="WhatsApp Image 2026-05-18 at 13 54 02 (2)" src="https://github.com/user-attachments/assets/00dbebcc-a852-4efe-ac21-c2c5fe786dae" />

  </td>
    <td align="center">
      <h4>SignUp Screen</h4>
      <img width="1080" height="2400" alt="WhatsApp Image 2026-05-18 at 13 54 02 (1)" src="https://github.com/user-attachments/assets/ec160809-d66d-4eee-8a56-f587a3609069" />

  </td>

  <td align="center">
      <h4>SignIn Screen</h4>
      <img width="1080" height="2400" alt="WhatsApp Image 2026-05-18 at 13 54 02" src="https://github.com/user-attachments/assets/644bd0d9-d1fe-48a5-988f-d230e5230c58" />

  </td>
  </tr>

  <tr>
    <td align="center">
      <h4>Home Screen</h4>
      <img width="1080" height="2400" alt="WhatsApp Image 2026-05-18 at 13 53 59" src="https://github.com/user-attachments/assets/9011be3d-f928-4b5d-8abe-277dc44b64dd" />

  </td>
    <td align="center">
      <h4>Course Details Screen</h4>
     <img width="1080" height="2400" alt="WhatsApp Image 2026-05-18 at 13 54 00" src="https://github.com/user-attachments/assets/efa110c8-e5e6-465a-9492-a58f981f7c0c" />

  </td>
   <td align="center">
      <h4>Course Enroll Confetti</h4>
      <img width="1080" height="2400" alt="WhatsApp Image 2026-05-18 at 13 54 00 (2)" src="https://github.com/user-attachments/assets/c004eac1-5e6f-47ab-88da-28515576dab4" />

  </td>
  </tr>

  <tr>
    <td align="center">
      <h4>Dashboard Screen</h4>
      <img width="1080" height="2400" alt="WhatsApp Image 2026-05-18 at 13 54 01" src="https://github.com/user-attachments/assets/72fd36a1-cd2a-4ff2-a47f-f8280a2a5acd" />

  </td>
    <td align="center">
      <h4>Profile Screen</h4>
      <img width="1080" height="2400" alt="WhatsApp Image 2026-05-18 at 13 54 01 (1)" src="https://github.com/user-attachments/assets/d96cfa99-66e2-4799-93a8-8608b377e4f0" />
</td>
    <td align="center">
      <h4>Notifications Toggle Screen</h4>
      <img width="1080" height="2400" alt="WhatsApp Image 2026-05-18 at 13 54 01 (2)" src="https://github.com/user-attachments/assets/05396b96-1e9c-41e1-a626-d1348547461c" />

  </td>
  </tr>
  <tr>
    <td align="center">
      <h4>AI Tutor Chat Screen</h4>
<img width="1080" height="2400" alt="WhatsApp Image 2026-05-18 at 13 54 00 (1)" src="https://github.com/user-attachments/assets/269e5170-f60c-474d-94fe-8edaca2db072" />

  </td>
    <td align="center">
      <h4>AI Course Recommedation Screen</h4>
      <img width="1080" height="2400" alt="WhatsApp Image 2026-05-18 at 13 54 01 (3)" src="https://github.com/user-attachments/assets/ffaf9793-73b2-47fe-b6d3-09932c8fddf8" />

</td>
    <td align="center">
      <h4>Light Mode View</h4>
<img width="1080" height="2400" alt="WhatsApp Image 2026-05-18 at 14 31 37" src="https://github.com/user-attachments/assets/fa1f4e7e-f804-43d8-a058-4027a587c222" />

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
<img width="671" height="536" alt="Screenshot 2026-05-18 at 11 32 39 AM" src="https://github.com/user-attachments/assets/a2b616e7-a627-4dbc-8480-0d47f640eb68" />


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
