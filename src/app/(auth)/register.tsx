import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";
import { apiClient } from "../../api/client";
import { useAuth } from "../../store/useAuth";

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const [serverError, setServerError] = useState<string | null>(null);
  const login = useAuth((state) => state.login);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  const onSubmit = async (data: RegisterForm) => {
    setServerError(null);
    try {
      await apiClient.post("/users/register", {
        username: data.username,
        email: data.email,
        password: data.password,
        role: "USER",
      });

      const loginResponse = await apiClient.post("/users/login", {
        email: data.email,
        password: data.password,
      });

      const { user, accessToken, refreshToken } = loginResponse.data.data;
      await login(user, accessToken, refreshToken);
    } catch (error: any) {
      setServerError(
        error.response?.data?.message ||
          "Unable to create account. Username or email may be taken.",
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-brand-light dark:bg-brand-navy"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-10 mt-12">
          <Text className="text-brand-navy dark:text-white text-4xl font-black tracking-tight mb-2">
            Create Account
          </Text>
          <Text className="text-gray-500 dark:text-brand-gray text-base font-medium">
            Join the elite learning platform.
          </Text>
        </View>

        {serverError && (
          <View className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20 mb-6">
            <Text className="text-red-500 dark:text-red-400 text-sm font-bold text-center">
              {serverError}
            </Text>
          </View>
        )}

        <View className="mb-6">
          <Text className="text-gray-400 dark:text-brand-gray text-xs uppercase font-bold tracking-wider mb-2 ml-1">
            Username
          </Text>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`bg-white dark:bg-brand-dark text-brand-navy dark:text-white p-4 rounded-2xl border shadow-sm ${
                  errors.username
                    ? "border-red-500"
                    : "border-gray-200 dark:border-white/5"
                }`}
                placeholder="creative_genius"
                placeholderTextColor="#8A88A4"
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.username && (
            <Text className="text-red-500 dark:text-red-400 text-xs mt-2 ml-1 font-medium">
              {errors.username.message}
            </Text>
          )}
        </View>

        <View className="mb-6">
          <Text className="text-gray-400 dark:text-brand-gray text-xs uppercase font-bold tracking-wider mb-2 ml-1">
            Email
          </Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`bg-white dark:bg-brand-dark text-brand-navy dark:text-white p-4 rounded-2xl border shadow-sm ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-200 dark:border-white/5"
                }`}
                placeholder="name@example.com"
                placeholderTextColor="#8A88A4"
                autoCapitalize="none"
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.email && (
            <Text className="text-red-500 dark:text-red-400 text-xs mt-2 ml-1 font-medium">
              {errors.email.message}
            </Text>
          )}
        </View>

        <View className="mb-10">
          <Text className="text-gray-400 dark:text-brand-gray text-xs uppercase font-bold tracking-wider mb-2 ml-1">
            Password
          </Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`bg-white dark:bg-brand-dark text-brand-navy dark:text-white p-4 rounded-2xl border shadow-sm ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-200 dark:border-white/5"
                }`}
                placeholder="••••••••"
                placeholderTextColor="#8A88A4"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.password && (
            <Text className="text-red-500 dark:text-red-400 text-xs mt-2 ml-1 font-medium">
              {errors.password.message}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className={`bg-brand-navy dark:bg-brand-lime py-5 rounded-full items-center justify-center shadow-lg ${
            isSubmitting ? "opacity-70" : "active:opacity-80"
          }`}
        >
          {isSubmitting ? (
            <ActivityIndicator
              color={Platform.OS === "ios" ? "#ffffff" : "#000000"}
            />
          ) : (
            <Text className="text-white dark:text-brand-navy font-black text-lg tracking-wide">
              Sign Up
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-10 mb-12">
          <Text className="text-gray-500 dark:text-brand-gray font-medium">
            Already have an account?{" "}
          </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text className="text-brand-navy dark:text-brand-peach font-bold">
                Sign in
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
