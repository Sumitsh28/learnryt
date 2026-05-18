import { useAuth } from "@/store/useAuth";
import { LegendList } from "@legendapp/list";
import { useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import {
  Bookmark,
  Search,
  SlidersHorizontal,
  Sparkles,
  WifiOff,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { apiClient } from "../../../api/client";
import { useBookmarks } from "../../../store/useBookmarks";
import { useEnrollments } from "../../../store/useEnrollments";

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  instructor: {
    name: string;
    avatar: string;
  };
}

const CATEGORIES = [
  "All courses",
  "Graphics design",
  "Flutter Dev",
  "Business",
];

const fetchCourses = async (): Promise<Course[]> => {
  const [productsRes, usersRes] = await Promise.all([
    apiClient.get("/public/randomproducts?page=1&limit=20"),
    apiClient.get("/public/randomusers?page=1&limit=20"),
  ]);

  const products = productsRes.data.data.data;
  const users = usersRes.data.data.data;

  return products.map((product: any, index: number) => {
    let cleanThumbnail = product.thumbnail;

    if (product.thumbnail?.includes("product-images")) {
      cleanThumbnail = `https://images.unsplash.com/photo-${index % 2 === 0 ? "1517336714731-489689fd1ca8" : "1511707171634-5f897ff02aa9"}?auto=format&fit=crop&w=600&q=80`;
    }

    return {
      id: product.id.toString(),
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: cleanThumbnail,
      instructor: {
        name: `${users[index]?.name?.first || "Prof."} ${users[index]?.name?.last || "Expert"}`,
        avatar:
          users[index]?.picture?.medium ||
          "https://randomuser.me/api/portraits/thumb/men/1.jpg",
      },
    };
  });
};

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All courses");
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const { checkIsEnrolled } = useEnrollments();
  const { user } = useAuth();

  const [isSmartSearching, setIsSmartSearching] = useState(false);
  const [smartSearchIds, setSmartSearchIds] = useState<string[] | null>(null);

  const {
    data: courses,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const handleSmartSearch = async () => {
    if (!searchQuery.trim() || !courses) return;
    setIsSmartSearching(true);

    if (Platform.OS !== "web")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const miniCourses = courses.map((c) => ({
        id: c.id,
        title: c.title,
        desc: c.description,
      }));

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
                content: `You are a semantic search engine. The user will provide a query and a JSON list of courses. 
              Find the most relevant courses based on the intent of the query. 
              Return ONLY a valid JSON array of the matching course 'id' strings (e.g., ["1", "5", "12"]). 
              Do NOT include markdown formatting, backticks, or any explanations.`,
              },
              {
                role: "user",
                content: `Query: "${searchQuery}"\n\nCourses: ${JSON.stringify(miniCourses)}`,
              },
            ],
            temperature: 0.1,
          }),
        },
      );

      const data = await response.json();

      let botText = data.choices[0].message.content;
      botText = botText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const ids = JSON.parse(botText);
      setSmartSearchIds(ids);

      if (Platform.OS !== "web")
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Smart Search Error:", error);
      if (Platform.OS !== "web")
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSmartSearching(false);
    }
  };

  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    if (smartSearchIds) {
      return courses.filter((course) => smartSearchIds.includes(course.id));
    }

    if (!searchQuery) return courses;

    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [courses, searchQuery, smartSearchIds]);

  const renderItem = ({ item }: { item: Course }) => {
    const bookmarked = isBookmarked(user?._id, item.id);
    const isEnrolled = checkIsEnrolled(user?._id, item.id);
    const fakeProgress = Math.floor(item.price % 100);

    return (
      <Link href={`/(app)/details/${item.id}`} asChild>
        <TouchableOpacity className="w-full bg-white dark:bg-brand-dark rounded-[32px] p-5 mb-6 shadow-sm active:opacity-90 border border-transparent dark:border-white/5">
          <View className="w-full h-44 bg-brand-light dark:bg-[#232042] rounded-[24px] mb-5 overflow-hidden relative">
            <Image
              source={{
                uri: item.thumbnail || "https://via.placeholder.com/400x200",
              }}
              style={{ position: "absolute", width: "100%", height: "100%" }}
              contentFit="cover"
              transition={300}
            />

            <TouchableOpacity
              className="absolute top-4 right-4 bg-white/90 dark:bg-black/50 p-2.5 rounded-full backdrop-blur-md z-10"
              onPress={() => {
                if (Platform.OS !== "web")
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                if (user?._id) toggleBookmark(user._id, item.id);
              }}
            >
              <Bookmark
                size={18}
                color={
                  bookmarked
                    ? Platform.OS === "ios"
                      ? "#000"
                      : "#C6F432"
                    : "#8A88A4"
                }
                fill={
                  bookmarked
                    ? Platform.OS === "ios"
                      ? "#000"
                      : "#C6F432"
                    : "transparent"
                }
              />
            </TouchableOpacity>
          </View>

          <Text
            className="text-brand-navy dark:text-white text-xl font-bold mb-1"
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text
            className="text-gray-500 dark:text-brand-gray text-sm mb-4 font-medium"
            numberOfLines={1}
          >
            8 chapters • 26 lessons
          </Text>

          <View className="flex-row items-center mb-5">
            <Image
              source={{
                uri:
                  item.instructor.avatar ||
                  "https://randomuser.me/api/portraits/thumb/men/1.jpg",
              }}
              style={{ width: 24, height: 24, borderRadius: 12 }}
              transition={200}
            />
            <Text className="text-brand-navy dark:text-white text-xs font-bold ml-2">
              {item.instructor.name}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-brand-navy dark:text-brand-peach font-bold text-base">
              {isEnrolled ? "Continue ➔" : "View Details ➔"}
            </Text>
            {isEnrolled && (
              <View className="w-11 h-11 rounded-full border-[2.5px] border-brand-lime items-center justify-center">
                <Text className="text-brand-navy dark:text-white text-xs font-bold">
                  {fakeProgress}%
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View className="flex-1 bg-brand-light dark:bg-brand-navy pt-16 px-6">
      <View className="flex-row justify-between items-center mb-8">
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-brand-navy dark:bg-brand-lime items-center justify-center shadow-sm">
            <Text className="text-white dark:text-brand-navy text-xl font-black uppercase">
              {user?.username?.charAt(0) || "U"}
            </Text>
          </View>
          <View className="ml-3">
            <Text className="text-gray-500 dark:text-brand-gray text-sm font-medium">
              Hello,
            </Text>
            <Text className="text-brand-navy dark:text-white text-xl font-extrabold">
              {user?.username || "Learner"} 👋
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/modals/recommendations")}
          className="w-12 h-12 bg-white dark:bg-brand-dark items-center justify-center rounded-2xl shadow-sm border border-transparent dark:border-white/5"
        >
          <Sparkles size={22} color="#C6F432" fill="#C6F432" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center mb-6">
        <View className="flex-1 flex-row items-center bg-white dark:bg-brand-dark h-14 rounded-[20px] px-4 shadow-sm border border-transparent dark:border-white/5 mr-3">
          <Search size={20} color="#8A88A4" />
          <TextInput
            className="flex-1 ml-3 text-brand-navy dark:text-white font-medium text-base"
            placeholder="Search course..."
            placeholderTextColor="#8A88A4"
            value={searchQuery}
            onChangeText={(txt) => {
              setSearchQuery(txt);
              setSmartSearchIds(null);
            }}
            onSubmitEditing={handleSmartSearch}
          />

          {searchQuery.trim().length > 0 && (
            <TouchableOpacity
              onPress={handleSmartSearch}
              disabled={isSmartSearching}
              className={`p-2 rounded-xl ml-2 ${isSmartSearching ? "bg-transparent" : "bg-brand-lime/20 dark:bg-[#232042]"}`}
            >
              {isSmartSearching ? (
                <ActivityIndicator size="small" color="#C6F432" />
              ) : (
                <Sparkles
                  size={16}
                  color="#000"
                  fill={Platform.OS === "ios" ? "#000" : "#C6F432"}
                />
              )}
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity className="h-14 w-14 bg-white dark:bg-brand-dark items-center justify-center rounded-[20px] shadow-sm border border-transparent dark:border-white/5">
          <SlidersHorizontal size={22} color="#8A88A4" />
        </TouchableOpacity>
      </View>

      <View className="mb-6 h-12">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {CATEGORIES.map((cat, index) => {
            const isActive = activeCategory === cat;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => setActiveCategory(cat)}
                className={`h-10 px-5 rounded-full items-center justify-center mr-3 shadow-sm ${
                  isActive
                    ? "bg-brand-navy dark:bg-brand-peach"
                    : "bg-white dark:bg-brand-dark border border-transparent dark:border-white/5"
                }`}
              >
                <Text
                  className={`font-bold text-sm ${isActive ? "text-white dark:text-brand-navy" : "text-gray-500 dark:text-brand-gray"}`}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {smartSearchIds && (
        <View className="flex-row items-center mb-4 px-2">
          <Sparkles size={16} color="#C6F432" fill="#C6F432" />
          <Text className="text-brand-navy dark:text-brand-peach font-bold text-sm ml-2">
            AI Results for "{searchQuery}"
          </Text>
        </View>
      )}

      {/* 📜 Content List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#C6F432" />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center">
          <WifiOff size={40} color="#8A88A4" />
          <Text className="text-brand-navy dark:text-white text-lg font-bold mt-4 mb-2">
            Network Error
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="bg-brand-navy dark:bg-brand-lime px-6 py-3 rounded-full"
          >
            <Text className="text-white dark:text-brand-navy font-bold">
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      ) : filteredCourses.length === 0 ? (
        <View className="flex-1 items-center justify-center mt-10">
          <Search size={40} color="#8A88A4" opacity={0.5} />
          <Text className="text-gray-500 dark:text-brand-gray font-bold mt-4 text-center px-10">
            No courses found matching that criteria.
          </Text>
        </View>
      ) : (
        <LegendList
          data={filteredCourses}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          estimatedItemSize={320}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={refetch}
              tintColor="#C6F432"
            />
          }
        />
      )}
    </View>
  );
}
