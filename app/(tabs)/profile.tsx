import { View, Text, Image, TouchableOpacity, TextInput, Alert } from "react-native";
import { useEffect, useState } from "react";
import { getUser, avatars, account } from "@/backend/appwrite";
import { router } from "expo-router";
import icons from "@/constants/icons";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const session = await account.getSession("current");
        if (!session) {
          console.warn("No active session found.");
          return;
        }

        const userData = await getUser();
        if (userData) {
          setUser(userData);
          setNewName(userData.name);

          const initialsImage = avatars.getInitials(userData.name, 100, 100);
          setAvatarUrl(initialsImage.href);
        }
      } catch (error) {
        console.error("Failed to fetch user or session:", error);
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


  const handleNameUpdate = async () => {
    if (!newName.trim()) return;

    try {
      await account.updateName(newName.trim());
      const updatedUser = await getUser();
      setUser(updatedUser);
      setEditingName(false);
      Alert.alert("Success", "Name updated successfully");
    } catch (error) {
      console.error("Failed to update name:", error);
      Alert.alert("Error", "Could not update name");
    }
  };

  return (
    <View className="flex-1 bg-[#fdddbd] px-4 pt-16">
      <Text className="text-2xl font-bold text-[#448f49] mb-4">
        <Image source={icons.logo} className="h-[15px] w-[15px]" /> RootRoutine
      </Text>

      <View className="flex-1 justify-center items-center">
        {user ? (
          <View className="bg-white shadow-xs rounded-xl p-6 items-center w-full max-w-md">
            {avatarUrl && (
              <Image
                source={{ uri: avatarUrl }}
                className="w-[100px] h-[100px] rounded-full mb-4 bg-white"
              />
            )}

            {editingName ? (
              <>
                <TextInput
                  className="w-full border border-gray-300 rounded px-4 py-2 mb-2 text-black"
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Enter new name"
                />
                <View className="flex-row space-x-2 gap-2">
                  <TouchableOpacity
                    onPress={handleNameUpdate}
                    className="bg-[#448f49] px-4 py-2 rounded"
                  >
                    <Text className="text-white">Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingName(false);
                      setNewName(user.name);
                    }}
                    className="bg-gray-400 px-4 py-2 rounded"
                  >
                    <Text className="text-white">Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text className="text-lg font-semibold text-black mb-2">
                  Name: {user.name}
                </Text>
                <TouchableOpacity
                  onPress={() => setEditingName(true)}
                  className="mb-4"
                >
                  <Text className="text-[#448f49] underline">Edit Name</Text>
                </TouchableOpacity>
              </>
            )}

            <Text className="text-base text-black mb-4">Email: {user.email}</Text>
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
