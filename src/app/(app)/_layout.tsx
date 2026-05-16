import { Tabs } from "expo-router";
import { BarChart2, Home, User } from "lucide-react-native";

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000000",
          borderTopWidth: 1,
          borderTopColor: "#171717",
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#525252",
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="(tabs)/index"
        options={{
          title: "Discover",
          tabBarIcon: ({ size }) => <Home size={size} />,
        }}
      />
      <Tabs.Screen
        name="(tabs)/dashboard"
        options={{
          title: "Stats",
          tabBarIcon: ({ size }) => <BarChart2 size={size} />,
        }}
      />
      <Tabs.Screen
        name="(tabs)/profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size }) => <User size={size} />,
        }}
      />
    </Tabs>
  );
}
