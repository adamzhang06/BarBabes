import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { useRouter } from "expo-router";

const LIFE360_URI = "life360://";
const CHECKIN_TIMEOUT_MS = 3 * 60 * 1000;   // 3 min
const LOCATE_TIMEOUT_MS = 2 * 60 * 1000;    // 2 min then mock emergency

export default function GroupScreen() {
  const router = useRouter();
  const [checkInDue, setCheckInDue] = useState(false);
  const [locateFriend, setLocateFriend] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<Date | null>(null);

  const openLife360 = () => {
    Linking.openURL(LIFE360_URI).catch(() => {
      Linking.openURL("https://www.life360.com/");
    });
  };

  const doCheckIn = () => {
    setLastCheckIn(new Date());
    setCheckInDue(false);
    setLocateFriend(false);
  };

  useEffect(() => {
    const t = setInterval(() => {
      if (!lastCheckIn) {
        setCheckInDue(true);
        return;
      }
      const elapsed = Date.now() - lastCheckIn.getTime();
      if (elapsed > CHECKIN_TIMEOUT_MS) {
        setCheckInDue(true);
        if (elapsed > CHECKIN_TIMEOUT_MS + LOCATE_TIMEOUT_MS) {
          setLocateFriend(true);
          // In production: trigger call to Primary Contact
        }
      }
    }, 10000);
    return () => clearInterval(t);
  }, [lastCheckIn]);

  return (
    <View className="flex-1 bg-black px-6 justify-center">
      <Text className="text-safe text-3xl font-bold text-center mb-4">Group & Safety</Text>
      <TouchableOpacity
        onPress={openLife360}
        className="bg-safe py-6 rounded-2xl mb-6"
      >
        <Text className="text-black text-2xl font-bold text-center">View Group on Life360</Text>
      </TouchableOpacity>
      {checkInDue && (
        <View className="mb-6 p-4 rounded-xl border-2 border-alert bg-surface">
          <Text className="text-alert text-xl font-bold text-center mb-2">Check-in overdue</Text>
          <Text className="text-white text-base text-center mb-4">
            Your group dashboard may show &quot;Locate Friend&quot; if you don&apos;t check in.
          </Text>
          <TouchableOpacity onPress={doCheckIn} className="bg-alert py-4 rounded-xl">
            <Text className="text-white text-xl font-bold text-center">I&apos;m OK – Check In</Text>
          </TouchableOpacity>
        </View>
      )}
      {locateFriend && (
        <View className="mb-6 p-4 rounded-xl border-2 border-rejected bg-red-950/30">
          <Text className="text-rejected text-xl font-bold text-center mb-2">LOCATE FRIEND</Text>
          <Text className="text-white text-base text-center">
            Primary contact may be notified. Check in now to stop.
          </Text>
          <TouchableOpacity onPress={doCheckIn} className="bg-safe py-4 rounded-xl mt-4">
            <Text className="text-black text-xl font-bold text-center">Check In Now</Text>
          </TouchableOpacity>
        </View>
      )}
      {!checkInDue && lastCheckIn && (
        <Text className="text-safe text-lg text-center mb-6">
          Last check-in: {lastCheckIn.toLocaleTimeString()}
        </Text>
      )}
      <TouchableOpacity onPress={() => router.back()} className="py-4">
        <Text className="text-white text-xl text-center opacity-90">Back</Text>
      </TouchableOpacity>
    </View>
  );
}
