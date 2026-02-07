import React from "react";
import { View, Text, Image, StyleSheet, Dimensions, Pressable } from "react-native";
import { useRouter } from 'expo-router';

const Screen = () => {
	const router = useRouter();
	return (
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
				style={styles.mainImage}
				source={require('../../assets/barbabes_logo.png')}
			/>
			{/* Google Sign In Button */}
			<View style={styles.googleBtnContainer}>
				<View style={styles.googleBtnBackground} />
				<Image
					style={styles.googleIcon}
					source={require('../../assets/google-color.png')}
				/>
				<Text style={styles.googleText}>Sign in with Google</Text>
			</View>
			{/* Divider Text */}
			<View style={styles.dividerContainer}>
				<Text style={styles.dividerText}>or with email and password</Text>
			</View>
			{/* Input Boxes */}
			{/* Input 1 (Email) Box */}
			<View style={styles.inputBoxEmail} />
			{/* Input 1 Label - Positioned absolutely as per HTML design */}
			<Text style={styles.emailLabel}>Email address</Text>
			{/* Input 2 (Password) Box */}
			<View style={styles.inputBoxPassword} />
			{/* Input 2 Label */}
			<Text style={styles.passwordLabel}>Password</Text>
			{/* Sign Up Button */}
			<Pressable
				style={styles.signupBtnBackground}
				onPress={() => router.push('/screens/User/Profile')}
			>
				<Text style={styles.signupBtnText}>SIGN UP NOW</Text>
			</Pressable>
		</View>
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
	googleBtnContainer: {
		width: 310,
		height: 62,
		left: 41,
		top: 361,
		position: "absolute",
	},
	googleBtnBackground: {
		width: 310,
		height: 62,
		left: 0,
		top: 0,
		position: "absolute",
		backgroundColor: "rgba(255, 255, 255, 0.15)",
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.50)",
	},
	googleIcon: {
		width: 30,
		height: 30,
		left: 21,
		top: 16,
		position: "absolute",
	},
	googleText: {
		left: 82,
		top: 20,
		position: "absolute",
		textAlign: "center",
		color: "white",
		fontSize: 16,
		fontFamily: "Inter",
		fontWeight: "400",
		lineHeight: 22.4,
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
	emailLabel: {
		width: 106,
		height: 21,
		left: 77,
		top: 501, // 481 (box top) + 20 padding
		position: "absolute",
		textAlign: "center", // inherited from HTML but might need 'left' depending on preference
		color: "white",
		fontSize: 16,
		fontFamily: "Inter",
		fontWeight: "400",
		lineHeight: 22.4,
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
	passwordLabel: {
		width: 106,
		height: 21,
		left: 77,
		top: 572,
		position: "absolute",
		color: "white",
		fontSize: 16,
		fontFamily: "Inter",
		fontWeight: "400",
		lineHeight: 22.4,
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
});

export default Screen;
