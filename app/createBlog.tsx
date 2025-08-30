import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { database, databaseId, blogsId } from "@/backend/appwrite";
import { ID } from "react-native-appwrite";
import { router } from "expo-router";
import { getUser } from "@/backend/appwrite";
import { Ionicons } from "@expo/vector-icons";


const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreateBlog = async () => {
    if (!title || !content) {
      return Alert.alert("Please fill in all fields.");
    }

    setLoading(true);

    try {
      const user = await getUser();

      await database.createDocument(databaseId, blogsId, ID.unique(), {
        title,
        content,
        author: user.name,
        img: image || "", 

      });

      Alert.alert("Success", "Blog post created!");
      router.replace("/main");
    } catch (error) {
      console.error("Error creating blog:", error);
      Alert.alert("Error", "Could not create blog post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-[#fdddbd] px-4 pt-12 relative">
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-10 left-4 z-50 flex-row items-center"
      >
        <Ionicons name="arrow-back" size={26} color="#448f49" />
        <Text className="ml-2 text-[#448f49] text-base">Back</Text>
      </TouchableOpacity>

      <ScrollView className="flex-1 px-4 pt-24">
        <Text className="text-3xl font-bold text-[#448f49] mb-6">Create Blog</Text>

        <TextInput
          className="border border-gray-300 p-4 rounded-lg mb-4 text-white bg-[#05212A]"
          placeholder="Title"
          placeholderTextColor="#aaa"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          className="border border-gray-300 p-4 rounded-lg h-40 text-white bg-[#05212A]"
          placeholder="Content"
          placeholderTextColor="#aaa"
          multiline
          value={content}
          onChangeText={setContent}
        />

        <TouchableOpacity
          onPress={pickImage}
          className="bg-[#eeeeee] p-3 rounded-lg my-4"
        >
          <Text className="text-center">Select Blog Image</Text>
        </TouchableOpacity>

        {image && (
          <Image
            source={{ uri: image }}
            className="w-full h-48 rounded-lg mb-4"
            resizeMode="cover"
          />
        )}

        <TouchableOpacity
          disabled={loading}
          className="bg-[#448f49] p-4 rounded-lg mt-6"
          onPress={handleCreateBlog}
        >
          <Text className="text-white text-center font-semibold">
            {loading ? "Posting..." : "Publish Blog"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateBlog;