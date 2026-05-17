import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import {
  Bell,
  BookOpen,
  Camera,
  ChevronRight,
  Flame,
  LogOut,
  Moon,
  Settings,
  Shield,
  Sun,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { apiClient } from "../../../api/client";
import { useAuth } from "../../../store/useAuth";
import { useBookmarks } from "../../../store/useBookmarks";

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const { getUserBookmarks } = useBookmarks();
  const userBookmarks = getUserBookmarks(user?._id);
  const [isUploading, setIsUploading] = useState(false);

  const { colorScheme, toggleColorScheme } = useColorScheme();

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
    rightElement,
  }: any) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
      className="flex-row items-center justify-between bg-white dark:bg-brand-dark px-5 py-4 mb-3 rounded-2xl shadow-sm border border-transparent dark:border-white/5"
    >
      <View className="flex-row items-center">
        <View
          className={`p-2.5 rounded-xl ${destructive ? "bg-red-500/10" : "bg-brand-light dark:bg-[#232042]"}`}
        >
          <Icon
            size={20}
            color={
              destructive
                ? "#ef4444"
                : colorScheme === "dark"
                  ? "#C6F432"
                  : "#2A264F"
            }
          />
        </View>
        <Text
          className={`ml-4 text-base font-bold ${destructive ? "text-red-500" : "text-brand-navy dark:text-white"}`}
        >
          {title}
        </Text>
      </View>
      {rightElement ? rightElement : <ChevronRight size={20} color="#8A88A4" />}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      className="flex-1 bg-brand-light dark:bg-brand-navy"
      contentContainerStyle={{ paddingBottom: 120, paddingTop: 60 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="px-6 pb-8 items-center">
        <TouchableOpacity
          onPress={handleImagePick}
          disabled={isUploading}
          className="relative mb-4 shadow-sm"
        >
          <View className="w-32 h-32 rounded-[40px] bg-white dark:bg-brand-dark border-4 border-white dark:border-brand-dark overflow-hidden items-center justify-center">
            {user?.avatar?.url ? (
              <Image
                source={{ uri: user.avatar.url }}
                style={{ width: "100%", height: "100%" }}
                transition={200}
                cachePolicy="memory-disk"
              />
            ) : (
              <Text className="text-gray-400 dark:text-brand-gray text-5xl font-bold uppercase">
                {user?.username?.charAt(0) || "?"}
              </Text>
            )}
          </View>

          <View className="absolute -bottom-2 -right-2 bg-brand-lime p-3 rounded-2xl border-4 border-brand-light dark:border-brand-navy shadow-lg">
            {isUploading ? (
              <ActivityIndicator size="small" color="#2A264F" />
            ) : (
              <Camera size={18} color="#2A264F" />
            )}
          </View>
        </TouchableOpacity>

        <Text className="text-brand-navy dark:text-white text-3xl font-black tracking-tight mt-2">
          {user?.username || "Learner"}
        </Text>
        <Text className="text-gray-500 dark:text-brand-gray font-medium mt-1">
          {user?.email || "No email provided"}
        </Text>

        <View className="mt-4 bg-brand-navy dark:bg-brand-peach px-5 py-2 rounded-full shadow-sm">
          <Text className="text-white dark:text-brand-navy text-xs font-bold uppercase tracking-widest">
            {user?.role || "USER"}
          </Text>
        </View>
      </View>

      <View className="flex-row px-4 mb-6 justify-between gap-3">
        <View className="flex-1 bg-white dark:bg-brand-dark rounded-[24px] p-4 items-center shadow-sm border border-transparent dark:border-white/5">
          <BookOpen
            size={24}
            color={colorScheme === "dark" ? "#C6F432" : "#2A264F"}
            className="mb-2"
          />
          <Text className="text-brand-navy dark:text-white text-2xl font-black">
            {userBookmarks.length}
          </Text>
          <Text className="text-gray-500 dark:text-brand-gray text-[10px] mt-1 uppercase font-bold tracking-wider text-center">
            Courses{"\n"}Saved
          </Text>
        </View>

        <View className="flex-1 bg-white dark:bg-brand-dark rounded-[24px] p-4 items-center shadow-sm border border-transparent dark:border-white/5">
          <Shield size={24} color="#6E5DE7" className="mb-2" />
          <Text className="text-brand-navy dark:text-white text-2xl font-black">
            {userBookmarks.length > 0 ? "12%" : "0%"}
          </Text>
          <Text className="text-gray-500 dark:text-brand-gray text-[10px] mt-1 uppercase font-bold tracking-wider text-center">
            Overall{"\n"}Progress
          </Text>
        </View>

        <View className="flex-1 bg-white dark:bg-brand-dark rounded-[24px] p-4 items-center shadow-sm border border-transparent dark:border-white/5">
          <Flame size={24} color="#F9C0AB" className="mb-2" />
          <Text className="text-brand-navy dark:text-white text-2xl font-black">
            3
          </Text>
          <Text className="text-gray-500 dark:text-brand-gray text-[10px] mt-1 uppercase font-bold tracking-wider text-center">
            Day{"\n"}Streak
          </Text>
        </View>
      </View>

      <View className="px-6 py-2">
        <Text className="text-gray-400 dark:text-brand-gray text-xs font-bold uppercase tracking-wider mb-3 ml-2">
          Preferences
        </Text>

        <MenuRow
          icon={colorScheme === "dark" ? Moon : Sun}
          title="Dark Mode"
          rightElement={
            <Switch
              value={colorScheme === "dark"}
              onValueChange={toggleColorScheme}
              trackColor={{ false: "#E5E7EB", true: "#C6F432" }}
              thumbColor={
                Platform.OS === "ios"
                  ? "#FFFFFF"
                  : colorScheme === "dark"
                    ? "#2A264F"
                    : "#FFFFFF"
              }
            />
          }
        />

        <MenuRow icon={Settings} title="Account Settings" onPress={() => {}} />
        <MenuRow icon={Bell} title="Notifications" onPress={() => {}} />

        <Text className="text-gray-400 dark:text-brand-gray text-xs font-bold uppercase tracking-wider mb-3 mt-6 ml-2">
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
