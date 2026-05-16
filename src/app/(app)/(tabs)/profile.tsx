import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import {
  Bell,
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

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [localAvatar, setLocalAvatar] = useState<string | null>(
    user?.avatar?.url || null,
  );

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
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
      const uri = result.assets[0].uri;
      setLocalAvatar(uri);
      uploadAvatar(uri);
    }
  };

  const uploadAvatar = async (uri: string) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      const filename = uri.split("/").pop() || "avatar.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append("avatar", {
        uri,
        name: filename,
        type,
      } as any);

      await apiClient.patch("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      Alert.alert(
        "Upload Failed",
        "Could not update your avatar. Please try again.",
      );
      setLocalAvatar(user?.avatar?.url || null);
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
      className="flex-row items-center justify-between py-4 border-b border-neutral-900"
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
      <ChevronRight size={20} />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      className="flex-1 bg-black"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View className="px-6 pt-16 pb-8 items-center border-b border-neutral-900">
        <TouchableOpacity
          onPress={handleImagePick}
          disabled={isUploading}
          className="relative mb-4"
        >
          <View className="w-28 h-28 rounded-full bg-neutral-900 border-2 border-neutral-800 overflow-hidden items-center justify-center">
            {localAvatar ? (
              <Image
                source={{ uri: localAvatar }}
                style={{ width: "100%", height: "100%" }}
                transition={200}
              />
            ) : (
              <Text className="text-neutral-500 text-3xl font-bold">
                {user?.username?.charAt(0).toUpperCase() || "?"}
              </Text>
            )}
          </View>

          <View className="absolute bottom-0 right-0 bg-white p-2 rounded-full border-4 border-black">
            {isUploading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Camera size={14} />
            )}
          </View>
        </TouchableOpacity>

        <Text className="text-white text-2xl font-bold">
          {user?.username || "Learner"}
        </Text>
        <Text className="text-neutral-400 mt-1">
          {user?.email || "No email provided"}
        </Text>

        <View className="mt-4 bg-neutral-900 px-4 py-1.5 rounded-full">
          <Text className="text-neutral-300 text-xs font-bold uppercase tracking-widest">
            {user?.role || "USER"}
          </Text>
        </View>
      </View>

      <View className="flex-row px-6 py-6 border-b border-neutral-900">
        <View className="flex-1 items-center border-r border-neutral-900">
          <Text className="text-white text-xl font-bold">12</Text>
          <Text className="text-neutral-500 text-xs mt-1 uppercase tracking-wider">
            Courses
          </Text>
        </View>
        <View className="flex-1 items-center border-r border-neutral-900">
          <Text className="text-white text-xl font-bold">4</Text>
          <Text className="text-neutral-500 text-xs mt-1 uppercase tracking-wider">
            Certificates
          </Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-white text-xl font-bold">🔥 3</Text>
          <Text className="text-neutral-500 text-xs mt-1 uppercase tracking-wider">
            Day Streak
          </Text>
        </View>
      </View>

      <View className="px-6 py-4">
        <Text className="text-neutral-500 text-xs font-bold uppercase tracking-wider mb-2 mt-4">
          Account Settings
        </Text>
        <MenuRow icon={Settings} title="Preferences" onPress={() => {}} />
        <MenuRow icon={Bell} title="Notifications" onPress={() => {}} />
        <MenuRow icon={Shield} title="Privacy & Security" onPress={() => {}} />

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
