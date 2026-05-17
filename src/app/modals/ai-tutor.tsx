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
  const { courseName } = useLocalSearchParams<{ courseName: string }>();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hello! I am your elite AI Tutor. You are currently viewing the course: "${courseName || "this subject"}". What concepts can I clarify for you today?`,
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
                content: `You are an expert, concise AI tutor for a premium learning app. The user is currently studying: ${courseName}. Keep responses under 3 short paragraphs. Be encouraging and highly technical.`,
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
        className={`flex-row mb-4 ${isUser ? "justify-end" : "justify-start"}`}
      >
        {!isUser && (
          <View className="w-8 h-8 rounded-full bg-neutral-800 items-center justify-center mr-2 border border-neutral-700">
            <Bot size={16} color="#ffffff" />
          </View>
        )}
        <View
          className={`max-w-[80%] rounded-2xl p-4 ${isUser ? "bg-white" : "bg-neutral-900 border border-neutral-800"}`}
        >
          <Text className={`text-base ${isUser ? "text-black" : "text-white"}`}>
            {item.content}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-black"
    >
      <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-900 bg-black z-10">
        <View className="flex-row items-center">
          <View className="bg-neutral-900 p-2 rounded-full border border-neutral-800 mr-3">
            <Bot size={20} color="#a3a3a3" />
          </View>
          <View>
            <Text className="text-white text-lg font-bold">AI Tutor</Text>
            <Text className="text-green-400 text-xs font-bold uppercase tracking-wider">
              Online
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-neutral-900 p-2 rounded-full"
        >
          <X size={20} color="#ffffff" />
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

      <View className="px-6 py-4 border-t border-neutral-900 bg-black pb-10">
        <View className="flex-row items-center bg-neutral-900 rounded-2xl border border-neutral-800 p-2">
          <TextInput
            className="flex-1 text-white text-base px-4 py-3"
            placeholder="Ask a question..."
            placeholderTextColor="#525252"
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!input.trim() || isLoading}
            className={`w-12 h-12 rounded-xl items-center justify-center ${!input.trim() ? "bg-neutral-800" : "bg-white"}`}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Send
                size={20}
                color={!input.trim() ? "#525252" : "#000"}
                className="ml-1"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
