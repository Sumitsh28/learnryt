import { Link } from "expo-router";
import { Shield, Sparkles, Zap } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

export default function WelcomeScreen() {
  const FeatureItem = ({ icon: Icon, title, subtitle, delay }: any) => (
    <Animated.View
      entering={FadeInDown.duration(600).delay(delay)}
      className="flex-row items-center mb-6"
    >
      <View className="bg-neutral-900 p-3 rounded-2xl border border-neutral-800">
        <Icon size={24} color="#ffffff" />
      </View>
      <View className="ml-4 flex-1">
        <Text className="text-white text-lg font-bold">{title}</Text>
        <Text className="text-neutral-400 text-sm">{subtitle}</Text>
      </View>
    </Animated.View>
  );

  return (
    <View className="flex-1 bg-black px-6 pt-20 pb-10">
      {/* Hero Section */}
      <Animated.View entering={FadeIn.duration(800)} className="mb-12 mt-8">
        <Text className="text-white text-5xl font-extrabold tracking-tighter mb-2">
          Master{"\n"}Your Craft.
        </Text>
        <Text className="text-neutral-400 text-base leading-relaxed mt-4">
          Join the elite community of continuous learners. Access world-class
          courses, instantly.
        </Text>
      </Animated.View>

      {/* Features List */}
      <View className="flex-1 mt-4">
        <FeatureItem
          icon={Zap}
          title="Lightning Fast"
          subtitle="60fps native performance and offline caching."
          delay={200}
        />
        <FeatureItem
          icon={Shield}
          title="Secure & Private"
          subtitle="Enterprise-grade token management."
          delay={400}
        />
        <FeatureItem
          icon={Sparkles}
          title="Premium UX"
          subtitle="Fluid animations and haptic feedback."
          delay={600}
        />
      </View>

      {/* Call to Action Buttons */}
      <Animated.View
        entering={FadeInDown.duration(600).delay(800)}
        className="w-full"
      >
        <Link href="/(auth)/register" asChild>
          <TouchableOpacity className="bg-white py-4 rounded-2xl items-center justify-center mb-4 active:opacity-80">
            <Text className="text-black text-lg font-bold">Get Started</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(auth)/login" asChild>
          <TouchableOpacity className="bg-transparent py-4 rounded-2xl items-center justify-center border border-neutral-800 active:bg-neutral-900">
            <Text className="text-white text-lg font-bold">
              I already have an account
            </Text>
          </TouchableOpacity>
        </Link>
      </Animated.View>
    </View>
  );
}
