import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { ApiToken, perenualApi, perenualGuideApi } from "@/backend/perenualApi";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PlantDetail() {
  const { id } = useLocalSearchParams();
  const [plantDetails, setPlantDetails] = useState<any>(null);
  const [careGuide, setCareGuide] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchPlantDetails = async () => {
    try {
      const response = await perenualApi.get(`/species/details/${id}`, {
        params: { key: ApiToken },
      });
      setPlantDetails(response.data);
    } catch (e) {
      console.error("Error fetching plant details:", (e as Error).message);
    }
  };

  const fetchPlantGuides = async () => {
    try {
      const response = await perenualGuideApi.get("/species-care-guide-list", {
        params: {
          key: ApiToken,
          species_id: parseInt(id as string),
        },
      });
      setCareGuide(response.data.data?.[0]);
    } catch (e: any) {
      console.error("Guide fetch error:", e.response?.data || e.message);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      await fetchPlantDetails();
      await fetchPlantGuides();
      setLoading(false);
    };
    fetchAll();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#fdddbd]">
        <ActivityIndicator size="large" className="text-green-800" />
      </View>
    );
  }

  if (!plantDetails) {
    return (
      <View className="flex-1 justify-center items-center bg-[#fdddbd]">
        <Text className="text-red-500">Plant not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#fdddbd]">
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-10 left-4 z-50 flex-row items-center"
      >
        <Ionicons name="arrow-back" size={26} color="#448f49" />
        <Text className="ml-2 text-[#448f49] text-base">Back</Text>
      </TouchableOpacity>

      <ScrollView
        className="flex-1 px-4 pt-24 bg-[#fdddbd]"
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {plantDetails.default_image?.original_url && (
          <Image
            source={{ uri: plantDetails.default_image.original_url }}
            className="w-full h-64 rounded-xl mb-6"
            resizeMode="cover"
          />
        )}

        <Text className="text-3xl font-bold text-[#448f49] mb-1">
          {plantDetails.common_name || "Unnamed Plant"}
        </Text>
        <Text className="text-lg text-gray-600 italic mb-6">
          {plantDetails.scientific_name?.join(", ")}
        </Text>

        {careGuide ? (
          <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <Text className="text-xl font-bold text-[#448f49] mb-3">Care Guide</Text>
            {careGuide.section?.map((section: any, index: number) => (
              <View key={index} className="mb-4">
                <Text className="text-[#448f49] font-semibold mb-1">
                  {section.type}
                </Text>
                <Text className="text-gray-700 leading-6">{section.description}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-red-500 mt-4 mb-6">
            No care guide available for this plant.
          </Text>
        )}

        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <Text className="text-xl font-bold text-[#448f49] mb-2">Overview</Text>
          <Text className="text-gray-800">Type: {plantDetails.type}</Text>
          <Text className="text-gray-800">Cycle: {plantDetails.cycle}</Text>
          <Text className="text-gray-800">Care Level: {plantDetails.care_level}</Text>
          <Text className="text-gray-800">Growth Rate: {plantDetails.growth_rate}</Text>
          {plantDetails.dimensions?.min_value && (
            <Text className="text-gray-800">
              Size: {plantDetails.dimensions.min_value} - {plantDetails.dimensions.max_value}{" "}
              {plantDetails.dimensions.unit}
            </Text>
          )}
        </View>

        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <Text className="text-xl font-bold text-[#448f49] mb-2">Watering</Text>
          <Text className="text-gray-800">Frequency: {plantDetails.watering}</Text>
        </View>

        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <Text className="text-xl font-bold text-[#448f49] mb-2">Sunlight</Text>
          <Text className="text-gray-800">{plantDetails.sunlight?.join(", ")}</Text>
        </View>

        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <Text className="text-xl font-bold text-[#448f49] mb-2">Reproduction</Text>
          <Text className="text-gray-800">
            Prune in: {plantDetails.pruning_month?.join(", ") || "N/A"}
          </Text>
          <Text className="text-gray-800">
            Methods: {plantDetails.propagation?.join(", ") || "N/A"}
          </Text>
        </View>

        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <Text className="text-xl font-bold text-[#448f49] mb-2">Additional Info</Text>
          <Text className="text-gray-800">
            Medicinal:{" "}
            <Text className={plantDetails.medicinal ? "text-green-700 font-semibold" : "text-red-500"}>
              {plantDetails.medicinal ? "Yes" : "No"}
            </Text>
          </Text>
          <Text className="text-gray-800">
            Poisonous to humans:{" "}
            <Text className={plantDetails.poisonous_to_humans ? "text-red-500 font-semibold" : "text-green-700"}>
              {plantDetails.poisonous_to_humans ? "Yes" : "No"}
            </Text>
          </Text>
          <Text className="text-gray-800">
            Poisonous to pets:{" "}
            <Text className={plantDetails.poisonous_to_pets ? "text-red-500 font-semibold" : "text-green-700"}>
              {plantDetails.poisonous_to_pets ? "Yes" : "No"}
            </Text>
          </Text>
          <Text className="text-gray-800">
            Indoor Plant:{" "}
            <Text className={plantDetails.indoor ? "text-green-700 font-semibold" : "text-red-500"}>
              {plantDetails.indoor ? "Yes" : "No"}
            </Text>
          </Text>
          <Text className="text-gray-800">
            Drought Tolerant:{" "}
            <Text className={plantDetails.drought_tolerant ? "text-green-700 font-semibold" : "text-red-500"}>
              {plantDetails.drought_tolerant ? "Yes" : "No"}
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
