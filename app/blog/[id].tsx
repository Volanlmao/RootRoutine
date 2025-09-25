import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { database, databaseId, blogsId } from "@/backend/appwrite";
import { Ionicons } from "@expo/vector-icons";
import { getUser } from "@/backend/appwrite";

const BlogDetail = () => {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState<any>(null);
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchBlogAndUser = async () => {
      try {
        const [blogResponse, userResponse] = await Promise.all([
          database.getDocument(databaseId, blogsId, id as string),
          getUser(),
        ]);
        setBlog(blogResponse);
        setUser(userResponse);
      } catch (error) {
        console.error("Error fetching blog or user:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlogAndUser();
  }, [id]);

  const handleDelete = async () => {
    Alert.alert("Confirm", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setDeleting(true);
            await database.deleteDocument(databaseId, blogsId, id as string);
            router.back();
          } catch (error) {
            console.error("Error deleting blog:", error);
            Alert.alert("Error", "Could not delete the blog.");
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

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

  const isAuthor = user?.name === blog.author;

  return (
    <SafeAreaView className="flex-1 bg-[#fdddbd] relative">

      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-10 left-4 z-50 flex-row items-center"
      >
        <Ionicons name="arrow-back" size={26} color="#448f49" />
        <Text className="ml-2 text-[#448f49] text-base">Back</Text>
      </TouchableOpacity>


      {isAuthor && (
        <TouchableOpacity
          onPress={handleDelete}
          disabled={deleting}
          className="absolute top-10 right-4 z-50"
        >
          <Ionicons name="trash" size={26} color="red" />
        </TouchableOpacity>
      )}

      <ScrollView className="px-4 pt-24" contentContainerStyle={{ paddingBottom: 40 }}>

        {blog.img && (
          <Image
            source={{ uri: blog.img }}
            className="w-full h-56 rounded-xl mb-6"
            resizeMode="cover"
          />
        )}


        <View className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <Text className="text-3xl font-bold text-[#448f49] mb-2">{blog.title}</Text>
          <Text className="text-sm text-gray-600 mb-1">by {blog.author}</Text>
          <Text className="text-xs text-gray-400 italic mb-4">
            Posted on {new Date(blog.$createdAt).toLocaleDateString()}
          </Text>
          <Text className="text-base text-gray-800 leading-6">{blog.content}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BlogDetail;
