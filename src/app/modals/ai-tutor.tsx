import { router, useLocalSearchParams } from "expo-router";
import { Bot, Send, X } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function AITutorModal() {
  const { courseName, courseDescription, courseCategory, courseRating } =
    useLocalSearchParams<{
      courseName: string;
      courseDescription: string;
      courseCategory: string;
      courseRating: string;
    }>();

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hello! I am your elite AI Tutor for "${courseName || "this subject"}". I have reviewed the curriculum parameters, structure, and details for this ${courseCategory || "course"}. What concepts can I clarify for you today?`,
    },
  ]);

  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userText,
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

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
                content: `You are an expert, concise AI tutor for a premium learning app named Learnryt. The user is currently studying the course: "${courseName}". Course Metadata - Category: ${courseCategory}, Rating: ${courseRating}. Course Syllabus & Details: "${courseDescription}". Fully understand this background context and refer to these specific subject topics when explaining concepts. Keep responses under 3 short paragraphs. Be encouraging, precise, and highly technical.`,
              },
              ...messages.map((m) => ({ role: m.role, content: m.content })),
              { role: "user", content: userText },
            ],
          }),
        },
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const botText = data.choices[0].message.content;
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "assistant", content: botText },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "I'm having trouble connecting to my knowledge base right now. Please check your network or API key.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === "user";
    return (
      <Animated.View
        entering={FadeInDown.duration(400)}
        className={`flex-row mb-5 ${isUser ? "justify-end" : "justify-start"}`}
      >
        {!isUser && (
          <View className="w-8 h-8 rounded-full bg-brand-light dark:bg-brand-dark items-center justify-center mr-3 border border-gray-200 dark:border-white/5 shadow-sm">
            <Bot size={16} color={Platform.OS === "ios" ? "#000" : "#8A88A4"} />
          </View>
        )}
        <View
          className={`max-w-[80%] rounded-3xl p-4 shadow-sm ${
            isUser
              ? "bg-brand-navy dark:bg-brand-peach rounded-tr-sm"
              : "bg-white dark:bg-[#232042] border border-transparent dark:border-white/5 rounded-tl-sm"
          }`}
        >
          <Text
            className={`text-base font-medium leading-relaxed ${
              isUser
                ? "text-white dark:text-brand-navy"
                : "text-brand-navy dark:text-white"
            }`}
          >
            {item.content}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-brand-light dark:bg-brand-navy"
    >
      <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-gray-200 dark:border-brand-dark bg-brand-light dark:bg-brand-navy z-10">
        <View className="flex-row items-center">
          <View className="bg-white dark:bg-brand-dark p-2.5 rounded-2xl shadow-sm mr-4">
            <Bot size={22} color={Platform.OS === "ios" ? "#000" : "#8A88A4"} />
          </View>
          <View>
            <Text className="text-brand-navy dark:text-white text-xl font-bold">
              AI Tutor
            </Text>
            <Text className="text-brand-lime text-xs font-bold uppercase tracking-widest mt-0.5">
              Online
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-white dark:bg-brand-dark p-2.5 rounded-full shadow-sm"
        >
          <X size={20} color={Platform.OS === "ios" ? "#000" : "#8A88A4"} />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        showsVerticalScrollIndicator={false}
      />

      <View className="px-6 py-4 border-t border-gray-200 dark:border-brand-dark bg-brand-light dark:bg-brand-navy pb-10">
        <View className="flex-row items-center bg-white dark:bg-brand-dark rounded-3xl border border-transparent dark:border-white/5 p-2 shadow-sm">
          <TextInput
            className="flex-1 text-brand-navy dark:text-white text-base font-medium px-4 py-3"
            placeholder="Ask a question..."
            placeholderTextColor="#8A88A4"
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!input.trim() || isLoading}
            className={`w-12 h-12 rounded-2xl items-center justify-center shadow-sm ${
              !input.trim()
                ? "bg-gray-100 dark:bg-[#232042]"
                : "bg-brand-navy dark:bg-brand-lime"
            }`}
          >
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color={
                  !input.trim()
                    ? "#8A88A4"
                    : Platform.OS === "ios"
                      ? "#fff"
                      : "#000"
                }
              />
            ) : (
              <Send
                size={20}
                color={
                  !input.trim()
                    ? "#8A88A4"
                    : Platform.OS === "ios"
                      ? "#fff"
                      : "#000"
                }
                className="ml-1"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
