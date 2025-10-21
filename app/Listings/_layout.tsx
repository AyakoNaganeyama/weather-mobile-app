import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
const _layout = () => {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="listings/[id]"
        options={{
          headerTitle: "Details",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close-outline" size={28} />
            </TouchableOpacity>
          ),
          animation: "fade",
        }}
      />
    </Stack>
  );
};

export default _layout;
