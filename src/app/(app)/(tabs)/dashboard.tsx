import { useAuth } from "@/store/useAuth";
import { useBookmarks } from "@/store/useBookmarks";
import { useEnrollments } from "@/store/useEnrollments";
import {
  ChevronRight,
  Clock,
  Flame,
  Target,
  Trophy,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const WEEKLY_DATA = [
  { day: "Mon", value: 40 },
  { day: "Tue", value: 70 },
  { day: "Wed", value: 100 },
  { day: "Thu", value: 30 },
  { day: "Fri", value: 85 },
  { day: "Sat", value: 20 },
  { day: "Sun", value: 50 },
];

const MONTHLY_DATA = [
  { day: "W1", value: 60 },
  { day: "W2", value: 80 },
  { day: "W3", value: 45 },
  { day: "W4", value: 90 },
  { day: "W5", value: 100 },
];

export default function DashboardScreen() {
  const { user } = useAuth();
  const { getUserBookmarks } = useBookmarks();
  const { enrollmentsByUser } = useEnrollments();

  const [timeframe, setTimeframe] = useState<"week" | "month">("week");

  const [points, setPoints] = useState(2500);
  const [streak, setStreak] = useState(14);
  const [isClaimed, setIsClaimed] = useState(false);

  const savedCount = getUserBookmarks(user?._id).length;
  const enrolledCount = user?._id
    ? enrollmentsByUser[user._id]?.length || 0
    : 0;

  const currentData = timeframe === "week" ? WEEKLY_DATA : MONTHLY_DATA;

  // Simulate claiming a daily reward
  const handleClaimReward = () => {
    if (isClaimed) return;
    setPoints((prev) => prev + 50);
    setStreak((prev) => prev + 1);
    setIsClaimed(true);
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    bgColor,
    iconColor,
    delay,
  }: any) => (
    <Animated.View
      entering={FadeInDown.duration(500).delay(delay)}
      className="bg-white dark:bg-brand-dark p-5 rounded-[28px] shadow-sm flex-1 m-1.5"
    >
      <View
        className={`w-12 h-12 rounded-2xl items-center justify-center mb-4 ${bgColor}`}
      >
        <Icon size={24} color={iconColor} />
      </View>
      <Text className="text-brand-navy dark:text-white text-3xl font-black tracking-tight mb-1">
        {value}
      </Text>
      <Text className="text-gray-500 dark:text-brand-gray font-medium text-sm">
        {title}
      </Text>
    </Animated.View>
  );

  return (
    <View className="flex-1 bg-brand-light dark:bg-brand-navy pt-16 px-4">
      <View className="px-2 mb-6 flex-row justify-between items-end">
        <View>
          <Text className="text-brand-navy dark:text-white text-3xl font-black tracking-tight">
            Your Progress
          </Text>
          <Text className="text-gray-500 dark:text-brand-gray text-base font-medium mt-1">
            Keep up the great work, {user?.username}!
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <View className="flex-row px-1">
          <StatCard
            icon={Trophy}
            title="Total Points"
            value={points.toLocaleString()}
            bgColor="bg-brand-lime/20 dark:bg-brand-lime/10"
            iconColor={Platform.OS === "ios" ? "#000" : "#C6F432"}
            delay={100}
          />
          <StatCard
            icon={Flame}
            title="Day Streak"
            value={streak}
            bgColor="bg-brand-peach/20 dark:bg-brand-peach/10"
            iconColor="#F9C0AB"
            delay={200}
          />
        </View>
        <View className="flex-row px-1 mt-1 mb-8">
          <StatCard
            icon={Target}
            title="Enrolled"
            value={enrolledCount}
            bgColor="bg-[#6E5DE7]/10"
            iconColor="#6E5DE7"
            delay={300}
          />
          <StatCard
            icon={Clock}
            title="Saved"
            value={savedCount}
            bgColor="bg-gray-100 dark:bg-white/5"
            iconColor="#8A88A4"
            delay={400}
          />
        </View>

        <Animated.View
          entering={FadeInUp.duration(600).delay(500)}
          className="bg-white dark:bg-brand-dark rounded-[32px] p-6 shadow-sm mx-2 mb-8"
        >
          <View className="flex-row justify-between items-center mb-8">
            <Text className="text-brand-navy dark:text-white font-bold text-xl">
              Learning Activity
            </Text>
            <TouchableOpacity
              onPress={() =>
                setTimeframe(timeframe === "week" ? "month" : "week")
              }
              className="bg-gray-100 dark:bg-brand-navy px-4 py-2 rounded-full active:opacity-70"
            >
              <Text className="text-gray-600 dark:text-brand-gray font-bold text-xs">
                {timeframe === "week" ? "This Week" : "This Month"}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between items-end h-40">
            {currentData.map((item, index) => {
              // Ensure we recalculate peak based on current dataset
              const maxVal = Math.max(...currentData.map((d) => d.value));
              const isPeak = item.value === maxVal;

              return (
                <View
                  key={`${timeframe}-${index}`}
                  className="items-center flex-1"
                >
                  <View className="w-full h-full justify-end items-center px-1.5">
                    <Animated.View
                      key={`${timeframe}-bar-${index}`}
                      entering={FadeInUp.duration(800)
                        .delay(100 + index * 50)
                        .springify()}
                      className={`w-full rounded-full ${isPeak ? "bg-brand-lime" : "bg-gray-100 dark:bg-brand-navy"}`}
                      style={{ height: `${item.value}%` }}
                    />
                  </View>
                  <Text
                    className={`text-xs mt-3 font-bold ${isPeak ? "text-brand-navy dark:text-white" : "text-gray-400 dark:text-brand-gray"}`}
                  >
                    {item.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(600).delay(700)}
          className="px-2"
        >
          <View className="flex-row justify-between items-center mb-4 px-2">
            <Text className="text-brand-navy dark:text-white font-bold text-xl">
              Daily Reward
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleClaimReward}
            disabled={isClaimed}
            className={`p-5 rounded-[24px] shadow-sm flex-row items-center border border-transparent dark:border-white/5 mb-6 ${
              isClaimed
                ? "bg-gray-50 dark:bg-brand-dark/50"
                : "bg-white dark:bg-brand-dark"
            }`}
          >
            <View
              className={`w-14 h-14 rounded-full items-center justify-center mr-4 ${
                isClaimed
                  ? "bg-gray-200 dark:bg-brand-navy"
                  : "bg-brand-peach/20"
              }`}
            >
              <Flame size={28} color={isClaimed ? "#8A88A4" : "#F9C0AB"} />
            </View>
            <View className="flex-1">
              <Text
                className={`font-bold text-lg ${
                  isClaimed
                    ? "text-gray-400 dark:text-brand-gray"
                    : "text-brand-navy dark:text-white"
                }`}
              >
                {isClaimed ? "Reward Claimed" : "Claim +50 Points"}
              </Text>
              <Text className="text-gray-500 dark:text-brand-gray text-sm mt-0.5">
                {isClaimed ? "Come back tomorrow!" : "Keep your streak alive."}
              </Text>
            </View>
            {!isClaimed && <ChevronRight size={20} color="#8A88A4" />}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
