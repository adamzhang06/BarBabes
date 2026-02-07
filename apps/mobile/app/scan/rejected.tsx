import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function RejectedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ reason?: string }>();
  const [flash, setFlash] = useState(true);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const t = setInterval(() => setFlash((f) => !f), 400);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.3, duration: 200, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  const isDenied = params.reason === "SERVICE_DENIED";
  return (
    <View className="flex-1 bg-red-600 justify-center items-center px-6">
      <Animated.View
        style={{ position: "absolute", width: "100%", height: "100%", backgroundColor: "#FF3333", opacity }}
        pointerEvents="none"
      />
      <View className="w-28 h-28 rounded-full bg-black justify-center items-center mb-8 border-4 border-white">
        <Text className="text-6xl text-white font-bold">✕</Text>
      </View>
      <Text className="text-white text-4xl font-bold text-center mb-4">
        {isDenied ? "SERVICE DENIED" : "REJECTED"}
      </Text>
      <Text className="text-white text-xl text-center mb-12">
        {isDenied ? "You are cut off." : "Wait 2 minutes between drinks."}
      </Text>
      <TouchableOpacity
        onPress={() => router.replace("/")}
        className="bg-black py-5 px-12 rounded-2xl border-2 border-white"
      >
        <Text className="text-white text-2xl font-bold">OK</Text>
      </TouchableOpacity>
    </View>
  );
}
