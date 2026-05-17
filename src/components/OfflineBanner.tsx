import { useNetInfo } from "@react-native-community/netinfo";
import { WifiOff } from "lucide-react-native";
import React from "react";
import { Platform, Text } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OfflineBanner() {
  const netInfo = useNetInfo();
  const insets = useSafeAreaInsets();

  if (netInfo.isConnected !== false) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInUp.duration(400)}
      exiting={FadeOutUp.duration(300)}
      style={{
        paddingTop: Math.max(insets.top, Platform.OS === "ios" ? 40 : 20),
      }}
      className="absolute top-0 w-full bg-red-500 z-50 px-4 pb-3 flex-row items-center justify-center shadow-lg"
    >
      <WifiOff size={16} color="#ffffff" />
      <Text className="text-white text-sm font-bold ml-2">
        No Internet Connection
      </Text>
    </Animated.View>
  );
}
