import { useEffect, useState } from "react";
import icons from "@/constants/icons";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { database, databaseId, blogsId } from "@/backend/appwrite";
import { Query } from "react-native-appwrite";
import { Link } from "expo-router";

const Blog = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const response = await database.listDocuments(databaseId, blogsId, [
        Query.orderDesc("$createdAt"),
      ]);
      setBlogs(response.documents);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#fdddbd]">
        <ActivityIndicator size="large" color="#448f49" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#fdddbd] px-4 pt-12">
      <Text className="text-2xl font-bold text-[#448f49]  mb-4">
        <Image source={icons.logo} className="h-[15px] w-[15px]" /> RootRoutine
      </Text>
      <View className="mb-4">
        <Link href="/createBlog" asChild>
          <TouchableOpacity className="bg-[#448f49] px-4 py-3 rounded-lg">
            <Text className="text-white text-center font-semibold">
              + New Blog
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      <FlatList
        data={blogs}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text className="text-gray-500">No blog posts found.</Text>
        }
        renderItem={({ item }) => (
          <Link href={`/blog/${item.$id}`} asChild>
            <TouchableOpacity className="bg-white rounded-lg shadow-xs p-3 m-2 w-[47%]">
              {item.img ? (
                <Image
                  source={{ uri: item.img }}
                  className="w-full h-24 rounded mb-2"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-24 rounded bg-black justify-center items-center mb-2">
                  <Text className="text-gray-500 text-sm">No Image</Text>
                </View>
              )}
              <Text
                className="font-semibold text-base text-[#333] mb-1"
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text className="text-xs text-gray-500 mb-1" numberOfLines={2}>
                {item.content}
              </Text>
              <Text className="text-xs text-gray-400 italic">
                by {item.author}
              </Text>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
};

export default Blog;
