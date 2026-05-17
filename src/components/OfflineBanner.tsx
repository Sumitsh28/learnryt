import { useNetInfo } from "@react-native-community/netinfo";
import { WifiOff } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import React from "react";
import { Platform, Text, View } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OfflineBanner() {
  const netInfo = useNetInfo();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();

  if (netInfo.isConnected !== false) {
    return null;
  }

  return (
    <View
      className="absolute w-full items-center z-50 pointer-events-none"
      style={{
        top: Math.max(insets.top, Platform.OS === "ios" ? 40 : 20) + 10,
      }}
    >
      <Animated.View
        entering={FadeInUp.duration(500).springify().damping(14)}
        exiting={FadeOutUp.duration(300)}
        className="bg-white dark:bg-brand-dark px-5 py-3 rounded-full flex-row items-center shadow-lg border border-red-100 dark:border-red-500/20"
      >
        <View className="bg-red-50 dark:bg-red-500/10 p-2 rounded-full mr-3">
          <WifiOff
            size={16}
            color={colorScheme === "dark" ? "#F87171" : "#EF4444"}
          />
        </View>
        <Text className="text-brand-navy dark:text-white text-sm font-bold tracking-wide">
          No Internet Connection
        </Text>
      </Animated.View>
    </View>
  );
}
