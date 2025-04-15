import { View, Text, Image, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { getUser, avatars, account } from "@/backend/appwrite";
import { router } from "expo-router";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUser();
      if (userData) {
        setUser(userData);

        const initialsImage = avatars.getInitials(userData.name, 100, 100);
        setAvatarUrl(initialsImage.href);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current"); 
      router.replace("/"); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-[#fdddbd]">
      <Text className="text-2xl font-bold mb-4">Profile</Text>

      {user ? (
        <>
          {avatarUrl && (
            <Image
              source={{ uri: avatarUrl }}
              className="w-[100px] h-[100px] rounded-full mb-2"
            />
          )}
          <Text className="mb-2">Name: {user.name}</Text>
          <Text className="mb-2">Email: {user.email}</Text>

          <TouchableOpacity
            onPress={handleLogout}
            className="mt-4 px-6 py-3 bg-[#05212A] rounded-lg"
          >
            <Text className="text-[#448f49] font-semibold">Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default Profile;
