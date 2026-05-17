import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import {
  Bell,
  BookOpen,
  Camera,
  ChevronRight,
  LogOut,
  Settings,
  Shield,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { apiClient } from "../../../api/client";
import { useAuth } from "../../../store/useAuth";
import { useBookmarks } from "../../../store/useBookmarks";

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const { bookmarkedIds } = useBookmarks();
  const [isUploading, setIsUploading] = useState(false);

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Needed",
        "We need camera roll permissions to update your avatar.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      uploadAvatar(result.assets[0].uri);
    }
  };

  const uploadAvatar = async (uri: string) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      const filename = uri.split("/").pop() || "avatar.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append("avatar", {
        uri,
        name: filename,
        type,
      } as any);

      const response = await apiClient.patch("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = response.data.data;
      updateUser(updatedUser);
    } catch (error: any) {
      console.error(error.response?.data);
      Alert.alert(
        "Upload Failed",
        "Could not update your avatar. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const MenuRow = ({
    icon: Icon,
    title,
    destructive = false,
    onPress,
  }: any) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-4 border-b border-neutral-900 active:opacity-70"
    >
      <View className="flex-row items-center">
        <View
          className={`p-2 rounded-lg ${destructive ? "bg-red-500/10" : "bg-neutral-900"}`}
        >
          <Icon size={20} color={destructive ? "#ef4444" : "#a3a3a3"} />
        </View>
        <Text
          className={`ml-4 text-base font-medium ${destructive ? "text-red-500" : "text-white"}`}
        >
          {title}
        </Text>
      </View>
      <ChevronRight size={20} color="#525252" />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      className="flex-1 bg-black"
      contentContainerStyle={{ paddingBottom: 40, paddingTop: 40 }}
    >
      <View className="px-6 pt-10 pb-8 items-center border-b border-neutral-900">
        <TouchableOpacity
          onPress={handleImagePick}
          disabled={isUploading}
          className="relative mb-4"
        >
          <View className="w-28 h-28 rounded-full bg-neutral-900 border-2 border-neutral-800 overflow-hidden items-center justify-center">
            {user?.avatar?.url ? (
              <Image
                source={{ uri: user.avatar.url }}
                style={{ width: "100%", height: "100%" }}
                transition={200}
                cachePolicy="memory-disk"
              />
            ) : (
              <Text className="text-neutral-500 text-4xl font-bold uppercase">
                {user?.username?.charAt(0) || "?"}
              </Text>
            )}
          </View>

          <View className="absolute bottom-0 right-0 bg-white p-2 rounded-full border-4 border-black shadow-lg">
            {isUploading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Camera size={16} color="#000" />
            )}
          </View>
        </TouchableOpacity>

        <Text className="text-white text-2xl font-bold">
          {user?.username || "Learner"}
        </Text>
        <Text className="text-neutral-400 mt-1">
          {user?.email || "No email provided"}
        </Text>

        <View className="mt-4 bg-neutral-900 px-4 py-1.5 rounded-full border border-neutral-800">
          <Text className="text-neutral-300 text-xs font-bold uppercase tracking-widest">
            {user?.role || "USER"}
          </Text>
        </View>
      </View>

      <View className="flex-row px-6 py-6 border-b border-neutral-900">
        <View className="flex-1 items-center border-r border-neutral-900">
          <BookOpen size={24} color="#ffffff" className="mb-2" />
          <Text className="text-white text-2xl font-bold">
            {bookmarkedIds.length}
          </Text>
          <Text className="text-neutral-500 text-xs mt-1 uppercase tracking-wider text-center">
            Courses{"\n"}Enrolled
          </Text>
        </View>
        <View className="flex-1 items-center border-r border-neutral-900">
          <Shield size={24} color="#ffffff" className="mb-2" />
          <Text className="text-white text-2xl font-bold">
            {bookmarkedIds.length > 0 ? "12%" : "0%"}
          </Text>
          <Text className="text-neutral-500 text-xs mt-1 uppercase tracking-wider text-center">
            Overall{"\n"}Progress
          </Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-white text-2xl font-bold mt-1 mb-1">🔥</Text>
          <Text className="text-white text-2xl font-bold">3</Text>
          <Text className="text-neutral-500 text-xs mt-1 uppercase tracking-wider text-center">
            Day{"\n"}Streak
          </Text>
        </View>
      </View>

      <View className="px-6 py-4">
        <Text className="text-neutral-500 text-xs font-bold uppercase tracking-wider mb-2 mt-4">
          Account Settings
        </Text>
        <MenuRow icon={Settings} title="Preferences" onPress={() => {}} />
        <MenuRow icon={Bell} title="Notifications" onPress={() => {}} />

        <Text className="text-neutral-500 text-xs font-bold uppercase tracking-wider mb-2 mt-8">
          System
        </Text>
        <MenuRow
          icon={LogOut}
          title="Sign Out"
          destructive={true}
          onPress={() => {
            Alert.alert(
              "Sign Out",
              "Are you sure you want to securely log out?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Sign Out", style: "destructive", onPress: logout },
              ],
            );
          }}
        />
      </View>
    </ScrollView>
  );
}
