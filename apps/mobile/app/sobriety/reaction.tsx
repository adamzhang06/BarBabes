import { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const { width, height } = Dimensions.get("window");
const TAPS_NEEDED = 5;

export default function ReactionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ straightLineJitter?: string }>();
  const [taps, setTaps] = useState(0);
  const [latencies, setLatencies] = useState<number[]>([]);
  const [dotPosition, setDotPosition] = useState({ x: width / 2 - 30, y: height / 2 - 80 });
  const lastShowTime = useRef(0);

  const moveDot = () => {
    const now = Date.now();
    if (lastShowTime.current) {
      setLatencies((prev) => [...prev, now - lastShowTime.current]);
    }
    lastShowTime.current = now;
    setDotPosition({
      x: 40 + Math.random() * (width - 120),
      y: 120 + Math.random() * (height - 280),
    });
    setTaps((t) => t + 1);
  };

  useEffect(() => {
    if (taps === 0) {
      lastShowTime.current = Date.now();
    }
  }, [taps]);

  useEffect(() => {
    if (taps >= TAPS_NEEDED) {
      router.replace({
        pathname: "/sobriety/typing",
        params: {
          ...params,
          reactionLatencies: JSON.stringify(latencies),
        },
      });
    }
  }, [taps, latencies]);

  return (
    <View className="flex-1 bg-black px-6 pt-12">
      <Text className="text-safe text-2xl font-bold text-center mb-2">Reaction Timer</Text>
      <Text className="text-white text-lg text-center mb-6">
        Tap the green dot {TAPS_NEEDED - taps} more time(s).
      </Text>
      <View style={{ flex: 1, position: "relative" }}>
        <TouchableOpacity
          onPress={moveDot}
          style={{
            position: "absolute",
            left: dotPosition.x,
            top: dotPosition.y,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: "#39FF14",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text className="text-black text-xl font-bold">{taps}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => router.back()} className="py-4">
        <Text className="text-white text-xl text-center opacity-90">Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}
