import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import icons from "@/constants/icons";
import { perenualApi, ApiToken } from "@/backend/perenualApi";
import { Link } from "expo-router";

export default function main() {
  const [q, setQ] = useState("");
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchPlants = async (input: string) => {
    try {
      setLoading(true);
      const response = await perenualApi.get("/species-list", {
        params: {
          key: ApiToken,
          q: input,
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

  return (
    <View className="flex-1 bg-white px-4 pt-12">
      <Text className="text-2xl font-bold text-green-700 mb-4">
        <Image source={icons.logo} className="h-[15px] w-[15px]" /> RootRoutine
      </Text>

      <TextInput
        className="border border-gray-500 rounded-lg p-3 mb-4"
        placeholder="Search for a plant..."
        onChangeText={setQ}
        value={q}
      />

      {loading ? (
        <ActivityIndicator size="large" className="text-green-800" />
      ) : (
        <FlatList
          data={plants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Link href={`/plant/${item.id}`} asChild>
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
          )}
        />
      )}
    </View>
  );
}
