import {
  View,
  Text,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { account } from "@/backend/appwrite";
import { router } from "expo-router";
import { useState } from "react";
import icons from "@/constants/icons";
import { Ionicons } from "@expo/vector-icons";

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await account.createEmailPasswordSession(
        email,
        password
      );
      console.log(response);
      Alert.alert("Success", "Your have succesfully logged in!");
      if (response) {
        router.push("/main");
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView className="flex-1 justify-center items-center gap-8 bg-[#fdddbd]">
      <TouchableOpacity
        className="absolute top-12 left-6 z-10"
        onPress={() => router.push("/")}
      >
        <Ionicons name="arrow-back" size={28} color="#448f49" />
      </TouchableOpacity>

      <Image source={icons.logo} className="mb-10 h-[250px] w-[250px]" />
      <Text className="text-[#448f49] font-bold text-[42px]">Login</Text>

      <View className="relative w-[90%]">
        <TextInput
          className="w-full p-4 rounded-lg bg-[#05212A] text-white border border-[#448f49]"
          placeholder="Email..."
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View className="relative w-[90%]">
        <TextInput
          className="w-full p-4 rounded-lg bg-[#05212A] text-white border border-[#448f49]"
          placeholder="Password..."
          placeholderTextColor="#9CA3AF"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-4"
        >
          <Text className="text-gray-600">
            {showPassword ? "Hide" : "Show"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className={`bg-[#05212A] px-7 rounded-lg py-4 w-[90%]`}
        onPress={handleLogin}
      >
        <Text className="text-white text-xl text-center">Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default login;
