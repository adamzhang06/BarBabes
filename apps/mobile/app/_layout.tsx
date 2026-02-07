import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import NfcManager from "react-native-nfc-manager";

export default function RootLayout() {
  useEffect(() => {
    NfcManager.start().catch(() => {});
  }, []);
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#000000" },
          animation: "slide_from_right",
        }}
      />
    </>
  );
}
