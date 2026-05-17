import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Database, Server, Trash2, X } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Switch, Text, TouchableOpacity, View } from "react-native";

export default function DevMenuModal() {
  const [isStaging, setIsStaging] = useState(false);

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
    <View className="flex-1 bg-black pt-6 px-6">
      <View className="flex-row items-center justify-between mb-8">
        <Text className="text-white text-3xl font-extrabold text-red-500">
          Developer Tools
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-neutral-900 p-2 rounded-full"
        >
          <X size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Server size={20} color="#a3a3a3" />
          <View className="ml-3">
            <Text className="text-white font-bold">API Environment</Text>
            <Text className="text-neutral-500 text-xs">
              {isStaging ? "staging.freeapi.app" : "api.freeapi.app"}
            </Text>
          </View>
        </View>
        <Switch
          value={isStaging}
          onValueChange={setIsStaging}
          trackColor={{ false: "#3f3f46", true: "#ef4444" }}
        />
      </View>

      <View className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 flex-row items-center justify-between mb-8">
        <View className="flex-row items-center">
          <Database size={20} color="#a3a3a3" />
          <View className="ml-3">
            <Text className="text-white font-bold">Mock Analytics</Text>
            <Text className="text-neutral-500 text-xs">
              Prevent polluting prod data
            </Text>
          </View>
        </View>
        <Switch
          value={true}
          onValueChange={() => {}}
          trackColor={{ true: "#ef4444" }}
        />
      </View>

      <TouchableOpacity
        onPress={handleWipeData}
        className="bg-red-500/20 py-4 rounded-xl flex-row items-center justify-center border border-red-500/50 active:opacity-80"
      >
        <Trash2 size={20} color="#ef4444" />
        <Text className="text-red-500 font-bold text-lg ml-2">
          Wipe Local State & Restart
        </Text>
      </TouchableOpacity>
    </View>
  );
}
