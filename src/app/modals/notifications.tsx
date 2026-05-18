import { router } from "expo-router";
import { BellRing, BookOpen, X } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { Platform, Switch, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NotificationsModal() {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();

  const [courseNotifs, setCourseNotifs] = useState(true);
  const [inactivityNotifs, setInactivityNotifs] = useState(true);

  return (
    <View
      className="flex-1 bg-brand-light dark:bg-brand-navy px-6"
      style={{ paddingTop: Math.max(insets.top, 20) + 16 }}
    >
      <View className="flex-row items-center justify-between mb-10">
        <View>
          <Text className="text-brand-navy dark:text-white text-3xl font-black tracking-tight">
            Notification
          </Text>
          <Text className="text-brand-lime dark:text-brand-peach text-3xl font-black tracking-tight -mt-2">
            Settings
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-white dark:bg-brand-dark p-3 rounded-full shadow-sm"
        >
          <X
            size={20}
            color={
              colorScheme === "dark"
                ? Platform.OS === "ios"
                  ? "#fff"
                  : "#8A88A4"
                : "#2A264F"
            }
          />
        </TouchableOpacity>
      </View>

      <View className="bg-white dark:bg-brand-dark p-5 rounded-[24px] shadow-sm border border-transparent dark:border-white/5 flex-row items-center justify-between mb-4">
        <View className="flex-row items-center flex-1 pr-4">
          <View className="bg-brand-light dark:bg-[#232042] p-2.5 rounded-xl">
            <BookOpen
              size={20}
              color={colorScheme === "dark" ? "#C6F432" : "#2A264F"}
            />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-brand-navy dark:text-white font-bold text-base">
              Course Updates
            </Text>
            <Text className="text-gray-500 dark:text-brand-gray text-xs mt-0.5 leading-relaxed">
              New lessons, live classes, and curriculum announcements
            </Text>
          </View>
        </View>
        <Switch
          value={courseNotifs}
          onValueChange={setCourseNotifs}
          trackColor={{ false: "#E5E7EB", true: "#C6F432" }}
          thumbColor={
            Platform.OS === "ios"
              ? "#FFFFFF"
              : colorScheme === "dark"
                ? "#2A264F"
                : "#FFFFFF"
          }
        />
      </View>

      <View className="bg-white dark:bg-brand-dark p-5 rounded-[24px] shadow-sm border border-transparent dark:border-white/5 flex-row items-center justify-between mb-4">
        <View className="flex-row items-center flex-1 pr-4">
          <View className="bg-brand-light dark:bg-[#232042] p-2.5 rounded-xl">
            <BellRing
              size={20}
              color={colorScheme === "dark" ? "#C6F432" : "#2A264F"}
            />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-brand-navy dark:text-white font-bold text-base">
              Daily Reminder
            </Text>
            <Text className="text-gray-500 dark:text-brand-gray text-xs mt-0.5 leading-relaxed">
              Get an alert if you haven't opened the app in 24 hours
            </Text>
          </View>
        </View>
        <Switch
          value={inactivityNotifs}
          onValueChange={setInactivityNotifs}
          trackColor={{ false: "#E5E7EB", true: "#C6F432" }}
          thumbColor={
            Platform.OS === "ios"
              ? "#FFFFFF"
              : colorScheme === "dark"
                ? "#2A264F"
                : "#FFFFFF"
          }
        />
      </View>
    </View>
  );
}
