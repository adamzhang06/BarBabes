import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions, Pressable, TextInput, Alert, Keyboard, TouchableWithoutFeedback } from "react-native";
import { useRouter } from 'expo-router';
import { useUser } from '../../context/UserContext';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const Screen = () => {
  const router = useRouter();
  const { setUserId } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    // TODO: Integrate Firebase/Expo Google Auth (expo-auth-session or @react-native-google-signin/google-signin).
    // 1. Request Google ID token via Expo AuthSession or native module.
    // 2. Send token to backend for verification; get or create user.
    // 3. setUserId(...); router.replace('/screens/Home/HomeScreen') or router.push({ pathname: '/screens/User/Profile', params: { email } }).
  };

  const handleSignUp = async () => {
    let valid = true;
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError("");
    }
    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    } else {
      setPasswordError("");
    }
    if (!valid) return;

    setAuthLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/${encodeURIComponent(email)}`);
      if (res.ok) {
        setUserId(email);
        router.replace('/screens/Home/HomeScreen');
      } else {
        router.push({ pathname: '/screens/User/Profile', params: { email } });
      }
    } catch (_) {
      router.push({ pathname: '/screens/User/Profile', params: { email } });
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* Background Blobs */}
        <View style={[styles.blob, styles.blobBottomRed]} />
        <View style={[styles.blob, styles.blobBottomLight]} />
        <View style={[styles.blob, styles.blobTopRedRight]} />
        <View style={[styles.blob, styles.blobTopLightRight]} />
        <View style={[styles.blob, styles.blobTopRedLeft]} />
        <View style={[styles.blob, styles.blobTopLightLeft]} />

        <Image style={styles.mainImage} source={require('../../assets/barbabes_logo.png')} />

        <View style={styles.formColumn}>
          <View style={styles.inputBoxEmail}>
            <TextInput
              style={styles.textInput}
              placeholder="Email address"
              placeholderTextColor="#ccc"
              value={email}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
            />
          </View>
          {emailError ? <Text style={styles.errorText} numberOfLines={2} ellipsizeMode="tail">{emailError}</Text> : null}

          <View style={styles.inputBoxPassword}>
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              placeholderTextColor="#ccc"
              value={password}
              secureTextEntry
              onChangeText={setPassword}
            />
          </View>
          {passwordError ? <Text style={styles.errorText} numberOfLines={2} ellipsizeMode="tail">{passwordError}</Text> : null}

          <Pressable style={styles.signupBtnBackground} onPress={handleSignUp} disabled={authLoading}>
            <Text style={styles.signupBtnText}>{authLoading ? 'Checking...' : 'SIGN UP NOW'}</Text>
          </Pressable>

          <View style={styles.dividerContainer}>
            <Text style={styles.dividerText}>or you can</Text>
          </View>

          <Pressable style={styles.googleBtnContainerBottom} onPress={handleGoogleSignIn} accessibilityRole="button">
            <Image style={styles.googleIcon} source={require('../../assets/google-color.png')} />
            <Text style={styles.googleText}>Sign in with Google</Text>
          </Pressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#7F3B4A",
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
		position: "relative",
	},
	blob: {
		position: "absolute",
		borderRadius: 9999,
		// Note: transformOrigin is not fully supported in RN styles like CSS.
		// Rotation pivots around the center by default.
	},
	blobBottomRed: {
		width: 516,
		height: 528,
		left: -252,
		top: 805.67,
		backgroundColor: "#B4524C",
		transform: [{ rotate: "-30deg" }],
		// Shadow props for iOS
		shadowColor: "#000",
		shadowOffset: { width: 60, height: 60 },
		shadowOpacity: 0.5,
		shadowRadius: 30,
		// Android elevation (cannot replicate precise offset/color of CSS)
		elevation: 10,
	},
	blobBottomLight: {
		width: 359.74,
		height: 364.86,
		left: -240.75,
		top: 806.3,
		backgroundColor: "rgba(255, 201.06, 201.96, 0.26)",
		transform: [{ rotate: "-30deg" }],
		shadowColor: "#000",
		shadowOffset: { width: 80, height: 80 },
		shadowOpacity: 0.5,
		shadowRadius: 40,
	},
	blobTopRedRight: {
		width: 427,
		height: 395,
		left: 41,
		top: -244.86,
		backgroundColor: "rgba(179.60, 82.20, 75.55, 0.56)",
		transform: [{ rotate: "-20deg" }],
		shadowColor: "#000",
		shadowOffset: { width: 60, height: 60 },
		shadowOpacity: 0.5,
		shadowRadius: 30,
	},
	blobTopLightRight: {
		width: 297.69,
		height: 272.96,
		left: 49.9,
		top: -243.15,
		backgroundColor: "rgba(255, 201.06, 201.96, 0.26)",
		transform: [{ rotate: "-20deg" }],
		shadowColor: "#000",
		shadowOffset: { width: 80, height: 80 },
		shadowOpacity: 0.5,
		shadowRadius: 40,
	},
	blobTopRedLeft: {
		width: 427,
		height: 395,
		left: -458,
		top: 29.14,
		backgroundColor: "rgba(179.60, 82.20, 75.55, 0.75)",
		transform: [{ rotate: "-20deg" }],
		shadowColor: "#000",
		shadowOffset: { width: 60, height: 60 },
		shadowOpacity: 0.5,
		shadowRadius: 30,
	},
	blobTopLightLeft: {
		width: 297.69,
		height: 272.96,
		left: -449.1,
		top: 30.85,
		backgroundColor: "rgba(255, 201.06, 201.96, 0.26)",
		transform: [{ rotate: "-20deg" }],
		shadowColor: "#000",
		shadowOffset: { width: 80, height: 80 },
		shadowOpacity: 0.5,
		shadowRadius: 40,
	},
	mainImage: {
		width: 241,
		height: 236,
		position: "absolute",
		top: 60,
		left: (Dimensions.get('window').width - 241) / 2,
	},
	formColumn: {
		position: "absolute",
		top: 300,
		left: 41,
		width: 310,
		alignItems: "center",
	},
	inputBoxEmail: {
		width: 310,
		height: 62,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.15)",
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.50)",
	},
	inputBoxPassword: {
		width: 310,
		height: 62,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.15)",
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.50)",
		marginTop: 12,
	},
	signupBtnBackground: {
		width: 310,
		height: 67,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F5F2C9",
		borderRadius: 20,
		borderWidth: 5,
		borderColor: "#490419",
		marginTop: 20,
	},
	signupBtnText: {
		textAlign: "center",
		color: "#500119",
		fontSize: 16,
		fontFamily: "Inter",
		fontWeight: "700",
		lineHeight: 22.4,
		letterSpacing: 1.6,
	},
	errorText: {
		color: 'red',
		fontSize: 12,
		width: 270,
		textAlign: 'left',
		backgroundColor: 'transparent',
		paddingHorizontal: 2,
		lineHeight: 14,
		marginTop: 4,
	},
	dividerContainer: {
		width: 310,
		height: 23,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 24,
	},
	dividerText: {
		textAlign: "center",
		color: "white",
		fontSize: 16,
		fontFamily: "Inter",
		fontWeight: "400",
		lineHeight: 22.4,
	},
	googleBtnContainerBottom: {
		width: 310,
		height: 62,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#2D1B2F",
		borderRadius: 20,
		marginTop: 16,
		gap: 12,
	},
	googleIcon: {
		width: 30,
		height: 30,
	},
	googleText: {
		textAlign: "center",
		color: "white",
		fontSize: 16,
		fontFamily: "Inter",
		fontWeight: "400",
		lineHeight: 22.4,
	},
	textInput: {
		fontSize: 16,
		width: 270,
		paddingHorizontal: 16,
		paddingVertical: 0,
		backgroundColor: 'transparent',
		borderWidth: 0,
		color: 'white',
	},
});

export default Screen;
