import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function SobrietyResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ score?: string; recommendation?: string; is_emergency?: string }>();
  const score = parseInt(params.score ?? "0", 10);
  const isEmergency = params.is_emergency === "1";

  return (
    <View className={`flex-1 bg-black px-6 justify-center ${isEmergency ? "border-4 border-alert" : ""}`}>
      {isEmergency && (
        <Text className="text-alert text-2xl font-bold text-center mb-4">⚠ EMERGENCY – Seek help</Text>
      )}
      <Text className="text-safe text-3xl font-bold text-center mb-2">Sobriety Score</Text>
      <View className="w-32 h-32 rounded-full bg-safe justify-center items-center self-center mb-6">
        <Text className="text-black text-4xl font-bold">{score}</Text>
      </View>
      <Text className="text-white text-xl text-center mb-8">{params.recommendation ?? ""}</Text>
      <TouchableOpacity onPress={() => router.replace("/")} className="bg-safe py-5 rounded-2xl">
        <Text className="text-black text-2xl font-bold text-center">Done</Text>
      </TouchableOpacity>
    </View>
  );
}
