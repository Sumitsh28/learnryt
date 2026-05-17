import { useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { Stack, router, useLocalSearchParams } from "expo-router";
import {
  Bot,
  CheckCircle,
  ChevronLeft,
  Clock,
  FileText,
  Star,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { apiClient } from "../../../api/client";

const fetchCourseDetails = async (id: string) => {
  const { data } = await apiClient.get(`/public/randomproducts/${id}`);
  return data.data;
};

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isEnrolled, setIsEnrolled] = useState(false);

  const {
    data: course,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["course", id],
    queryFn: () => fetchCourseDetails(id as string),
    enabled: !!id,
  });

  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.95, { damping: 10, stiffness: 400 });
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, { damping: 10, stiffness: 400 });
  };

  const handleEnroll = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setIsEnrolled(true);

    setTimeout(() => {
      router.push(`/(app)/viewer/${id}`);
    }, 1500);
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (isError || !course) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-lg font-bold">Course not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="absolute top-12 left-4 z-50">
        <TouchableWithoutFeedback onPress={() => router.back()}>
          <View className="bg-black/50 p-2 rounded-full backdrop-blur-md border border-white/10">
            <ChevronLeft size={24} color="#ffffff" />
          </View>
        </TouchableWithoutFeedback>
      </View>

      <View className="absolute top-12 right-4 z-50">
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/modals/ai-tutor",
              params: { courseName: course.title },
            })
          }
          className="bg-white p-3 rounded-full shadow-lg flex-row items-center active:opacity-80"
        >
          <Bot size={20} color="#000" />
          <Text className="text-black font-bold ml-2">Tutor</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Animated.View entering={FadeInDown.duration(600)}>
          <Image
            source={{
              uri: course.thumbnail || "https://via.placeholder.com/600x400",
            }}
            style={{ width: "100%", height: 350 }}
            contentFit="cover"
            transition={300}
          />
        </Animated.View>

        <View className="p-6">
          <Animated.View entering={FadeInDown.duration(600).delay(200)}>
            <View className="flex-row items-center mb-3">
              <View className="bg-neutral-900 px-3 py-1 rounded-md border border-neutral-800">
                <Text className="text-neutral-300 text-xs font-bold uppercase tracking-widest">
                  {course.category || "Technology"}
                </Text>
              </View>
              <View className="flex-row items-center ml-4">
                <Star size={16} color="#fbbf24" fill="#fbbf24" />
                <Text className="text-white text-sm font-bold ml-1">
                  {course.rating || "4.8"}
                </Text>
              </View>
            </View>

            <Text className="text-white text-3xl font-bold tracking-tight mb-4">
              {course.title}
            </Text>
            <Text className="text-neutral-400 text-base leading-relaxed mb-6">
              {course.description}
            </Text>

            <View className="flex-row items-center justify-between bg-neutral-900 p-4 rounded-2xl border border-neutral-800 mb-8">
              <View className="flex-row items-center">
                <Clock size={20} color="#a3a3a3" />
                <Text className="text-white ml-2 font-medium">12h 30m</Text>
              </View>
              <View className="w-[1px] h-6 bg-neutral-700" />
              <View className="flex-row items-center">
                <FileText size={20} color="#a3a3a3" />
                <Text className="text-white ml-2 font-medium">24 Lessons</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-black/90 pt-4 pb-8 px-6 border-t border-neutral-900 backdrop-blur-lg">
        {isEnrolled ? (
          <Animated.View
            entering={FadeInUp.duration(400)}
            className="bg-green-500/20 flex-row items-center justify-center py-4 rounded-2xl border border-green-500/50"
          >
            <CheckCircle size={20} color="#4ade80" />
            <Text className="text-green-400 font-bold text-lg ml-2">
              Enrollment Successful!
            </Text>
            <ConfettiCannon
              count={150}
              origin={{ x: -10, y: 0 }}
              autoStart={true}
              fadeOut={true}
              colors={["#ffffff", "#4ade80", "#facc15", "#60a5fa"]}
            />
          </Animated.View>
        ) : (
          <TouchableWithoutFeedback
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleEnroll}
          >
            <Animated.View
              style={[animatedButtonStyle]}
              className="bg-white flex-row items-center justify-between px-6 py-4 rounded-2xl"
            >
              <Text className="text-black font-bold text-xl">Enroll Now</Text>
              <Text className="text-black font-medium text-lg">
                ${course.price}
              </Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </View>
  );
}
