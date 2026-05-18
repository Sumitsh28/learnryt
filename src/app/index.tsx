/// <reference types="nativewind/types" />

import * as LocalAuthentication from "expo-local-authentication";
import { Redirect } from "expo-router";
import JailMonkey from "jail-monkey";
import { Fingerprint, ShieldAlert } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useAuth } from "../store/useAuth";

export default function BootScreen() {
  const { hydrate, isLoading, isAuthenticated } = useAuth();
  const [isSecure, setIsSecure] = useState<boolean | null>(null);
  const [isDeviceCompromised, setIsDeviceCompromised] =
    useState<boolean>(false);
  const { colorScheme } = useColorScheme();

  const checkDeviceSecurity = () => {
    const isJailbroken = JailMonkey.isJailBroken();
    const canMockLocation = JailMonkey.canMockLocation();
    const isHooked = JailMonkey.hookDetected();

    if (isJailbroken || canMockLocation || isHooked) {
      setIsDeviceCompromised(true);
      return false;
    }
    return true;
  };

  const authenticate = async () => {
    const isSafe = checkDeviceSecurity();
    if (!isSafe) return;

    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      setIsSecure(true);
      hydrate();
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Unlock Learnryt",
      fallbackLabel: "Use Passcode",
      cancelLabel: "Cancel",
    });

    if (result.success) {
      setIsSecure(true);
      hydrate();
    } else {
      setIsSecure(false);
    }
  };

  useEffect(() => {
    authenticate();
  }, []);

  if (isDeviceCompromised) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-light dark:bg-brand-navy px-8">
        <Animated.View
          entering={FadeInDown.duration(600).springify().damping(14)}
          className="items-center"
        >
          <View className="bg-red-50 dark:bg-red-500/10 p-8 rounded-[36px] mb-8 shadow-sm border border-red-200 dark:border-red-500/20">
            <ShieldAlert size={56} color="#EF4444" strokeWidth={1.5} />
          </View>

          <Text className="text-brand-navy dark:text-white text-3xl font-black tracking-tight mb-3 text-center">
            Security Violation
          </Text>

          <Text className="text-gray-500 dark:text-brand-gray text-center mb-10 text-base font-medium leading-relaxed px-4">
            Learnryt cannot run on this device because it appears to be
            jailbroken, rooted, or running debugging tools that compromise app
            safety.
          </Text>
        </Animated.View>
      </View>
    );
  }

  if (isSecure === false) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-light dark:bg-brand-navy px-8">
        <Animated.View
          entering={FadeInDown.duration(600).springify().damping(14)}
          className="items-center"
        >
          <View className="bg-white dark:bg-brand-dark p-8 rounded-[36px] mb-8 shadow-sm border border-transparent dark:border-white/5">
            <Fingerprint
              size={56}
              color={colorScheme === "dark" ? "#C6F432" : "#2A264F"}
              strokeWidth={1.5}
            />
          </View>

          <Text className="text-brand-navy dark:text-white text-3xl font-black tracking-tight mb-3">
            App Locked
          </Text>

          <Text className="text-gray-500 dark:text-brand-gray text-center mb-10 text-base font-medium leading-relaxed px-4">
            Please verify your identity to access your secure learning
            environment.
          </Text>

          <TouchableOpacity
            onPress={authenticate}
            className="bg-brand-navy dark:bg-brand-lime px-10 py-5 rounded-full shadow-lg active:opacity-80 w-full items-center"
          >
            <Text className="text-white dark:text-brand-navy font-black text-lg tracking-wide">
              Unlock App
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  if (isLoading || isSecure === null) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-light dark:bg-brand-navy">
        <Animated.View entering={FadeIn.duration(400)} className="items-center">
          <ActivityIndicator
            size="large"
            color={colorScheme === "dark" ? "#C6F432" : "#2A264F"}
          />
          <Text className="text-gray-400 dark:text-brand-gray mt-6 font-bold tracking-widest uppercase text-xs">
            Securing Session...
          </Text>
        </Animated.View>
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
