import { useKeepAwake } from "expo-keep-awake";
import { router, Stack, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { RefreshCw, X } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

export default function CourseViewerScreen() {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const { colorScheme } = useColorScheme();

  const courseId = Array.isArray(id) ? id[0] : id;

  useKeepAwake();

  useEffect(() => {
    SecureStore.getItemAsync("accessToken").then(setToken);
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
  };

  return (
    <View className="flex-1 bg-brand-light dark:bg-brand-navy">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-row items-center justify-between px-4 pt-14 pb-4 bg-white dark:bg-brand-dark border-b border-gray-200 dark:border-white/5">
        <Text className="text-brand-navy dark:text-white font-bold text-lg">
          Course Player
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-brand-light dark:bg-[#232042] p-2.5 rounded-full"
        >
          <X
            size={20}
            color={
              colorScheme === "dark"
                ? Platform.OS === "ios"
                  ? "#fff"
                  : "#C6F432"
                : "#2A264F"
            }
          />
        </TouchableOpacity>
      </View>

      {hasError ? (
        <View className="flex-1 items-center justify-center p-6 bg-brand-light dark:bg-brand-navy">
          <Text className="text-brand-navy dark:text-white text-xl font-bold mb-2">
            Content Unavailable
          </Text>
          <Text className="text-gray-500 dark:text-brand-gray text-center mb-6">
            We couldn't load this course content. Please check your connection
            or try again.
          </Text>
          <TouchableOpacity
            onPress={handleRetry}
            className="flex-row items-center bg-brand-navy dark:bg-brand-lime px-6 py-4 rounded-full shadow-lg active:opacity-80"
          >
            <RefreshCw
              size={18}
              color={colorScheme === "dark" ? "#2A264F" : "#ffffff"}
              className="mr-2"
            />
            <Text className="text-white dark:text-brand-navy font-black text-base tracking-wide">
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-1 relative">
          {isLoading && (
            <View className="absolute z-10 w-full h-full bg-brand-light dark:bg-brand-navy items-center justify-center">
              <ActivityIndicator
                size="large"
                color={colorScheme === "dark" ? "#C6F432" : "#2A264F"}
              />
              <Text className="text-gray-500 dark:text-brand-gray mt-4 font-bold tracking-wider uppercase text-xs">
                Loading secure player...
              </Text>
            </View>
          )}

          {token && (
            <WebView
              source={{
                uri: `https://en.wikipedia.org/wiki/React_Native`,

                headers: {
                  Authorization: `Bearer ${token}`,

                  "X-App-Theme": colorScheme === "dark" ? "dark" : "light",
                  "X-Course-Id": courseId as string,
                  "X-Platform": Platform.OS,
                },
              }}
              style={{
                backgroundColor: colorScheme === "dark" ? "#2A264F" : "#F8F9FA",
              }}
              className="flex-1"
              onLoadEnd={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              javaScriptEnabled={true}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
            />
          )}
        </View>
      )}
    </View>
  );
}
