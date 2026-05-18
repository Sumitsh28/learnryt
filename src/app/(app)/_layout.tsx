import OfflineBanner from "@/components/OfflineBanner";
import { useNotifications } from "@/hooks/useNotifications";
import { Tabs } from "expo-router";
import { Compass, Folder, Home } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Platform } from "react-native";

export default function AppLayout() {
  useNotifications();
  const { colorScheme } = useColorScheme();

  return (
    <>
      <OfflineBanner />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colorScheme === "dark" ? "#2A264F" : "#FFFFFF",
            position: "absolute",
            bottom: Platform.OS === "ios" ? 30 : 20,

            left: 50,
            right: 50,

            height: 70,
            borderRadius: 40,
            borderTopWidth: 0,

            elevation: colorScheme === "dark" ? 10 : 15,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: colorScheme === "dark" ? 0.3 : 0.08,
            shadowRadius: 20,
            paddingBottom: 0,
          },
          tabBarItemStyle: {
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          },
          tabBarIconStyle: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          },

          tabBarActiveTintColor: colorScheme === "dark" ? "#C6F432" : "#483DE0",
          tabBarInactiveTintColor: "#8A88A4",
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="(tabs)/index"
          options={{
            title: "Discover",
            tabBarIcon: ({ color }) => <Home color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="(tabs)/dashboard"
          options={{
            title: "Stats",
            tabBarIcon: ({ color }) => <Folder color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="(tabs)/profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => <Compass color={color} size={24} />,
          }}
        />

        <Tabs.Screen name="details/[id]" options={{ href: null }} />
        <Tabs.Screen name="viewer/[id]" options={{ href: null }} />
      </Tabs>
    </>
  );
}
