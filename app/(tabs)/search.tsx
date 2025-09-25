import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import icons from "@/constants/icons";
import { perenualApi, ApiToken } from "@/backend/perenualApi";
import { Link } from "expo-router";

export default function search() {
  const [q, setQ] = useState("");
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popularPlants, setPopularPlants] = useState([]);


  const searchPlants = async (input: string) => {
    try {
      setLoading(true);
      const response = await perenualApi.get("/species-list", {
        params: {
          key: ApiToken,
          q: input
        },
      });
      setPlants(response.data.data);
    } catch (e: any) {
      console.error("Api err:", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (q.length > 2) searchPlants(q);
      else setPlants([]);
    }, 500);

    return () => clearTimeout(timeout);
  }, [q]);

  useEffect(() => {
    const fetchPopularPlants = async () => {
      try {
        const response = await perenualApi.get("/species-list", {
          params: { key: ApiToken, page: 1 },
        });
        setPopularPlants(response.data.data.slice(0, 10));
      } catch (error) {
        console.error("Failed to fetch popular plants:", error);
      }
    };

    fetchPopularPlants();
  }, []);

  return (
    <ScrollView className="flex-1 bg-[#fdddbd] px-4 pt-16" contentContainerStyle={{ paddingBottom: 20 }}>
      <Text className="text-2xl font-bold text-[#448f49] mb-4">
        <Image source={icons.logo} className="h-[15px] w-[15px]" /> RootRoutine
      </Text>

      <TextInput
        className="text-white rounded-lg p-3 mb-4 bg-[#448f49]"
        placeholder="Search for a plant..."
        placeholderTextColor="#ffffff"
        onChangeText={setQ}
        value={q}
      />

      {popularPlants.length > 0 && q.length === 0 && (
        <View className="mb-6">
          <Text className="text-lg font-bold text-[#448f49] mb-2">Most Popular Plants</Text>
          <View className="flex-row flex-wrap justify-between">
            {popularPlants.map((item) => (
              <Link key={item.id} href={`/plant/${item.id}`} asChild>
                <TouchableOpacity className="bg-white rounded-lg shadow-xs p-3 mb-4 w-[47%]">
                  {item.default_image?.small_url ? (
                    <Image
                      source={{ uri: item.default_image.small_url }}
                      className="w-full h-24 rounded mb-2"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-24 bg-gray-200 rounded justify-center items-center mb-2">
                      <Text className="text-xs text-gray-500">No Image</Text>
                    </View>
                  )}
                  <Text className="font-semibold text-base text-[#333] mb-1" numberOfLines={1}>
                    {item.common_name}
                  </Text>
                  <Text className="text-xs text-gray-500" numberOfLines={2}>
                    {item.scientific_name}
                  </Text>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" className="text-green-800 mt-4" />
      ) : (
        plants.map((item) => (
          <Link key={item.id} href={`/plant/${item.id}`} asChild>
            <TouchableOpacity>
              <View className="mb-4 flex-row items-center gap-4">
                {item.default_image?.small_url ? (
                  <Image
                    source={{ uri: item.default_image.small_url }}
                    className="w-16 h-16 rounded"
                  />
                ) : (
                  <View className="w-16 h-16 bg-gray-200 rounded items-center justify-center">
                    <Text className="text-xs text-gray-500">No Image</Text>
                  </View>
                )}
                <View>
                  <Text className="text-lg font-semibold text-green-700">
                    {item.common_name}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {item.scientific_name}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        ))
      )}
    </ScrollView>
  );
}
