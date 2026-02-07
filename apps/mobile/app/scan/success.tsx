import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function ScanSuccessScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-black justify-center items-center px-6">
      <View className="w-24 h-24 rounded-full bg-safe justify-center items-center mb-8">
        <Text className="text-5xl text-black font-bold">✓</Text>
      </View>
      <Text className="text-safe text-3xl font-bold text-center mb-4">OK</Text>
      <Text className="text-white text-xl text-center mb-12">Drink validated.</Text>
      <TouchableOpacity onPress={() => router.replace("/")} className="bg-safe py-5 px-12 rounded-2xl">
        <Text className="text-black text-2xl font-bold">Done</Text>
      </TouchableOpacity>
    </View>
  );
}
