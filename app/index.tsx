import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState } from "react";
import icons from "@/constants/icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { login} from "@/backend/appwrite";
import { useAppwriteContext } from "@/backend/appwriteContextProvider";
const index = () => {

    const { loading, isLoggedIn } = useAppwriteContext();
    
    useEffect(() => {
      if (!loading && isLoggedIn) return router.replace("/main");
    });
  
    const handleSignInGoogle = async () => {
      const result = await login();
      if (result) {
        router.replace("/(tabs)/main");
      } else {
        Alert.alert("Error");
      }
    };
  
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#fdddbd]">
      <Image source={icons.logo} className="mb-10 h-[250px] w-[250px]" />

        <Text className="text-[#448f49] font-bold text-[42px]">Welcome</Text>
        <Text className="text-[#05212A] text-[20px] mb-8 font-semibold">Nurture every <Text className="text-[#448f49] text-[20px] mb-8 font-semibold">leaf</Text></Text>
  
        <TouchableOpacity className="mt-2 bg-[#05212A] px-7 py-4 w-[90%] rounded-lg">
          <Link href={"/sign-in"} className="text-gray-300 text-xl text-center">
            Create Account
          </Link>
        </TouchableOpacity>
  
        <TouchableOpacity className="mt-2 bg-[#05212A] px-7 py-4 w-[90%] rounded-lg">
          <Link href={"/login"} className="text-gray-300 text-xl text-center">
            Login
          </Link>
        </TouchableOpacity>
  
        <TouchableOpacity
          className="mt-2 bg-[#05212A] px-7 py-4 w-[90%] rounded-lg"
          onPress={handleSignInGoogle}
        >
          <Text className="text-gray-300 text-xl text-center">Login with Google</Text>
        </TouchableOpacity>
        
      </SafeAreaView>
    );
  };

export default index