/// <reference types="nativewind/types" />

import * as LocalAuthentication from "expo-local-authentication";
import { Redirect } from "expo-router";
import { Fingerprint } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../store/useAuth";

export default function BootScreen() {
  const { hydrate, isLoading, isAuthenticated } = useAuth();
  const [isSecure, setIsSecure] = useState<boolean | null>(null);

  const authenticate = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      setIsSecure(true);
      hydrate();
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Unlock Elite LMS",
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

  if (isSecure === false) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <View className="bg-neutral-900 p-6 rounded-full mb-6 border border-neutral-800">
          <Fingerprint size={48} color="#ffffff" />
        </View>
        <Text className="text-white text-2xl font-bold mb-2">App Locked</Text>
        <Text className="text-neutral-400 text-center mb-8">
          Please verify your identity to access your secure learning
          environment.
        </Text>
        <TouchableOpacity
          onPress={authenticate}
          className="bg-white px-8 py-4 rounded-full active:opacity-80"
        >
          <Text className="text-black font-bold text-lg">Unlock App</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading || isSecure === null) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
