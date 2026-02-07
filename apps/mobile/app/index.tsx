import { Link, Stack } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "SafeRound" }} />
      <View className="flex-1 bg-black px-6 justify-center">
        <Text className="text-safe text-4xl font-bold text-center mb-2">SafeRound</Text>
        <Text className="text-white text-xl text-center mb-16 opacity-90">
          Stay safe. Stay in control.
        </Text>
        <Link href="/scan" asChild>
          <TouchableOpacity className="bg-safe py-5 rounded-2xl mb-4 active:opacity-80">
            <Text className="text-black text-2xl font-bold text-center">Scan Drink</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/bartender" asChild>
          <TouchableOpacity className="bg-surface border-2 border-safe py-5 rounded-2xl mb-4 active:opacity-80">
            <Text className="text-safe text-2xl font-bold text-center">Bartender Mode</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/sobriety" asChild>
          <TouchableOpacity className="bg-surface border-2 border-safe py-5 rounded-2xl mb-4 active:opacity-80">
            <Text className="text-safe text-2xl font-bold text-center">Sobriety Check</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/group" asChild>
          <TouchableOpacity className="bg-surface border-2 border-safe py-5 rounded-2xl active:opacity-80">
            <Text className="text-safe text-2xl font-bold text-center">Group & Life360</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}
