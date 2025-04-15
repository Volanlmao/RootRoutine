import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#05212A",
          padding: 4,
          height: 70,
        },
      }}
    >
      <Tabs.Screen
        name="main"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={"home"}
              size={24}
              color={focused ? "#448f49" : "#cecece"}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text className={`text-sm ${focused ? "text-[#448f49]" : "text-[#cecece]"}`}>
              Home
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "search",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={"search-sharp"}
              size={24}
              color={focused ? "#448f49" : "#cecece"}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text className={`text-sm ${focused ? "text-[#448f49]" : "text-[#cecece]"}`}>
              Home
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "profile",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={"person-circle-sharp"}
              size={24}
              color={focused ? "#448f49" : "#cecece"}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text className={`text-sm ${focused ? "text-[#448f49]" : "text-[#cecece]"}`}>
              Home
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
