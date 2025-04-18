import { View, Text, Image, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { getUser, avatars, account } from "@/backend/appwrite";
import { router } from "expo-router";
import icons from "@/constants/icons";

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
      router.replace("/index");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <View className="flex-1 bg-[#fdddbd] px-4 pt-12">
      <Text className="text-2xl font-bold text-[#448f49] mb-4">
        <Image source={icons.logo} className="h-[15px] w-[15px]" /> RootRoutine
      </Text>

      <View className="flex-1 justify-center items-center">
        {user ? (
          <View className="bg-white shadow-xs rounded-xl p-6 items-center">
            {avatarUrl && (
              <Image
                source={{ uri: avatarUrl }}
                className="w-[100px] h-[100px] rounded-full mb-4 bg-white"
              />
            )}
            <Text className="text-lg font-semibold text-black mb-2">
              Name: {user.name}
            </Text>
            <Text className="text-base text-black mb-4">
              Email: {user.email}
            </Text>
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
        <TouchableOpacity
          onPress={handleLogout}
          className="mt-4 px-6 py-3 bg-[#448f49] rounded-lg"
        >
          <Text className="text-white font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
