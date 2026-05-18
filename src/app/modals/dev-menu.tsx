import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Database, Server, Trash2, X } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DevMenuModal() {
  const [isStaging, setIsStaging] = useState(false);
  const { colorScheme } = useColorScheme();

  const handleWipeData = async () => {
    Alert.alert(
      "Nuke Local Data",
      "This will destroy all tokens, bookmarks, and local state. The app will reboot.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Nuke It",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear();
            await SecureStore.deleteItemAsync("accessToken");
            await SecureStore.deleteItemAsync("refreshToken");
            router.replace("/");
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1 bg-brand-light dark:bg-brand-navy pt-8 px-6">
      <View className="flex-row items-center justify-between mb-10">
        <View>
          <Text className="text-brand-navy dark:text-white text-3xl font-black tracking-tight">
            Developer
          </Text>
          <Text className="text-red-500 dark:text-brand-peach text-3xl font-black tracking-tight -mt-2">
            Tools
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-white dark:bg-brand-dark p-3 rounded-full shadow-sm"
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

      <View className="bg-white dark:bg-brand-dark p-5 rounded-[24px] shadow-sm border border-transparent dark:border-white/5 flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="bg-brand-light dark:bg-[#232042] p-2.5 rounded-xl">
            <Server
              size={20}
              color={colorScheme === "dark" ? "#C6F432" : "#2A264F"}
            />
          </View>
          <View className="ml-4">
            <Text className="text-brand-navy dark:text-white font-bold text-base">
              API Environment
            </Text>
            <Text className="text-gray-500 dark:text-brand-gray text-xs mt-0.5">
              {isStaging ? "staging.freeapi.app" : "api.freeapi.app"}
            </Text>
          </View>
        </View>
        <Switch
          value={isStaging}
          onValueChange={setIsStaging}
          trackColor={{ false: "#E5E7EB", true: "#C6F432" }}
          thumbColor={
            Platform.OS === "ios"
              ? "#FFFFFF"
              : colorScheme === "dark"
                ? "#2A264F"
                : "#FFFFFF"
          }
        />
      </View>

      <View className="bg-white dark:bg-brand-dark p-5 rounded-[24px] shadow-sm border border-transparent dark:border-white/5 flex-row items-center justify-between mb-10">
        <View className="flex-row items-center">
          <View className="bg-brand-light dark:bg-[#232042] p-2.5 rounded-xl">
            <Database
              size={20}
              color={colorScheme === "dark" ? "#C6F432" : "#2A264F"}
            />
          </View>
          <View className="ml-4">
            <Text className="text-brand-navy dark:text-white font-bold text-base">
              Mock Analytics
            </Text>
            <Text className="text-gray-500 dark:text-brand-gray text-xs mt-0.5">
              Prevent polluting prod data
            </Text>
          </View>
        </View>
        <Switch
          value={true}
          onValueChange={() => {}}
          trackColor={{ true: "#C6F432" }}
          thumbColor={
            Platform.OS === "ios"
              ? "#FFFFFF"
              : colorScheme === "dark"
                ? "#2A264F"
                : "#FFFFFF"
          }
        />
      </View>

      <TouchableOpacity
        onPress={handleWipeData}
        className="bg-red-50 dark:bg-red-500/10 py-5 rounded-[24px] flex-row items-center justify-center border border-red-200 dark:border-red-500/20 active:opacity-70 shadow-sm"
      >
        <Trash2
          size={20}
          color={colorScheme === "dark" ? "#F87171" : "#DC2626"}
        />
        <Text className="text-red-600 dark:text-red-400 font-bold text-lg ml-3">
          Wipe Local State & Restart
        </Text>
      </TouchableOpacity>
    </View>
  );
}
