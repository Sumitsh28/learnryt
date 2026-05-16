/// <reference types="nativewind/types" />

import { Redirect } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../store/useAuth";

export default function BootScreen() {
  const { hydrate, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    hydrate();
  }, []);

  if (isLoading) {
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
