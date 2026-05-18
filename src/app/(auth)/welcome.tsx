import { Link } from "expo-router";
import { Rocket, Sparkles, Trophy } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 48;
const GAP = 16;

const SLIDES = [
  {
    id: "1",
    word1: "Learn",
    word2: "Dream",
    word3: "Achieve.",
    description:
      "Education entails acquiring knowledge to have a greater understanding of the world around us.",
    cardColor: "#483DE0",
    foldColor: "#2A238A",
    Icon: Sparkles,
  },
  {
    id: "2",
    word1: "Build",
    word2: "Grow",
    word3: "Succeed.",
    description:
      "Master new skills with interactive courses designed by industry-leading experts.",
    cardColor: "#E03D89",
    foldColor: "#8A2355",
    Icon: Rocket,
  },
  {
    id: "3",
    word1: "Track",
    word2: "Earn",
    word3: "Flex.",
    description:
      "Gamified learning keeps you motivated. Earn points, hit streaks, and climb the ranks.",
    cardColor: "#059669",
    foldColor: "#064E3B",
    Icon: Trophy,
  },
];

export default function WelcomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const scrollViewRef = useRef<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = activeIndexRef.current + 1;
      if (nextIndex >= SLIDES.length) {
        nextIndex = 0;
      }
      scrollViewRef.current?.scrollTo({
        x: nextIndex * (CARD_WIDTH + GAP),
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (CARD_WIDTH + GAP));
    setActiveIndex(index);
    activeIndexRef.current = index;
  };

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

      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled={false}
        snapToInterval={CARD_WIDTH + GAP}
        snapToAlignment="start"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        entering={FadeInDown.duration(800).springify().damping(14)}
        className="mt-12 overflow-visible"
      >
        {SLIDES.map((slide) => (
          <View
            key={slide.id}
            style={{ width: CARD_WIDTH + GAP, paddingRight: GAP }}
          >
            <View
              className="w-full rounded-[40px] p-8 aspect-[3/4] justify-between relative shadow-2xl border-4 border-white dark:border-[#1C1A38]/50 overflow-hidden"
              style={{ backgroundColor: slide.cardColor }}
            >
              <View className="absolute top-10 right-10 opacity-30">
                <slide.Icon size={60} color="#ffffff" strokeWidth={1} />
              </View>

              <View className="mt-8 z-10">
                <View className="bg-white/20 self-start px-3 py-1.5 rounded-full mb-6 flex-row items-center">
                  <Text className="text-white text-xs font-bold tracking-widest uppercase">
                    Learnryt
                  </Text>
                </View>

                <Text className="text-white text-6xl font-black tracking-tighter mb-0 leading-[65px]">
                  {slide.word1}
                </Text>
                <Text className="text-white/50 text-6xl font-black tracking-tighter mb-0 leading-[65px]">
                  {slide.word2}
                </Text>
                <Text className="text-white text-6xl font-black tracking-tighter leading-[65px]">
                  {slide.word3}
                </Text>
              </View>

              <View className="z-10">
                <Text className="text-white/80 text-sm font-medium leading-relaxed pr-8">
                  {slide.description}
                </Text>
              </View>

              <View className="absolute top-0 right-0 w-24 h-24 bg-brand-light dark:bg-brand-navy rounded-bl-[48px] z-20" />
              <View
                className="absolute top-4 right-4 w-14 h-14 rounded-bl-[20px] rounded-tr-[20px] shadow-lg z-20 opacity-80 transform -rotate-12"
                style={{ backgroundColor: slide.foldColor }}
              />
            </View>
          </View>
        ))}
      </Animated.ScrollView>

      <Animated.View
        entering={FadeIn.delay(600)}
        className="flex-row items-center justify-center mt-8 mb-4 gap-2.5"
      >
        {SLIDES.map((_, index) => (
          <View
            key={index}
            className={`h-2.5 rounded-full ${
              activeIndex === index
                ? "w-8 bg-brand-lime"
                : "w-2.5 bg-gray-300 dark:bg-brand-dark"
            }`}
          />
        ))}
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
