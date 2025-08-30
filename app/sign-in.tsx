import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { account } from "@/backend/appwrite";
import { ID } from "react-native-appwrite";
import { KeyboardAvoidingView } from "react-native";
import icons from "@/constants/icons";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const SignIn = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [usernameValid, setUsernameValid] = useState<boolean>(false);
  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [passwordValid, setPasswordValid] = useState<boolean>(false);

  // regex
  const validateUsername = (text: string) => {
    const isValid = /^[a-zA-Z0-9]{3,}$/.test(text);
    setUsernameValid(isValid);
    setName(text);
  };

  const validateEmail = (text: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
    setEmailValid(isValid);
    setEmail(text);
  };

  const validatePassword = (text: string) => {
    const isValid = text.length > 8;
    setPasswordValid(isValid);
    setPassword(text);
  };

  const handleSignIn = async () => {
    try {
      const response = await account.create(ID.unique(), email, password, name);
      if (response) {
        router.push("/(tabs)/main");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-[#fdddbd]">
      <TouchableOpacity
        className="absolute top-12 left-6 z-10"
        onPress={() => router.push("/")}
      >
        <Ionicons name="arrow-back" size={28} color="#448f49" />
      </TouchableOpacity>

      <View className="flex-1 px-6 justify-center items-center">
        <Image source={icons.logo} className="mb-10 h-[250px] w-[250px]" />
        <Text className="mb-10 text-[#448f49] font-bold text-[42px]">
          Sign Up
        </Text>

        <View className="w-full mb-4">
          <TextInput
            className={`w-full p-4 rounded-lg bg-[#05212A] text-white border ${
              name
                ? usernameValid
                  ? "border-green-500"
                  : "border-red-500"
                : "border-gray-300 "
            }`}
            placeholder="Username.."
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={validateUsername}
          />
          {name && !usernameValid && (
            <Text className="text-red-500 mt-1">
              Username must be at least 3 characters
            </Text>
          )}
        </View>

        <View className="w-full mb-4">
          <TextInput
            className={`w-full p-4 rounded-lg bg-[#05212A] text-white border border-[#448f49] ${
              email
                ? emailValid
                  ? "border-green-500"
                  : "border-red-500"
                : "border-gray-300 "
            }`}
            placeholder="Email.."
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={validateEmail}
          />
          {email && !emailValid && (
            <Text className="text-red-500 mt-1">Email must be valid</Text>
          )}
        </View>

        <View className="w-full mb-4">
          <View className="relative">
            <TextInput
              className={`w-full p-4 rounded-lg bg-[#05212A] text-white border border-[#448f49]  ${
                password
                  ? passwordValid
                    ? "border-green-500"
                    : "border-red-500"
                  : "border-gray-300 "
              }`}
              placeholder="Password.."
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={validatePassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4"
            >
              <Text className="text-gray-600">
                {" "}
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
          {password && !passwordValid && (
            <Text className="text-red-500 mt-1">
              Password me be at least 8 characters
            </Text>
          )}
        </View>

        <TouchableOpacity
          className={`w-full p-4 rounded-lg ${
            usernameValid && passwordValid && emailValid
              ? "bg-[#05212A]"
              : "bg-gray-500"
          }`}
          onPress={handleSignIn}
          disabled={!usernameValid || !passwordValid || !emailValid}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Create Account
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
