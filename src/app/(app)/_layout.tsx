import OfflineBanner from "@/components/OfflineBanner";
import { useNotifications } from "@/hooks/useNotifications";
import { Tabs } from "expo-router";
import { Compass, Folder, Home } from "lucide-react-native";
import { Platform } from "react-native";

export default function AppLayout() {
  useNotifications();

  return (
    <>
      <OfflineBanner />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#2A264F",
            position: "absolute",
            bottom: Platform.OS === "ios" ? 30 : 20,
            left: 20,
            right: 20,
            height: 70,
            borderRadius: 40,
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
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
          tabBarActiveTintColor: "#C6F432",
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
