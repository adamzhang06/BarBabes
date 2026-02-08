// Profile photo button with silhouette logic
import { useUser } from "../../context/UserContext";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import WomanSilhouette from "../../assets/woman_silhouette.png";
import Slider from "@react-native-community/slider";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  TextInput,
  Modal,
  Pressable,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";

const { width, height } = Dimensions.get("window");
const DEFAULT_SILHOUETTE_URI = Image.resolveAssetSource(WomanSilhouette).uri;

function ProfilePhotoButton() {
  const { photoUri, setPhotoUri } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  React.useEffect(() => {
    if (!photoUri) setPhotoUri(DEFAULT_SILHOUETTE_URI);
    // eslint-disable-next-line
  }, []);
  const hasPhoto = photoUri && photoUri !== DEFAULT_SILHOUETTE_URI;

  const handleAddPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Allow access to your photo library to choose a profile photo.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setPhotoUri(result.assets[0].uri);
    }
    setModalVisible(false);
  };

  const handleRemovePhoto = () => {
    setPhotoUri(DEFAULT_SILHOUETTE_URI);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.profilePhotoButton}
        activeOpacity={0.7}
        onPress={() => setModalVisible(true)}
      >
        <Image
          source={{ uri: photoUri || DEFAULT_SILHOUETTE_URI }}
          style={styles.profilePhotoImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.photoModalOverlay}>
          <View style={styles.photoModalContent}>
            {hasPhoto ? (
              <TouchableOpacity
                style={styles.photoModalOption}
                onPress={handleRemovePhoto}
              >
                <Text style={styles.photoModalOptionText}>Remove Photo</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={styles.photoModalOption}
              onPress={handleAddPhoto}
            >
              <Text style={styles.photoModalOptionText}>
                {hasPhoto ? "Replace Photo" : "Add Photo"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.photoModalOption}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.photoModalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
function ProfileScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const {
    firstName,
    setFirstName,
    setUserId,
    setWeight: setContextWeight,
    setGender: setContextGender,
    tolerance,
    setTolerance,
    phone,
    setPhone,
  } = useUser();
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [heightFt, setHeightFt] = useState();
  const [heightIn, setHeightIn] = useState();
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

  const handleCompleteSignup = async () => {
    if (!email) {
      Alert.alert(
        "Missing email",
        "Please go back and enter an email address.",
      );
      return;
    }
    const ageNum = parseInt(age, 10);
    const weightLbs = parseFloat(weight);
    if (!ageNum || ageNum < 18) {
      Alert.alert("Invalid age", "Please enter a valid age (18+).");
      return;
    }
    if (!weightLbs || weightLbs <= 0) {
      Alert.alert("Invalid weight", "Please enter your weight.");
      return;
    }
    if (!gender) {
      Alert.alert("Missing gender", "Please select a gender.");
      return;
    }

    const weightKg = Math.round(weightLbs * 0.45359237 * 100) / 100;
    const primaryContact = phone && phone.trim() ? phone.trim() : email;
    const payload = {
      user_id: email,
      age: ageNum,
      weight_kg: weightKg,
      sex: gender.toLowerCase(),
      primary_contact: primaryContact,
    };

    try {
      setIsSaving(true);
      const healthUrl = `${API_URL}/health`;
      const healthRes = await fetch(healthUrl);
      if (!healthRes.ok) {
        const text = await healthRes.text();
        Alert.alert(
          "Server not ready",
          `Health check failed (${healthRes.status}).\n\n${healthUrl}\n\n${text}`,
        );
        return;
      }

      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        if (res.status === 409) {
          Alert.alert(
            "Account exists",
            "A user with this email already exists.",
          );
        } else {
          Alert.alert(
            "Sign up failed",
            text || "Unable to create your account.",
          );
        }
        return;
      }
      const toleranceValue = typeof tolerance === "number" ? tolerance : 5;
      try {
        await fetch(`${API_URL}/users/${encodeURIComponent(email)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tolerance: toleranceValue }),
        });
      } catch (_) {}
      setUserId(email);
      setContextWeight(weight);
      setContextGender(gender);
      setTolerance(toleranceValue);
      setPhone(primaryContact);
      router.push("../Home/HomeScreen");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      Alert.alert("Network error", `Unable to reach the server.\n\n${message}`);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {/* Background Blobs */}
        <View style={styles.blobRed} />
        <View style={styles.blobLight} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.contentContainer}>
            <View style={styles.titleRow}>
              <Text
                style={styles.titleText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Profile
              </Text>
              <ProfilePhotoButton />
            </View>
            <View style={styles.formContainer}>
              <View style={styles.row}>
                <View style={[styles.inputContainer, { flex: 0.48 }]}>
                  <TextInput
                    style={styles.formInput}
                    value={firstName || ""}
                    onChangeText={setFirstName}
                    placeholder="First name"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    autoCapitalize="words"
                  />
                </View>
                <View style={[styles.inputContainer, { flex: 0.48 }]}>
                  <TextInput
                    style={styles.formInput}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last name"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    autoCapitalize="words"
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={[styles.inputContainer, { flex: 0.4 }]}>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Age"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    keyboardType="numeric"
                    maxLength={3}
                    inputMode="numeric"
                    onChangeText={(text) => {
                      const numeric = text.replace(/[^0-9]/g, "");
                      setAge(numeric);
                    }}
                    value={age}
                  />
                </View>
                <GenderDropdown
                  containerStyle={{ flex: 0.55 }}
                  gender={gender}
                  setGender={setGender}
                />
              </View>
              {/* Row 3: Height & Weight */}
              <View style={styles.row}>
                {/* Height input with modal picker and label */}
                <HeightPicker
                  heightFt={heightFt}
                  setHeightFt={setHeightFt}
                  heightIn={heightIn}
                  setHeightIn={setHeightIn}
                />
                {/* Weight input styled like Gender */}
                <View
                  style={[
                    styles.inputContainer,
                    {
                      flex: 0.55,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      position: "relative",
                    },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <TextInput
                      style={{
                        color: "white",
                        fontSize: 14,
                        backgroundColor: "transparent",
                        width: 54,
                        borderBottomWidth: 1,
                        borderColor: "rgba(255,255,255,0.3)",
                        paddingVertical: 0,
                        paddingHorizontal: 0,
                      }}
                      value={weight}
                      onChangeText={(text) => {
                        const num = text.replace(/[^0-9]/g, "");
                        let val = num;
                        if (val.length > 3) val = val.slice(0, 3);
                        setWeight(val);
                      }}
                      keyboardType="numeric"
                      maxLength={3}
                      placeholder="Weight"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      inputMode="numeric"
                    />
                    <Text
                      style={{ color: "white", fontSize: 14, marginLeft: 4 }}
                    >
                      lbs
                    </Text>
                  </View>
                </View>
              </View>
              <View style={[styles.inputContainer, { width: "100%" }]}>
                <TextInput
                  style={styles.formInput}
                  value={phone || ""}
                  onChangeText={setPhone}
                  placeholder="Primary contact (phone)"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  keyboardType="phone-pad"
                />
              </View>
              <ToleranceSlider />
              {/* Action Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.mainButton}
                onPress={handleCompleteSignup}
                disabled={isSaving}
              >
                <Text style={styles.buttonText}>
                  {isSaving
                    ? "Creating Account..."
                    : "Discover Your BAC Tolerance"}
                </Text>
              </TouchableOpacity>
            </View>
            {/* end formContainer */}
          </View>
          {/* end contentContainer */}
        </SafeAreaView>
        {/* end safeArea */}
      </View>
    </TouchableWithoutFeedback>
  );
}

// Tolerance Level Slider Component (uses UserContext)
function ToleranceSlider() {
  const { tolerance, setTolerance } = useUser();
  const value = typeof tolerance === "number" ? tolerance : 5;
  // Colorful gradient: 1 (red) to 10 (green)
  const getThumbColor = (val) => {
    // Interpolate from red (#FF4B4B) to yellow (#FFD600) to green (#39FF14)
    if (val <= 5) {
      // Red to yellow
      const t = (val - 1) / 4;
      return interpolateColor("#FF4B4B", "#FFD600", t);
    } else {
      // Yellow to green
      const t = (val - 5) / 5;
      return interpolateColor("#FFD600", "#39FF14", t);
    }
  };
  function interpolateColor(a, b, t) {
    // a, b: hex colors, t: 0-1
    const ah = a.replace("#", "");
    const bh = b.replace("#", "");
    const ar = parseInt(ah.substring(0, 2), 16);
    const ag = parseInt(ah.substring(2, 4), 16);
    const ab = parseInt(ah.substring(4, 6), 16);
    const br = parseInt(bh.substring(0, 2), 16);
    const bg = parseInt(bh.substring(2, 4), 16);
    const bb = parseInt(bh.substring(4, 6), 16);
    const rr = Math.round(ar + (br - ar) * t);
    const rg = Math.round(ag + (bg - ag) * t);
    const rb = Math.round(ab + (bb - ab) * t);
    return `#${rr.toString(16).padStart(2, "0")}${rg.toString(16).padStart(2, "0")}${rb.toString(16).padStart(2, "0")}`;
  }
  return (
    <View style={styles.toleranceSliderWrap}>
      <View style={styles.toleranceSliderHeader}>
        <Text style={styles.toleranceLabel}>Tolerance Level:</Text>
        <Text style={styles.toleranceValue}>{value}</Text>
      </View>
      <View style={styles.toleranceSliderRow}>
        <View style={styles.toleranceChip}>
          <Text style={styles.toleranceChipText}>Low</Text>
        </View>
        <Slider
          style={styles.toleranceSlider}
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={value}
          onValueChange={setTolerance}
          minimumTrackTintColor={"white"}
          maximumTrackTintColor={"#444"}
          thumbTintColor={"white"}
        />
        <View style={[styles.toleranceChip, styles.toleranceChipHigh]}>
          <Text style={styles.toleranceChipText}>High</Text>
        </View>
      </View>
    </View>
  );
}

// --- Helper Components ---

const WeightInput = ({ weight, setWeight }) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View
      style={[
        styles.inputContainer,
        {
          flex: 0.48,
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          position: "relative",
        },
      ]}
    >
      <Pressable
        onPress={() => setModalVisible(true)}
        style={{ width: "100%", paddingVertical: 8 }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>
          {weight ? (
            `${weight} lbs`
          ) : (
            <Text style={{ color: "rgba(255,255,255,0.5)" }}>Weight lbs</Text>
          )}
        </Text>
      </Pressable>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          </TouchableWithoutFeedback>
          <View
            style={{
              backgroundColor: "#222",
              borderRadius: 16,
              padding: 24,
              width: 260,
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <TextInput
                style={{
                  color: "white",
                  fontSize: 16,
                  backgroundColor: "transparent",
                  borderBottomWidth: 1,
                  borderColor: "rgba(255,255,255,0.3)",
                  width: 80,
                  marginRight: 8,
                }}
                value={String(weight)}
                onChangeText={(text) => {
                  const num = text.replace(/[^0-9]/g, "");
                  let val = num;
                  if (val.length > 3) val = val.slice(0, 3);
                  setWeight(val);
                }}
                keyboardType="numeric"
                maxLength={3}
                placeholder="Weight lbs"
                placeholderTextColor="rgba(255,255,255,0.5)"
                inputMode="numeric"
              />
              <Text style={{ color: "white", fontSize: 16, marginLeft: 4 }}>
                lbs
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                marginTop: 8,
                backgroundColor: "#BE5C5C",
                borderRadius: 8,
                paddingVertical: 8,
                paddingHorizontal: 24,
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const HeightPicker = ({ heightFt, setHeightFt, heightIn, setHeightIn }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [ftInput, setFtInput] = useState(heightFt ? String(heightFt) : "");
  const [inInput, setInInput] = useState(heightIn ? String(heightIn) : "");
  const showHeight =
    heightFt &&
    heightIn &&
    !isNaN(parseInt(heightFt)) &&
    !isNaN(parseInt(heightIn));
  return (
    <View
      style={[
        styles.inputContainer,
        {
          flex: 0.4,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "relative",
        },
      ]}
    >
      <Pressable
        onPress={() => {
          setFtInput(heightFt ? String(heightFt) : "");
          setInInput(heightIn ? String(heightIn) : "");
          setModalVisible(true);
        }}
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 8,
        }}
      >
        {showHeight ? (
          <Text style={{ color: "white", fontSize: 14 }}>
            {heightFt} ft {heightIn} in
          </Text>
        ) : (
          <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
            Height
          </Text>
        )}
      </Pressable>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          </TouchableWithoutFeedback>
          <View
            style={{
              backgroundColor: "#222",
              borderRadius: 16,
              padding: 24,
              width: 280,
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <TextInput
                style={{
                  color: "white",
                  fontSize: 16,
                  backgroundColor: "transparent",
                  borderBottomWidth: 1,
                  borderColor: "rgba(255,255,255,0.3)",
                  width: 40,
                  marginRight: 4,
                }}
                value={ftInput}
                onChangeText={(text) => {
                  const num = text.replace(/[^0-9]/g, "");
                  setFtInput(num);
                }}
                keyboardType="numeric"
                maxLength={1}
                placeholder="ft"
                placeholderTextColor="rgba(255,255,255,0.5)"
                inputMode="numeric"
              />
              <Text style={{ color: "white", fontSize: 16, marginRight: 12 }}>
                ft
              </Text>
              <TextInput
                style={{
                  color: "white",
                  fontSize: 16,
                  backgroundColor: "transparent",
                  borderBottomWidth: 1,
                  borderColor: "rgba(255,255,255,0.3)",
                  width: 40,
                  marginLeft: 8,
                  marginRight: 4,
                }}
                value={inInput}
                onChangeText={(text) => {
                  const num = text.replace(/[^0-9]/g, "");
                  setInInput(num);
                }}
                keyboardType="numeric"
                maxLength={2}
                placeholder="in"
                placeholderTextColor="rgba(255,255,255,0.5)"
                inputMode="numeric"
              />
              <Text style={{ color: "white", fontSize: 16, marginLeft: 4 }}>
                in
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                const ftVal = parseInt(ftInput);
                const inVal = parseInt(inInput);
                if (!isNaN(ftVal) && ftVal >= 3 && ftVal <= 7)
                  setHeightFt(ftVal);
                if (!isNaN(inVal) && inVal >= 0 && inVal <= 11)
                  setHeightIn(inVal);
                setModalVisible(false);
              }}
              style={{
                marginTop: 8,
                backgroundColor: "#BE5C5C",
                borderRadius: 8,
                paddingVertical: 8,
                paddingHorizontal: 24,
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const GenderDropdown = ({ containerStyle, gender, setGender }) => {
  const [open, setOpen] = useState(false);
  return (
    <View
      style={[
        styles.inputContainer,
        containerStyle,
        { position: "relative", zIndex: 10 },
      ]}
    >
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: gender ? "white" : "rgba(255,255,255,0.5)",
            fontSize: 14,
          }}
        >
          {gender || "Gender"}
        </Text>
        <Text style={{ color: "white", fontSize: 12, marginLeft: 8 }}>▼</Text>
      </TouchableOpacity>
      {open && (
        <View
          style={{
            position: "absolute",
            top: 48,
            left: 0,
            right: 0,
            backgroundColor: "#333",
            borderRadius: 10,
            elevation: 8,
            zIndex: 100,
          }}
        >
          {["Male", "Female"].map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => {
                setGender(option);
                setOpen(false);
              }}
              style={{
                padding: 14,
                borderBottomWidth: option === "Male" ? 1 : 0,
                borderBottomColor: "rgba(255,255,255,0.08)",
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const InputField = ({ label, isDropdown, containerStyle }) => (
  <View style={[styles.inputContainer, containerStyle]}>
    <Text style={styles.inputLabel}>{label}</Text>
    {isDropdown && <Text style={styles.dropdownArrow}>▼</Text>}
  </View>
);

const Divider = () => (
  <View style={styles.dividerContainer}>
    <View style={styles.dividerLine} />
    {/* Small gap */}
    <View style={{ width: 20 }} />
    <View style={styles.dividerLine} />
  </View>
);

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7F3B4A",
  },
  blobRed: {
    position: "absolute",
    width: 600,
    height: 600,
    backgroundColor: "#B4524C",
    borderRadius: 300,
    top: height * 0.4, // Responsive positioning
    left: -200,
    opacity: 0.6,
  },
  blobLight: {
    position: "absolute",
    width: 500,
    height: 500,
    backgroundColor: "#FFC9C9",
    borderRadius: 250,
    top: height * 0.5,
    left: -150,
    opacity: 0.15,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 20,
    justifyContent: "space-evenly", // Distributes space so it fills screen exactly
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#ddd",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  userName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  notificationButton: {
    padding: 5,
  },
  iconImage: {
    width: 20,
    height: 20,
    tintColor: "white",
  },
  titleWrapper: {
    alignItems: "center",
    marginVertical: 18,
    width: "100%",
  },
  titleRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 16,
    justifyContent: "space-between",
  },
  titleText: {
    color: "white",
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "600",
    letterSpacing: 0.5,
    textAlign: "left",
    maxWidth: 180,
  },
  profilePhotoButton: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    overflow: "hidden",
  },
  profilePhotoImage: {
    width: "100%",
    height: "100%",
  },
  photoModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  photoModalContent: {
    backgroundColor: "#222",
    borderRadius: 16,
    padding: 24,
    width: 260,
    alignItems: "center",
  },
  photoModalOption: {
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#444",
  },
  photoModalOptionText: {
    color: "white",
    fontSize: 18,
  },
  photoModalCancelText: {
    color: "#aaa",
    fontSize: 16,
  },
  formContainer: {
    gap: 14,
  },
  formInput: {
    color: "white",
    fontSize: 14,
    flex: 1,
    backgroundColor: "transparent",
    padding: 0,
    margin: 0,
  },
  toleranceSliderWrap: {
    marginVertical: 28,
    alignItems: "center",
    width: "100%",
  },
  toleranceSliderHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  toleranceLabel: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 12,
  },
  toleranceValue: {
    color: "white",
    fontSize: 32,
    fontWeight: "700",
  },
  toleranceSliderRow: {
    flexDirection: "row",
    alignItems: "center",
    width: 260,
    justifyContent: "space-between",
  },
  toleranceChip: {
    borderColor: "white",
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginRight: 10,
  },
  toleranceChipHigh: {
    marginRight: 0,
    marginLeft: 10,
  },
  toleranceChipText: {
    color: "white",
    fontSize: 14,
  },
  toleranceSlider: {
    width: 160,
    height: 48,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    height: 45, // Reduced height from 50
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16, // Slightly tighter radius
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  inputLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14, // Slightly smaller text
    fontStyle: "italic",
    fontWeight: "300",
  },
  dropdownArrow: {
    color: "white",
    fontSize: 10,
    opacity: 0.8,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4, // Tighter divider spacing
    opacity: 0.5,
  },
  dividerLine: {
    height: 2,
    width: 40,
    backgroundColor: "#E8DEF8",
    borderRadius: 2,
  },
  mainButton: {
    height: 50,
    backgroundColor: "#BE5C5C",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
});

const pickerSelectStyles = {
  inputIOS: {
    color: "white",
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    marginRight: 8,
  },
  inputAndroid: {
    color: "white",
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    marginRight: 8,
  },
  placeholder: {
    color: "rgba(255,255,255,0.5)",
  },
};

export default ProfileScreen;
