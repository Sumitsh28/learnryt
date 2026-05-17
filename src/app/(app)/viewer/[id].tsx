import { useKeepAwake } from "expo-keep-awake";
import { router, Stack, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { RefreshCw, X } from "lucide-react-native";
import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";

export default function CourseViewerScreen() {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useKeepAwake();

  React.useEffect(() => {
    SecureStore.getItemAsync("accessToken").then(setToken);
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
  };

  return (
    <View className="flex-1 bg-black">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-row items-center justify-between px-4 pt-14 pb-4 bg-neutral-900 border-b border-neutral-800">
        <Text className="text-white font-bold text-lg">Course Player</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-neutral-800 p-2 rounded-full"
        >
          <X size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {hasError ? (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-white text-xl font-bold mb-2">
            Content Unavailable
          </Text>
          <Text className="text-neutral-400 text-center mb-6">
            We couldn't load this course content. Please check your connection
            or try again later.
          </Text>
          <TouchableOpacity
            onPress={handleRetry}
            className="flex-row items-center bg-white px-6 py-3 rounded-full"
          >
            <RefreshCw size={16} color="#000" className="mr-2" />
            <Text className="text-black font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-1">
          {isLoading && (
            <View className="absolute z-10 w-full h-full bg-black items-center justify-center">
              <ActivityIndicator size="large" color="#ffffff" />
              <Text className="text-neutral-400 mt-4 font-medium">
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
                  "X-App-Theme": "dark",
                },
              }}
              className="flex-1 bg-black"
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
