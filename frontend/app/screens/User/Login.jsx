import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions, Pressable, TextInput, Alert, Keyboard, TouchableWithoutFeedback } from "react-native";
import { useRouter } from 'expo-router';

const API_URL = process.env.API_URL;

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const Screen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSignUp = () => {
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
    if (valid) {
      router.push({ pathname: '/screens/User/Profile', params: { email } });
    }
  };

return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
            {/* Background Blobs */}
            {/* Note: Standard RN Views do not support CSS 'filter: blur'.
                    For actual blurs, use react-native-svg or specific blur libraries. */}

            {/* Bottom Red Blob */}
            <View style={[styles.blob, styles.blobBottomRed]} />
            {/* Bottom Light Blob */}
            <View style={[styles.blob, styles.blobBottomLight]} />
            {/* Top Red Blob (Right) */}
            <View style={[styles.blob, styles.blobTopRedRight]} />
            {/* Top Light Blob (Right) */}
            <View style={[styles.blob, styles.blobTopLightRight]} />
            {/* Top Red Blob (Left) */}
            <View style={[styles.blob, styles.blobTopRedLeft]} />
            {/* Top Light Blob (Left) */}
            <View style={[styles.blob, styles.blobTopLightLeft]} />
            {/* Main Center Image */}
            <Image
                style={[styles.mainImage, { top: 60 }]}
                source={require('../../assets/barbabes_logo.png')}
            />
            {/* Email/Password UI below logo */}
            {/* Input 1 (Email) Box */}
            <View style={[styles.inputBoxEmail, { top: 300 }]} />
            <TextInput
                style={[styles.textInput, { left: 60, top: 314, position: 'absolute', width: 270, height: 40, color: 'white' }]}
                placeholder="Email address"
                placeholderTextColor="#ccc"
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={setEmail}
            />
            {emailError ? (
                <Text style={{ color: 'red', position: 'absolute', left: 58, top: 343, fontSize: 12, width: 270, textAlign: 'left', backgroundColor: 'transparent', paddingHorizontal: 2, lineHeight: 14 }} numberOfLines={2} ellipsizeMode="tail">{emailError}</Text>
            ) : null}
            {/* Input 2 (Password) Box */}
            <View style={[styles.inputBoxPassword, { top: 370 }]} />
            <TextInput
                style={[styles.textInput, { left: 60, top: 384, position: 'absolute', width: 270, height: 40, color: 'white' }]}
                placeholder="Password"
                placeholderTextColor="#ccc"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
            />
            {passwordError ? (
                <Text style={{ color: 'red', position: 'absolute', left: 58, top: 413, fontSize: 12, width: 270, textAlign: 'left', backgroundColor: 'transparent', paddingHorizontal: 2, lineHeight: 14 }} numberOfLines={2} ellipsizeMode="tail">{passwordError}</Text>
            ) : null}
            {/* Sign Up Button */}
            <Pressable
                style={[styles.signupBtnBackground, { top: 450 }]}
                onPress={handleSignUp}
            >
                <Text style={styles.signupBtnText}>LOG IN</Text>
            </Pressable>
            {/* Divider Text */}
            <View style={[styles.dividerContainer, { top: 530 }]}>
                <Text style={styles.dividerText}>or you can</Text>
            </View>
            {/* Go to SignIn.jsx */}
						<Pressable
								style={[styles.signupBtnBackground, { top: 570 }]}
								onPress={async () => {
									// Minimal demo: send all required info to /users, then go to HomeScreen.jsx
									const userPayload = {
										user_id: email,
										first_name: 'First',
										last_name: 'Last',
										age: 21,
										weight_kg: 70,
										sex: 'male',
										primary_contact: '555-555-5555',
										is_cut_off: false
									};
									try {
										await fetch((process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000') + '/users', {
											method: 'POST',
											headers: { 'Content-Type': 'application/json' },
											body: JSON.stringify(userPayload),
										});
									} catch (e) {}
									router.replace('/screens/Dashboard/GroupMapScreen');
								}}
						>
								<Text style={[styles.signupBtnText, { color: '#6B1F2E' }]}>REGISTER</Text>
						</Pressable>
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
		left: 76,
		top: 80,
		position: "absolute",
	},
	dividerContainer: {
		width: 278,
		height: 23,
		left: 57,
		top: 440,
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
	},
	dividerText: {
		textAlign: "center",
		color: "white",
		fontSize: 16,
		fontFamily: "Inter",
		fontWeight: "400",
		lineHeight: 22.4,
	},
	inputBoxEmail: {
		width: 310,
		height: 62,
		left: 41,
		top: 481,
		position: "absolute",
		backgroundColor: "rgba(255, 255, 255, 0.15)",
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.50)",
	},
	inputBoxPassword: {
		width: 310,
		height: 62,
		left: 41,
		top: 552,
		position: "absolute",
		backgroundColor: "rgba(255, 255, 255, 0.15)",
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.50)",
	},
	signupBtnBackground: {
		width: 310,
		height: 67,
		left: 41,
		top: 634,
		position: "absolute",
		backgroundColor: "#F5F2C9",
		borderRadius: 20,
		borderWidth: 5,
		borderColor: "#490419",
	},
	signupBtnText: {
		textAlign: "center",
		color: "#500119",
		fontSize: 16,
		fontFamily: "Inter",
		fontWeight: "700",
		lineHeight: 22.4,
		letterSpacing: 1.6,
        top: 20, // Center text vertically in the button (67 height - 22.4 lineHeight) / 2
	},
	textInput: {
		fontSize: 16,
		paddingleft: 10,
		backgroundColor: 'transparent',
		borderWidth: 0,
	},
});

export default Screen;
