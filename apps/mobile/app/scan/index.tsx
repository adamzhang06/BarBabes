import { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import NfcManager, { NfcTech } from "react-native-nfc-manager";

const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

export default function ScanScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "scanning" | "validating">("idle");
  const [result, setResult] = useState<{ allowed: boolean; reason: string; message: string } | null>(null);

  const validateDrink = async (drinkId: string, alcoholGrams: number) => {
    setStatus("validating");
    try {
      const res = await fetch(`${API_BASE}/validate-drink`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drink_id: drinkId,
          user_id: "demo-user-1",
          alcohol_grams: alcoholGrams,
        }),
      });
      const data = await res.json();
      setResult({ allowed: data.allowed, reason: data.reason, message: data.message });
      if (data.allowed) {
        router.replace("/scan/success");
      } else {
        router.replace({ pathname: "/scan/rejected", params: { reason: data.reason } });
      }
    } catch (e) {
      setResult({ allowed: false, reason: "ERROR", message: "Network error." });
      router.replace({ pathname: "/scan/rejected", params: { reason: "ERROR" } });
    } finally {
      setStatus("idle");
    }
  };

  const startScan = async () => {
    setStatus("scanning");
    setResult(null);
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      if (!tag?.ndefMessage?.length) {
        setResult({ allowed: false, reason: "COOLDOWN", message: "No drink data on tag." });
        setStatus("idle");
        return;
      }
      const record = tag.ndefMessage[0];
      const payload = record.payload ? String.fromCharCode(...record.payload) : "";
      let drinkId = "unknown";
      let alcoholGrams = 14;
      try {
        const parsed = JSON.parse(payload);
        drinkId = parsed.drink_id ?? parsed.drinkId ?? drinkId;
        alcoholGrams = Number(parsed.alcohol_grams ?? parsed.alcoholGrams ?? alcoholGrams) || 14;
      } catch {
        drinkId = payload.slice(0, 32) || drinkId;
      }
      await NfcManager.cancelTechnologyRequest();
      await validateDrink(drinkId, alcoholGrams);
    } catch (e) {
      setResult({ allowed: false, reason: "ERROR", message: "Scan failed or cancelled." });
      setStatus("idle");
    }
  };

  return (
    <View className="flex-1 bg-black px-6 justify-center">
      <Text className="text-safe text-3xl font-bold text-center mb-4">Scan Drink</Text>
      <Text className="text-white text-xl text-center mb-12 opacity-90">
        Hold your phone to the NFC tag on the glass.
      </Text>
      {result && (
        <View className="mb-8 p-4 rounded-xl bg-surface">
          <Text className="text-white text-lg">{result.message}</Text>
        </View>
      )}
      {status === "scanning" && (
        <View className="mb-8 items-center">
          <ActivityIndicator size="large" color="#39FF14" />
          <Text className="text-safe text-xl mt-4">Scanning...</Text>
        </View>
      )}
      {status === "validating" && (
        <View className="mb-8 items-center">
          <ActivityIndicator size="large" color="#39FF14" />
          <Text className="text-safe text-xl mt-4">Validating...</Text>
        </View>
      )}
      <TouchableOpacity
        onPress={startScan}
        disabled={status !== "idle"}
        className="bg-safe py-6 rounded-2xl active:opacity-80"
      >
        <Text className="text-black text-2xl font-bold text-center">
          {status === "idle" ? "Start Scan" : "Please wait..."}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()} className="mt-6 py-4">
        <Text className="text-white text-xl text-center opacity-90">Back</Text>
      </TouchableOpacity>
    </View>
  );
}
