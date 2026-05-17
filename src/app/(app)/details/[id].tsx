import { useAuth } from "@/store/useAuth";
import { useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { Stack, router, useLocalSearchParams } from "expo-router";
import {
  Bookmark,
  Bot,
  CheckCircle,
  ChevronLeft,
  Package,
  PlayCircle,
  Star,
  Tag,
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
import { useBookmarks } from "../../../store/useBookmarks";
import { useEnrollments } from "../../../store/useEnrollments";

const fetchCourseDetails = async (id: string) => {
  const { data } = await apiClient.get(`/public/randomproducts/${id}`);
  const course = data.data;

  if (course.thumbnail?.includes("product-images")) {
    course.thumbnail =
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80";
    course.images = [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    ];
  }
  return course;
};

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams();

  const courseId = Array.isArray(id) ? id[0] : id;

  const { user } = useAuth();

  const [showConfetti, setShowConfetti] = useState(false);

  const { toggleBookmark, isBookmarked } = useBookmarks();
  const { enroll, checkIsEnrolled } = useEnrollments();

  const {
    data: course,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => fetchCourseDetails(courseId as string),
    enabled: !!courseId,
  });

  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = () =>
    (buttonScale.value = withSpring(0.95, { damping: 10, stiffness: 400 }));
  const handlePressOut = () =>
    (buttonScale.value = withSpring(1, { damping: 10, stiffness: 400 }));

  const handleEnroll = () => {
    if (Platform.OS !== "web")
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (user?._id) {
      enroll(user._id, courseId as string);
    }
    setShowConfetti(true);
  };

  const isSaved = isBookmarked(user?._id, courseId as string);
  const userOwnsCourse = checkIsEnrolled(user?._id, courseId as string);

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

      <View className="absolute top-12 left-4 right-4 z-50 flex-row justify-between items-center">
        <TouchableWithoutFeedback onPress={() => router.back()}>
          <View className="bg-black/50 p-2 rounded-full backdrop-blur-md border border-white/10">
            <ChevronLeft size={24} color="#ffffff" />
          </View>
        </TouchableWithoutFeedback>

        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() => {
              if (Platform.OS !== "web")
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              if (user?._id) toggleBookmark(user._id, courseId as string);
            }}
            className="bg-black/50 p-2.5 rounded-full backdrop-blur-md border border-white/10"
          >
            <Bookmark
              size={20}
              color={isSaved ? "#ffffff" : "#a3a3a3"}
              fill={isSaved ? "#ffffff" : "transparent"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/modals/ai-tutor",
                params: { courseName: course.title },
              })
            }
            className="bg-white px-4 py-2 rounded-full shadow-lg flex-row items-center active:opacity-80"
          >
            <Bot size={18} color="#000" />
            <Text className="text-black font-bold ml-2">Tutor</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Animated.View entering={FadeInDown.duration(600)}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            className="h-72 w-full"
          >
            {course.images?.length > 0 ? (
              course.images.map((img: string, idx: number) => (
                <Image
                  key={idx}
                  source={{ uri: img }}
                  style={{ width: 400, height: 350 }}
                  contentFit="cover"
                />
              ))
            ) : (
              <Image
                source={{
                  uri:
                    course.thumbnail || "https://via.placeholder.com/600x400",
                }}
                style={{ width: 400, height: 350 }}
                contentFit="cover"
              />
            )}
          </ScrollView>
        </Animated.View>

        <View className="p-6">
          <Animated.View entering={FadeInDown.duration(600).delay(200)}>
            <View className="flex-row items-center mb-3">
              <View className="bg-neutral-900 px-3 py-1 rounded-md border border-neutral-800">
                <Text className="text-neutral-300 text-xs font-bold uppercase tracking-widest">
                  {course.category || "Category"}
                </Text>
              </View>
              <View className="flex-row items-center ml-4">
                <Star size={16} color="#fbbf24" fill="#fbbf24" />
                <Text className="text-white text-sm font-bold ml-1">
                  {course.rating}
                </Text>
              </View>
            </View>

            <Text className="text-white text-3xl font-bold tracking-tight mb-2">
              {course.title}
            </Text>

            <View className="flex-row items-center mb-6">
              <Text className="text-neutral-400 font-medium mr-3">
                {course.brand}
              </Text>
              <View className="w-1.5 h-1.5 rounded-full bg-neutral-700 mr-3" />
              <Text className="text-green-400 font-bold">
                {course.discountPercentage}% OFF
              </Text>
            </View>

            <Text className="text-neutral-400 text-base leading-relaxed mb-8">
              {course.description}
            </Text>

            <View className="flex-row items-center justify-between bg-neutral-900 p-4 rounded-2xl border border-neutral-800 mb-8">
              <View className="flex-row items-center">
                <Package size={20} color="#a3a3a3" />
                <Text className="text-white ml-2 font-medium">
                  {course.stock} Available
                </Text>
              </View>
              <View className="w-[1px] h-6 bg-neutral-700" />
              <View className="flex-row items-center">
                <Tag size={20} color="#a3a3a3" />
                <Text className="text-white ml-2 font-medium">
                  ${course.price}
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-black/90 pt-4 pb-8 px-6 border-t border-neutral-900 backdrop-blur-lg">
        {userOwnsCourse ? (
          <Animated.View
            entering={FadeInUp.duration(400)}
            className="bg-neutral-900 flex-row items-center justify-between px-6 py-4 rounded-2xl border border-neutral-800"
          >
            <View className="flex-row items-center">
              <CheckCircle size={20} color="#4ade80" />
              <Text className="text-white font-bold text-lg ml-2">
                Enrolled
              </Text>
            </View>

            {/* ✅ New View Course Button */}
            <TouchableOpacity
              onPress={() => router.push(`/(app)/viewer/${courseId}`)}
              className="bg-green-500 px-5 py-2.5 rounded-xl flex-row items-center active:opacity-80"
            >
              <PlayCircle size={16} color="#000" />
              <Text className="text-black font-bold ml-2">Watch</Text>
            </TouchableOpacity>

            {showConfetti && (
              <ConfettiCannon
                count={150}
                origin={{ x: -10, y: 0 }}
                autoStart={true}
                fadeOut={true}
                colors={["#ffffff", "#4ade80", "#facc15", "#60a5fa"]}
              />
            )}
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
