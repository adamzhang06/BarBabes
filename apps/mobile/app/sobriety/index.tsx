import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function SobrietyMenuScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-black px-6 justify-center">
      <Text className="text-safe text-3xl font-bold text-center mb-4">Sobriety Check</Text>
      <Text className="text-white text-xl text-center mb-12 opacity-90">
        Complete 3 mini-games. Results are analyzed by AI.
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/sobriety/straight-line")}
        className="bg-safe py-5 rounded-2xl mb-4"
      >
        <Text className="text-black text-2xl font-bold text-center">1. Straight Line</Text>
        <Text className="text-black text-base text-center mt-1">Hold phone steady 10s</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/sobriety/reaction")}
        className="bg-surface border-2 border-safe py-5 rounded-2xl mb-4"
      >
        <Text className="text-safe text-2xl font-bold text-center">2. Reaction Timer</Text>
        <Text className="text-white text-base text-center mt-1">Tap the dot 5 times</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/sobriety/typing")}
        className="bg-surface border-2 border-safe py-5 rounded-2xl mb-4"
      >
        <Text className="text-safe text-2xl font-bold text-center">3. Typing Test</Text>
        <Text className="text-white text-base text-center mt-1">Type the sentence</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()} className="mt-6 py-4">
        <Text className="text-white text-xl text-center opacity-90">Back</Text>
      </TouchableOpacity>
    </View>
  );
}
