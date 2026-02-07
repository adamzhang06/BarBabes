import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import NfcManager, { NfcTech, Ndef } from "react-native-nfc-manager";

export default function BartenderModeScreen() {
  const router = useRouter();
  const [alcoholGrams, setAlcoholGrams] = useState("14");
  const [status, setStatus] = useState<"idle" | "writing">("idle");

  const writeTag = async () => {
    const grams = parseFloat(alcoholGrams) || 14;
    const drinkId = `drink-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const payload = JSON.stringify({
      drink_id: drinkId,
      alcohol_grams: grams,
      timestamp: new Date().toISOString(),
    });
    setStatus("writing");
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const bytes = Ndef.encodeMessage([Ndef.textRecord(payload)]);
      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
        Alert.alert("Success", "Drink ID written to tag.");
      }
      await NfcManager.cancelTechnologyRequest();
    } catch (e) {
      Alert.alert("Error", "Could not write to tag. Try again.");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <View className="flex-1 bg-black px-6 justify-center">
      <Text className="text-alert text-3xl font-bold text-center mb-4">Bartender Mode</Text>
      <Text className="text-white text-xl text-center mb-8 opacity-90">
        Write drink ID and alcohol (g) to NFC tag.
      </Text>
      <Text className="text-white text-lg mb-2">Alcohol (grams)</Text>
      <TextInput
        value={alcoholGrams}
        onChangeText={setAlcoholGrams}
        keyboardType="decimal-pad"
        className="bg-surface border-2 border-safe rounded-xl text-white text-2xl px-4 py-4 mb-8"
        placeholder="14"
        placeholderTextColor="rgba(255,255,255,0.4)"
      />
      <TouchableOpacity
        onPress={writeTag}
        disabled={status !== "idle"}
        className="bg-alert py-6 rounded-2xl active:opacity-80"
      >
        <Text className="text-white text-2xl font-bold text-center">
          {status === "writing" ? "Hold phone to tag..." : "Write to NFC Tag"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()} className="mt-8 py-4">
        <Text className="text-white text-xl text-center opacity-90">Back</Text>
      </TouchableOpacity>
    </View>
  );
}
