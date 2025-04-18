import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { database, databaseId, blogsId } from "@/backend/appwrite";
import { Ionicons } from "@expo/vector-icons";

const BlogDetail = () => {
  const { id } = useLocalSearchParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await database.getDocument(databaseId, blogsId, id as string);
        setBlog(response);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#448f49" />
      </View>
    );
  }

  if (!blog) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500">Blog not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#fdddbd] relative">
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-10 left-4 z-50 flex-row items-center"
      >
        <Ionicons name="arrow-back" size={26} color="#448f49" />
        <Text className="ml-2 text-[#448f49] text-base">Back</Text>
      </TouchableOpacity>

      <ScrollView className="px-4 pt-24">
        {blog.img && (
          <Image
            source={{ uri: blog.img }}
            className="w-full h-56 rounded-lg mb-6"
            resizeMode="cover"
          />
        )}

        <Text className="text-3xl font-bold text-[#448f49] mb-2">{blog.title}</Text>
        <Text className="text-sm ">{`by ${blog.author}`}</Text>
        <Text className="text-xs mb-4">
          Posted on {new Date(blog.$createdAt).toLocaleDateString()}
        </Text>

        <Text className="text-base text-gray-700 leading-6 mb-10">{blog.content}</Text>
      </ScrollView>
    </View>
  );
};

export default BlogDetail;
