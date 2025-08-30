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
      {/* Back Button (unchanged) */}
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

        {/* Care Guide */}
        {careGuide ? (
          <View className="mb-8">
            <Text className="text-xl font-bold text-[#448f49] mb-2">
              Description
            </Text>
            {careGuide.section?.map((section: any, index: number) => (
              <View key={index} className="mb-3">
                <Text className="font-semibold text-[#448f49] mb-1">
                  {section.type}
                </Text>
                <Text className="text-gray-800">{section.description}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-red-500 mt-4 mb-6">
            No care guide available for this plant.
          </Text>
        )}

        {/* Overview */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-[#448f49] mb-2">Overview</Text>
          <Text>Type: {plantDetails.type}</Text>
          <Text>Cycle: {plantDetails.cycle}</Text>
          <Text>Care Level: {plantDetails.care_level}</Text>
          <Text>Growth Rate: {plantDetails.growth_rate}</Text>
          {plantDetails.dimensions?.min_value && (
            <Text>
              Size: {plantDetails.dimensions.min_value} -{" "}
              {plantDetails.dimensions.max_value} {plantDetails.dimensions.unit}
            </Text>
          )}
        </View>

        {/* Watering */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-[#448f49] mb-2">Watering</Text>
          <Text>Frequency: {plantDetails.watering}</Text>
        </View>

        {/* Sunlight */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-[#448f49] mb-2">Sunlight</Text>
          <Text>{plantDetails.sunlight?.join(", ")}</Text>
        </View>

        {/* Reproduction */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-[#448f49] mb-2">Reproduction</Text>
          <Text>Prune in: {plantDetails.pruning_month?.join(", ")}</Text>
          <Text>Reproduction: {plantDetails.propagation?.join(", ")}</Text>
        </View>

        {/* Additional Info */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-[#448f49] mb-2">
            Additional Info
          </Text>
          <Text>Medicinal: {plantDetails.medicinal ? "Yes" : "No"}</Text>
          <Text>
            Poisonous to humans: {plantDetails.poisonous_to_humans ? "Yes" : "No"}
          </Text>
          <Text>
            Poisonous to pets: {plantDetails.poisonous_to_pets ? "Yes" : "No"}
          </Text>
          <Text>Indoor: {plantDetails.indoor ? "Yes" : "No"}</Text>
          <Text>
            Drought tolerant: {plantDetails.drought_tolerant ? "Yes" : "No"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
