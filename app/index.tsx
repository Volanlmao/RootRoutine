import { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import icons from "@/constants/icons";
import perenualApi, { perenualToken } from "@/backend/perenualApi";

export default function Index() {
  return (
    <View className="flex-1 bg-white px-4 pt-12">
      <Text className="text-2xl font-bold text-green-700 mb-4">
        <Image source={icons.logo} className="h-[15px] w-[15px]" /> RootRoutine
      </Text>
    </View>
  );
}
