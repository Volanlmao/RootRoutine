import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import perenualApi, { ApiToken } from "@/backend/perenualApi";


export default function PlantDetail() {
  const { id } = useLocalSearchParams(); 
  const [plant, setPlant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchPlantDetails = async () => {
    try {
      const response = await perenualApi.get(`/species/details/${id}`, {
        params: {
          key: ApiToken,
        },
      });
      setPlant(response.data);
    } catch (e) {
      console.error("Error fetching plant details:", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlantDetails();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!plant) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500">Plant not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-12">
      {plant.default_image?.original_url && (
        <Image
          source={{ uri: plant.default_image.original_url }}
          className="w-full h-64 rounded-lg mb-4"
          resizeMode="cover"
        />
      )}

      <Text className="text-2xl font-bold text-green-800 mb-1">
        {plant.common_name || "Unnamed Plant"}
      </Text>
      <Text className="text-lg italic text-gray-600 mb-4">
        {plant.scientific_name}
      </Text>

      <Text className="text-base mb-2">
        <Text className="font-semibold text-green-700">Watering: </Text>
        {plant.watering}
      </Text>

      <Text className="text-base mb-2">
        <Text className="font-semibold text-green-700">Sunlight: </Text>
        {plant.sunlight?.join(", ")}
      </Text>

      <Text className="text-base mb-2">
        <Text className="font-semibold text-green-700">Cycle: </Text>
        {plant.cycle}
      </Text>

      <Text className="text-base mb-6">
        <Text className="font-semibold text-green-700">Propagation: </Text>
        {plant.propagation?.join(", ") || "Unknown"}
      </Text>
    </ScrollView>
  );
}
