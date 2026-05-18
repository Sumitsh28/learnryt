import { router } from "expo-router";
import { CheckCircle2, RotateCcw, Sparkles, X } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOut,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface RecommendedCourse {
  title: string;
  description: string;
  reason: string;
}

export default function RecommendationsModal() {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();

  // States: 'form' | 'loading' | 'results'
  const [step, setStep] = useState<"form" | "loading" | "results">("form");

  // Questionnaire Data
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("");
  const [time, setTime] = useState("");

  const [recommendations, setRecommendations] = useState<RecommendedCourse[]>(
    [],
  );
  const [error, setError] = useState("");

  const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced"];
  const TIME_OPTIONS = ["1-2 hours/week", "3-5 hours/week", "5+ hours/week"];

  const handleGenerate = async () => {
    if (!topic || !level || !time) return;

    setStep("loading");
    setError("");

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `You are an elite course advisor for the Learnryt platform. Based on the user's answers, suggest 3 specific, highly-tailored course titles they should look for.
              
              Respond STRICTLY in valid JSON format. Do not include markdown formatting or backticks.
              Schema:
              {
                "courses": [
                  {
                    "title": "Course Title",
                    "description": "A punchy 1-sentence description.",
                    "reason": "Why this specifically fits their skill level and time commitment."
                  }
                ]
              }`,
              },
              {
                role: "user",
                content: `I want to learn about: ${topic}. My skill level is: ${level}. I have ${time} to study.`,
              },
            ],
            temperature: 0.7,
          }),
        },
      );

      const data = await response.json();

      if (data.error) throw new Error(data.error.message);

      const botText = data.choices[0].message.content;
      const parsedData = JSON.parse(botText);

      setRecommendations(parsedData.courses || []);
      setStep("results");
    } catch (err) {
      console.error(err);
      setError("We couldn't connect to the AI engine. Please try again.");
      setStep("form");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-brand-light dark:bg-brand-navy px-6"
      style={{ paddingTop: Math.max(insets.top, 20) + 16 }}
    >
      <View className="flex-row items-center justify-between mb-8 z-10">
        <View className="flex-row items-center">
          <View className="bg-white dark:bg-brand-dark p-2.5 rounded-2xl shadow-sm mr-4 border border-transparent dark:border-white/5">
            <Sparkles
              size={22}
              color={colorScheme === "dark" ? "#C6F432" : "#2A264F"}
            />
          </View>
          <View>
            <Text className="text-brand-navy dark:text-white text-xl font-black tracking-tight">
              AI Course Finder
            </Text>
            <Text className="text-gray-500 dark:text-brand-gray text-xs font-bold tracking-widest mt-0.5">
              POWERED BY LEARNERYT
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-white dark:bg-brand-dark p-3 rounded-full shadow-sm border border-transparent dark:border-white/5"
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

      {step === "form" && (
        <Animated.ScrollView
          entering={FadeInDown.duration(400)}
          exiting={FadeOut.duration(200)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Text className="text-gray-500 dark:text-brand-gray text-base leading-relaxed mb-6 font-medium">
            Answer a few quick questions and our AI will curate the perfect
            learning path for you.
          </Text>

          {error ? (
            <View className="bg-red-500/10 p-4 rounded-2xl mb-6 border border-red-500/20">
              <Text className="text-red-500 font-bold text-center">
                {error}
              </Text>
            </View>
          ) : null}

          <View className="mb-8">
            <Text className="text-brand-navy dark:text-white font-bold text-lg mb-4">
              What do you want to learn?
            </Text>
            <View className="bg-white dark:bg-brand-dark rounded-2xl shadow-sm border border-transparent dark:border-white/5 p-2">
              <TextInput
                className="text-brand-navy dark:text-white text-base font-medium px-4 py-4"
                placeholder="e.g. UI/UX Design, React Native, Marketing..."
                placeholderTextColor="#8A88A4"
                value={topic}
                onChangeText={setTopic}
              />
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-brand-navy dark:text-white font-bold text-lg mb-4">
              What is your current skill level?
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {SKILL_LEVELS.map((lvl) => (
                <TouchableOpacity
                  key={lvl}
                  onPress={() => setLevel(lvl)}
                  className={`px-5 py-3 rounded-full border ${
                    level === lvl
                      ? "bg-brand-navy dark:bg-brand-lime border-brand-navy dark:border-brand-lime"
                      : "bg-white dark:bg-brand-dark border-gray-200 dark:border-white/5"
                  }`}
                >
                  <Text
                    className={`font-bold ${level === lvl ? "text-white dark:text-brand-navy" : "text-gray-500 dark:text-brand-gray"}`}
                  >
                    {lvl}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mb-10">
            <Text className="text-brand-navy dark:text-white font-bold text-lg mb-4">
              How much time can you commit?
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {TIME_OPTIONS.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setTime(t)}
                  className={`px-5 py-3 rounded-full border ${
                    time === t
                      ? "bg-brand-navy dark:bg-brand-peach border-brand-navy dark:border-brand-peach"
                      : "bg-white dark:bg-brand-dark border-gray-200 dark:border-white/5"
                  }`}
                >
                  <Text
                    className={`font-bold ${time === t ? "text-white dark:text-brand-navy" : "text-gray-500 dark:text-brand-gray"}`}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            onPress={handleGenerate}
            disabled={!topic || !level || !time}
            className={`py-5 rounded-[24px] flex-row items-center justify-center shadow-lg active:opacity-80 ${
              !topic || !level || !time
                ? "bg-gray-200 dark:bg-[#232042]"
                : "bg-brand-navy dark:bg-brand-lime"
            }`}
          >
            <Sparkles
              size={20}
              color={
                !topic || !level || !time
                  ? "#8A88A4"
                  : Platform.OS === "ios"
                    ? "#fff"
                    : "#000"
              }
            />
            <Text
              className={`font-black text-lg ml-2 tracking-wide ${
                !topic || !level || !time
                  ? "text-gray-400 dark:text-brand-gray"
                  : "text-white dark:text-brand-navy"
              }`}
            >
              Generate Path
            </Text>
          </TouchableOpacity>
        </Animated.ScrollView>
      )}

      {step === "loading" && (
        <Animated.View
          entering={FadeInUp.duration(400)}
          className="flex-1 items-center justify-center -mt-20"
        >
          <ActivityIndicator
            size="large"
            color={colorScheme === "dark" ? "#C6F432" : "#2A264F"}
          />
          <Text className="text-brand-navy dark:text-white font-bold text-lg mt-6">
            Analyzing your profile...
          </Text>
          <Text className="text-gray-500 dark:text-brand-gray mt-2 text-center px-10 leading-relaxed">
            Searching our database for the best courses matching your {time}{" "}
            schedule.
          </Text>
        </Animated.View>
      )}

      {step === "results" && (
        <Animated.ScrollView
          entering={FadeInUp.duration(600).springify()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          <Text className="text-brand-navy dark:text-white text-2xl font-black mb-6">
            Your Custom Path
          </Text>

          {recommendations.map((course, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(index * 150).duration(500)}
              className="bg-white dark:bg-brand-dark p-6 rounded-[24px] mb-4 shadow-sm border border-transparent dark:border-white/5"
            >
              <View className="flex-row items-center mb-3">
                <CheckCircle2
                  size={20}
                  color={colorScheme === "dark" ? "#C6F432" : "#6E5DE7"}
                />
                <Text
                  className="text-brand-navy dark:text-white font-bold text-lg ml-2 flex-1"
                  numberOfLines={2}
                >
                  {course.title}
                </Text>
              </View>

              <Text className="text-gray-500 dark:text-brand-gray text-sm leading-relaxed font-medium mb-4">
                {course.description}
              </Text>

              <View className="bg-brand-light dark:bg-[#232042] p-4 rounded-xl border-l-4 border-brand-peach">
                <Text className="text-brand-navy dark:text-white text-xs font-bold mb-1">
                  WHY IT FITS YOU:
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                  {course.reason}
                </Text>
              </View>
            </Animated.View>
          ))}

          <TouchableOpacity
            onPress={() => {
              setTopic("");
              setLevel("");
              setTime("");
              setStep("form");
            }}
            className="flex-row items-center justify-center py-4 mt-4"
          >
            <RotateCcw size={16} color="#8A88A4" />
            <Text className="text-gray-500 dark:text-brand-gray font-bold ml-2">
              Start Over
            </Text>
          </TouchableOpacity>
        </Animated.ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}
