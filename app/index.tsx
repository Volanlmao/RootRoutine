import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import icons from "@/constants/icons";
import perenualApi, { ApiToken } from "@/backend/perenualApi";

export default function Index() {
  const [query, setQuery] = useState("");
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
      if (query.length > 2) searchPlants(query);
      else setPlants([]);
    }, 500);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <View className="flex bg-white px-4 pt-12">
      <Text className="text-2xl font-bold text-green-700 mb-4">
        <Image source={icons.logo} className="h-[15px] w-[15px]" /> RootRoutine
      </Text>

      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4"
        placeholder="Search for a plant..."
        onChangeText={setQuery}
        value={query}
      />

      {loading ? (
        <ActivityIndicator size="large" className="text-green-800" />
      ) : (
        <FlatList
          data={plants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="mb-4 flex-row items-center gap-4">
              <Image
                source={{ uri: item.default_image.thumbnail }}
                className="w-16 h-16 rounded"
              />
              <View>
                <Text className="text-lg font-semibold text-green-700">
                  {item.common_name}
                </Text>
                <Text className="text-sm text-gray-500 ">
                  {item.scientific_name}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
