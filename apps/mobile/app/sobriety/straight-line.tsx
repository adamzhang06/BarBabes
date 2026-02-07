import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Accelerometer } from "expo-sensors";

const DURATION_MS = 10000;
const SAMPLE_INTERVAL = 100;

export default function StraightLineScreen() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [jitter, setJitter] = useState<{ x: number; y: number; z: number }[]>([]);
  const subscription = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    Accelerometer.setUpdateInterval(SAMPLE_INTERVAL);
    return () => {
      subscription.current?.remove();
    };
  }, []);

  const startTest = () => {
    setStarted(true);
    setJitter([]);
    setCountdown(10);
    subscription.current = Accelerometer.addListener((data) => {
      setJitter((prev) => [...prev.slice(-300), { x: data.x, y: data.y, z: data.z }]);
    });
  };

  useEffect(() => {
    if (!started || jitter.length === 0) return;
    const elapsed = jitter.length * SAMPLE_INTERVAL;
    const remaining = Math.ceil((DURATION_MS - elapsed) / 1000);
    setCountdown(remaining > 0 ? remaining : 0);
    if (elapsed >= DURATION_MS) {
      subscription.current?.remove();
      subscription.current = null;
      router.replace({
        pathname: "/sobriety/reaction",
        params: { straightLineJitter: JSON.stringify(jitter) },
      });
    }
  }, [started, jitter]);

  return (
    <View className="flex-1 bg-black px-6 justify-center">
      <Text className="text-safe text-2xl font-bold text-center mb-4">Straight Line</Text>
      <Text className="text-white text-xl text-center mb-8">
        Hold your phone steady for 10 seconds.
      </Text>
      {!started ? (
        <TouchableOpacity onPress={startTest} className="bg-safe py-6 rounded-2xl">
          <Text className="text-black text-2xl font-bold text-center">Start</Text>
        </TouchableOpacity>
      ) : (
        <View className="items-center">
          <View className="w-32 h-32 rounded-full border-4 border-safe justify-center items-center">
            <Text className="text-safe text-5xl font-bold">{countdown}</Text>
          </View>
          <Text className="text-white text-lg mt-6">Keep holding steady...</Text>
        </View>
      )}
      <TouchableOpacity onPress={() => router.back()} className="mt-12 py-4">
        <Text className="text-white text-xl text-center opacity-90">Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}
