import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";
import { apiClient } from "../../api/client";
import { useAuth } from "../../store/useAuth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [serverError, setServerError] = useState<string | null>(null);
  const login = useAuth((state) => state.login);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    setServerError(null);
    try {
      const response = await apiClient.post("/users/login", {
        email: data.email,
        password: data.password,
      });

      console.log(
        "✅ LOGIN SUCCESS! Raw Payload:",
        JSON.stringify(response.data.data, null, 2),
      );

      const { user, accessToken, refreshToken } = response.data.data;

      await login(user, accessToken, refreshToken);
    } catch (error: any) {
      console.error("❌ LOGIN FAILED:", error.response?.data);
      setServerError(error.response?.data?.message || "Unable to log in.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-black px-6 justify-center"
    >
      <View className="mb-10">
        <Text className="text-white text-4xl font-bold tracking-tight mb-2">
          Welcome Back
        </Text>
        <Text className="text-gray-400 text-base">
          Sign in to continue your journey.
        </Text>
      </View>

      {serverError && (
        <View className="bg-red-500/20 p-4 rounded-xl border border-red-500/50 mb-6">
          <Text className="text-red-400 text-sm font-medium">
            {serverError}
          </Text>
        </View>
      )}

      <View className="mb-6">
        <Text className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">
          Email
        </Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`bg-neutral-900 text-white p-4 rounded-xl border ${
                errors.email ? "border-red-500" : "border-neutral-800"
              }`}
              placeholder="name@example.com"
              placeholderTextColor="#525252"
              autoCapitalize="none"
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-400 text-xs mt-2">
            {errors.email.message}
          </Text>
        )}
      </View>

      <View className="mb-8">
        <Text className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">
          Password
        </Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`bg-neutral-900 text-white p-4 rounded-xl border ${
                errors.password ? "border-red-500" : "border-neutral-800"
              }`}
              placeholder="••••••••"
              placeholderTextColor="#525252"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.password && (
          <Text className="text-red-400 text-xs mt-2">
            {errors.password.message}
          </Text>
        )}
      </View>

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        className={`bg-white p-4 rounded-xl items-center justify-center ${
          isSubmitting ? "opacity-70" : "active:opacity-80"
        }`}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text className="text-black font-bold text-lg">Sign In</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center mt-8">
        <Text className="text-gray-400">New here? </Text>
        <Link href="/(auth)/register" asChild>
          <TouchableOpacity>
            <Text className="text-white font-bold">Create an account</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}
