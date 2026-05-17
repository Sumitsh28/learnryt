import { Link } from "expo-router";
import { Sparkles } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

export default function WelcomeScreen() {
  return (
    <View className="flex-1 bg-brand-light dark:bg-brand-navy overflow-hidden px-6 pt-16 pb-12">
      <Animated.View
        entering={FadeIn.duration(1000)}
        className="absolute -top-16 -left-10 w-64 h-64 bg-brand-peach rounded-full opacity-90"
      />
      <Animated.View
        entering={FadeIn.duration(1000).delay(200)}
        className="absolute top-10 -right-20 w-48 h-48 bg-brand-peach rounded-full opacity-60"
      />

      <Animated.View
        entering={FadeInDown.duration(800).springify().damping(14)}
        className="w-full bg-[#483DE0] rounded-[40px] p-8 aspect-[3/4] justify-between relative mt-12 shadow-2xl border-4 border-white dark:border-[#1C1A38]/50 overflow-hidden"
      >
        <View className="absolute top-10 right-10 opacity-30">
          <Sparkles size={60} color="#ffffff" strokeWidth={1} />
        </View>

        <View className="mt-8 z-10">
          <View className="bg-white/20 self-start px-3 py-1.5 rounded-full mb-6 flex-row items-center">
            <Text className="text-white text-xs font-bold tracking-widest uppercase">
              Elite LMS
            </Text>
          </View>

          <Text className="text-white text-6xl font-black tracking-tighter mb-0 leading-[65px]">
            Learn
          </Text>

          <Text className="text-white/50 text-6xl font-black tracking-tighter mb-0 leading-[65px]">
            Dream
          </Text>
          <Text className="text-white text-6xl font-black tracking-tighter leading-[65px]">
            Achieve.
          </Text>
        </View>

        <View className="z-10">
          <Text className="text-white/80 text-sm font-medium leading-relaxed pr-8">
            Education entails acquiring knowledge to have a greater
            understanding of the world around us.
          </Text>
        </View>

        <View className="absolute top-0 right-0 w-24 h-24 bg-brand-light dark:bg-brand-navy rounded-bl-[48px] z-20" />
        <View className="absolute top-4 right-4 w-14 h-14 bg-[#2A238A] rounded-bl-[20px] rounded-tr-[20px] shadow-lg z-20 opacity-80 transform -rotate-12" />
      </Animated.View>

      <Animated.View
        entering={FadeIn.delay(600)}
        className="flex-row items-center justify-center mt-10 gap-2.5"
      >
        <View className="w-8 h-2.5 rounded-full bg-brand-lime" />
        <View className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-brand-dark" />
        <View className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-brand-dark" />
      </Animated.View>

      <View className="w-full mt-auto">
        <Animated.View entering={FadeInDown.duration(600).delay(800)}>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity className="bg-brand-lime py-5 rounded-full items-center justify-center shadow-lg active:opacity-80 mb-4">
              <Text className="text-brand-navy font-black text-xl tracking-wide">
                Start Learning
              </Text>
            </TouchableOpacity>
          </Link>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(900)}>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity className="py-4 items-center justify-center active:opacity-60">
              <Text className="text-gray-500 dark:text-brand-gray font-bold text-base">
                I already have an account
              </Text>
            </TouchableOpacity>
          </Link>
        </Animated.View>
      </View>
    </View>
  );
}
