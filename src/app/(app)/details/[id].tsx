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
  Clock,
  FileText,
  Play,
  PlayCircle,
  Radio,
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

const LESSONS = [
  { id: "1", title: "Introduction to UI/UX", duration: "12:00", progress: 100 },
  { id: "2", title: "Color Theory & Systems", duration: "45:30", progress: 65 },
  {
    id: "3",
    title: "Typography in Mobile Apps",
    duration: "32:15",
    progress: 0,
  },
  { id: "4", title: "Layouts and Grids", duration: "28:10", progress: 0 },
];

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

  const handlePressIn = () => (buttonScale.value = withSpring(0.95));
  const handlePressOut = () => (buttonScale.value = withSpring(1));

  const handleEnroll = () => {
    if (Platform.OS !== "web")
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (user?._id) enroll(user._id, courseId as string);
    setShowConfetti(true);
  };

  const isSaved = isBookmarked(user?._id, courseId as string);
  const userOwnsCourse = checkIsEnrolled(user?._id, courseId as string);

  if (isLoading) {
    return (
      <View className="flex-1 bg-brand-light dark:bg-brand-navy items-center justify-center">
        <ActivityIndicator size="large" color="#C6F432" />
      </View>
    );
  }

  if (isError || !course) {
    return (
      <View className="flex-1 bg-brand-light dark:bg-brand-navy items-center justify-center">
        <Text className="text-brand-navy dark:text-white text-lg font-bold">
          Course not found
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-brand-light dark:bg-brand-navy">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Floating Back & Action Buttons */}
      <View className="absolute top-12 left-4 right-4 z-50 flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-white/90 dark:bg-brand-dark/90 p-3 rounded-2xl shadow-sm"
        >
          <ChevronLeft size={24} color="#8A88A4" />
        </TouchableOpacity>

        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() => {
              if (Platform.OS !== "web")
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              if (user?._id) toggleBookmark(user._id, courseId as string);
            }}
            className="bg-white/90 dark:bg-brand-dark/90 p-3 rounded-2xl shadow-sm"
          >
            <Bookmark
              size={20}
              color={
                isSaved
                  ? Platform.OS === "ios"
                    ? "#000"
                    : "#C6F432"
                  : "#8A88A4"
              }
              fill={
                isSaved
                  ? Platform.OS === "ios"
                    ? "#000"
                    : "#C6F432"
                  : "transparent"
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/modals/ai-tutor",
                params: { courseName: course.title },
              })
            }
            className="bg-white dark:bg-brand-lime px-4 py-2 rounded-2xl shadow-lg flex-row items-center active:opacity-80"
          >
            <Bot size={18} color="#000" />
            <Text className="text-black font-bold ml-2">Tutor</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <View className="w-full h-[400px] bg-[#2A264F] relative">
          <Image
            source={{ uri: course.thumbnail }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
          <TouchableOpacity className="absolute bottom-10 right-6 bg-[#6E5DE7] px-5 py-3 rounded-2xl flex-row items-center shadow-xl">
            <Radio size={18} color="white" />
            <Text className="text-white font-bold ml-2">Join Live Class</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-brand-light dark:bg-brand-navy -mt-10 rounded-t-[40px] px-6 pt-10">
          <Animated.View entering={FadeInDown.duration(600)}>
            <Text className="text-brand-navy dark:text-white text-3xl font-extrabold mb-4">
              {course.title}
            </Text>

            <View className="flex-row items-center gap-4 mb-8">
              <View className="flex-row items-center bg-white dark:bg-brand-dark px-4 py-2 rounded-xl">
                <Star size={16} color="#fbbf24" fill="#fbbf24" />
                <Text className="text-brand-navy dark:text-white font-bold ml-2">
                  {course.rating}
                </Text>
              </View>
              <View className="flex-row items-center bg-white dark:bg-brand-dark px-4 py-2 rounded-xl">
                <Clock size={16} color="#8A88A4" />
                <Text className="text-brand-navy dark:text-white font-bold ml-2">
                  12h 30m
                </Text>
              </View>
              <View className="flex-row items-center bg-white dark:bg-brand-dark px-4 py-2 rounded-xl">
                <FileText size={16} color="#8A88A4" />
                <Text className="text-brand-navy dark:text-white font-bold ml-2">
                  24 Lessons
                </Text>
              </View>
            </View>

            <Text className="text-gray-500 dark:text-brand-gray text-base leading-relaxed mb-10 font-medium">
              {course.description}
            </Text>

            <Text className="text-brand-navy dark:text-white text-xl font-bold mb-6">
              Course Content
            </Text>

            {LESSONS.map((lesson, idx) => (
              <TouchableOpacity
                key={lesson.id}
                className="flex-row items-center justify-between bg-white dark:bg-brand-dark p-4 rounded-[24px] mb-4 border border-transparent dark:border-white/5 shadow-sm"
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 bg-brand-light dark:bg-brand-navy rounded-2xl items-center justify-center">
                    <Play
                      size={20}
                      color={idx === 0 ? "#C6F432" : "#8A88A4"}
                      fill={idx === 0 ? "#C6F432" : "transparent"}
                    />
                  </View>
                  <View className="ml-4 flex-1">
                    <Text
                      className="text-brand-navy dark:text-white font-bold text-base"
                      numberOfLines={1}
                    >
                      {lesson.title}
                    </Text>
                    <Text className="text-gray-400 text-xs font-medium mt-0.5">
                      {lesson.duration}
                    </Text>
                  </View>
                </View>

                <View
                  className={`w-10 h-10 rounded-full border-[2.5px] items-center justify-center ${lesson.progress > 0 ? "border-brand-lime" : "border-gray-200 dark:border-brand-navy"}`}
                >
                  {lesson.progress === 100 ? (
                    <CheckCircle size={16} color="#C6F432" />
                  ) : (
                    <Text className="text-brand-navy dark:text-white text-[10px] font-bold">
                      {lesson.progress}%
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </View>
      </ScrollView>

      <View className="absolute bottom-10 left-6 right-6">
        <Animated.View
          entering={FadeInUp.delay(400)}
          style={animatedButtonStyle}
        >
          {userOwnsCourse ? (
            <TouchableOpacity
              onPress={() => router.push(`/(app)/viewer/${courseId}`)}
              className="bg-brand-navy dark:bg-brand-lime h-16 rounded-3xl flex-row items-center justify-center shadow-2xl"
            >
              <PlayCircle
                size={22}
                color={Platform.OS === "ios" ? "white" : "black"}
              />
              <Text className="text-white dark:text-black font-extrabold text-lg ml-3">
                Continue Learning
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableWithoutFeedback
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handleEnroll}
            >
              <View className="bg-brand-navy dark:bg-brand-peach h-16 rounded-3xl flex-row items-center justify-between px-8 shadow-2xl">
                <Text className="text-white dark:text-brand-navy font-extrabold text-lg">
                  Enroll Now
                </Text>
                <Text className="text-white/60 dark:text-brand-navy/60 font-bold text-lg">
                  ${course.price}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        </Animated.View>
      </View>

      {showConfetti && (
        <ConfettiCannon
          count={150}
          origin={{ x: 0, y: 0 }}
          autoStart={true}
          fadeOut={true}
          colors={["#C6F432", "#F9C0AB", "#6E5DE7", "#FFFFFF"]}
        />
      )}
    </View>
  );
}
