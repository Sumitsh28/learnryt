import { LegendList } from "@legendapp/list";
import { useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Bookmark, Search, WifiOff } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { apiClient } from "../../../api/client";
import { useBookmarks } from "../../../store/useBookmarks";

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

const fetchCourses = async (): Promise<Course[]> => {
  const [productsRes, usersRes] = await Promise.all([
    apiClient.get("/public/randomproducts?page=1&limit=20"),
    apiClient.get("/public/randomusers?page=1&limit=20"),
  ]);

  const products = productsRes.data.data.data;
  const users = usersRes.data.data.data;

  return products.map((product: any, index: number) => ({
    id: product.id.toString(),
    title: product.title,
    description: product.description,
    price: product.price,
    thumbnail: product.thumbnail,
    instructor: {
      name: `${users[index]?.name?.first} ${users[index]?.name?.last}`,
      avatar: users[index]?.picture?.medium,
    },
  }));
};

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toggleBookmark, isBookmarked } = useBookmarks();

  const {
    data: courses,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    if (!searchQuery) return courses;
    return courses.filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [courses, searchQuery]);

  const renderItem = ({ item }: { item: Course }) => {
    const bookmarked = isBookmarked(item.id);

    return (
      <Link href={`/(app)/details/${item.id}`} asChild>
        <TouchableOpacity className="mb-6 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden active:opacity-90">
          <View className="relative w-full h-48 bg-neutral-800">
            <Image
              source={{
                uri: item.thumbnail || "https://via.placeholder.com/400x200",
              }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={300}
            />
            <View className="absolute top-4 left-4 bg-black/80 px-3 py-1 rounded-full border border-neutral-700">
              <Text className="text-white font-bold text-xs">
                ${item.price}
              </Text>
            </View>

            <TouchableOpacity
              className="absolute top-4 right-4 bg-black/60 p-2 rounded-full border border-neutral-700"
              onPress={() => {
                if (Platform.OS !== "web")
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                toggleBookmark(item.id);
              }}
            >
              <Bookmark size={18} />
            </TouchableOpacity>
          </View>

          {/* Details */}
          <View className="p-4">
            <Text
              className="text-white text-lg font-bold mb-1"
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text className="text-neutral-400 text-sm mb-4" numberOfLines={2}>
              {item.description}
            </Text>

            <View className="flex-row items-center border-t border-neutral-800 pt-3">
              <Image
                source={{ uri: item.instructor.avatar }}
                style={{ width: 24, height: 24, borderRadius: 12 }}
              />
              <Text className="text-neutral-300 text-xs font-medium ml-2 uppercase tracking-wider">
                {item.instructor.name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View className="flex-1 bg-black pt-14 px-6">
      <View className="mb-6">
        <Text className="text-white text-3xl font-bold tracking-tight mb-1">
          Discover
        </Text>
        <Text className="text-neutral-400 text-sm">
          Expand your expertise today.
        </Text>
      </View>

      <View className="flex-row items-center bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 mb-6">
        <Search size={20} />
        <TextInput
          className="flex-1 ml-3 text-white text-base"
          placeholder="Search courses..."
          placeholderTextColor="#525252"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center">
          <WifiOff size={40} />
          <Text className="text-white text-lg font-bold mb-2">
            Network Error
          </Text>
          <Text className="text-neutral-400 text-center mb-6">
            Could not load the catalog. Check your connection.
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="bg-white px-6 py-3 rounded-full"
          >
            <Text className="text-black font-bold">Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <LegendList
          data={filteredCourses}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          estimatedItemSize={320}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
}
