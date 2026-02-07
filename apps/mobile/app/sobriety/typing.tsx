import { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const TARGET = "The quick brown fox jumps over the lazy dog.";
const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

export default function TypingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ straightLineJitter?: string; reactionLatencies?: string }>();
  const [input, setInput] = useState("");
  const [startTime] = useState(Date.now());
  const [submitting, setSubmitting] = useState(false);

  const typoCount = (() => {
    let c = 0;
    const a = TARGET.toLowerCase();
    const b = input.toLowerCase();
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      if (a[i] !== b[i]) c++;
    }
    return c;
  })();

  const submit = async () => {
    setSubmitting(true);
    const elapsedMs = Date.now() - startTime;
    const speedWpm = input.length / 5 / (elapsedMs / 60000) || 0;
    let jitter: { x: number; y: number; z: number }[] = [];
    let latencies: number[] = [];
    try {
      if (params.straightLineJitter) jitter = JSON.parse(params.straightLineJitter as string);
      if (params.reactionLatencies) latencies = JSON.parse(params.reactionLatencies as string);
    } catch {}
    try {
      const res = await fetch(`${API_BASE}/sobriety/assess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          straight_line_jitter: jitter,
          reaction_latencies_ms: latencies,
          typing_test: { typo_count: typoCount, speed_wpm: speedWpm, text_entered: input },
        }),
      });
      const result = await res.json();
      router.replace({
        pathname: "/sobriety/result",
        params: {
          score: String(result.sobriety_score ?? 0),
          recommendation: result.recommendation ?? "",
          is_emergency: result.is_emergency ? "1" : "0",
        },
      });
    } catch (e) {
      router.replace({
        pathname: "/sobriety/result",
        params: { score: "0", recommendation: "Could not reach server.", is_emergency: "0" },
      });
    } finally {
      setSubmitting(false);
    }
  };

  const done = input.length >= TARGET.length;
  return (
    <View className="flex-1 bg-black px-6 pt-12">
      <Text className="text-safe text-2xl font-bold text-center mb-4">Typing Test</Text>
      <Text className="text-white text-lg mb-4">Type this sentence:</Text>
      <Text className="text-safe text-base mb-4">{TARGET}</Text>
      <TextInput
        value={input}
        onChangeText={setInput}
        className="bg-surface border-2 border-safe rounded-xl text-white text-xl px-4 py-4 min-h-[120]"
        placeholderTextColor="rgba(255,255,255,0.4)"
        multiline
        editable={!submitting}
      />
      <Text className="text-white text-base mt-2">Typos: {typoCount}</Text>
      <TouchableOpacity
        onPress={submit}
        disabled={!done || submitting}
        className={`mt-8 py-6 rounded-2xl ${done && !submitting ? "bg-safe" : "bg-surface opacity-60"}`}
      >
        <Text className="text-black text-2xl font-bold text-center">
          {submitting ? "Analyzing..." : "Submit & Get Result"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()} className="mt-6 py-4">
        <Text className="text-white text-xl text-center opacity-90">Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}
