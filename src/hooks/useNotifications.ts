import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";
import { Alert, AppState, Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const useNotifications = () => {
  const appState = useRef(AppState.currentState);

  const requestPermissions = async () => {
    if (Platform.OS === "web") return false;

    if (!Device.isDevice) {
      console.warn("Push notifications require a physical device");
      return false;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    if (existingStatus === "granted") return true;

    if (existingStatus === "undetermined") {
      return new Promise<boolean>((resolve) => {
        Alert.alert(
          "Stay on Track 🚀",
          "We use notifications to remind you to study and celebrate your milestones. Can we send you alerts?",
          [
            { text: "Not Now", style: "cancel", onPress: () => resolve(false) },
            {
              text: "Allow",
              onPress: async () => {
                const { status } =
                  await Notifications.requestPermissionsAsync();
                resolve(status === "granted");
              },
            },
          ],
        );
      });
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (appState.current.match(/active/) && nextAppState === "background") {
          await Notifications.scheduleNotificationAsync({
            identifier: "inactivity-reminder",
            content: {
              title: "Don't break your momentum! 🧠",
              body: "You were doing great. Jump back in and finish your lesson.",
              sound: true,
            },
            trigger: { seconds: 60 * 60 * 24 } as any,
          });
        }

        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          await Notifications.cancelScheduledNotificationAsync(
            "inactivity-reminder",
          );
        }

        appState.current = nextAppState;
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return { requestPermissions };
};
