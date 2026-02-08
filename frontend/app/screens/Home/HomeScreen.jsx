import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import MainLayout from '../../MainLayout';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/UserContext';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const router = useRouter();
  const { firstName } = useUser();
  return (
    <MainLayout>
      <View style={styles.container}>
        {/* Welcome Text Section */}
        <View style={styles.textSection}>
          <Text style={styles.greetingText}>Hi, {firstName}</Text>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleText}>Ready for the night?</Text>
            {/* Small icon next to subtitle (simulated from HTML) */}
            <Image 
              source={{ uri: 'https://img.icons8.com/ios-filled/50/ffffff/cheers.png' }} 
              style={styles.cheersIcon} 
            />
          </View>
        </View>
        {/* Buttons Section */}
        <View style={styles.buttonSection}>
          <ActionButton 
            text="Create Group" 
            iconUri="https://img.icons8.com/ios-glyphs/30/ffffff/plus-math.png"
          />
          <ActionButton 
            text="Join Group" 
            iconUri="https://img.icons8.com/ios-filled/50/ffffff/conference-call.png"
            onPress={() => router.push('../Dashboard/Dashboard')}
          />
        </View>
      </View>
    </MainLayout>
  );
};

// --- Reusable Button Component for this screen ---
const ActionButton = ({ text, iconUri, onPress }) => (
  <TouchableOpacity activeOpacity={0.8} style={styles.actionButton} onPress={onPress}>
    {/* Icon */}
    <View style={styles.iconContainer}>
      <Image source={{ uri: iconUri }} style={styles.btnIcon} />
    </View>
    {/* Text */}
    <Text style={styles.btnText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', // Centers content horizontally
    justifyContent: 'center', // Centers content vertically
  },
  textSection: {
    marginBottom: 60,
    width: '100%',
    paddingHorizontal: 40,
  },
  greetingText: {
    color: 'white',
    // The design requests 96px, but that's often too large for mobile widths.
    // I've set it to 80px to prevent word-breaking issues while keeping it huge.
    fontSize: 80, 
    fontFamily: 'Instrument Serif', // Ensure this font is linked
    fontWeight: '400',
    lineHeight: 80,
    letterSpacing: 2,
    marginBottom: 10,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  subtitleText: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 24,
    fontFamily: 'Inter',
    fontWeight: '400',
  },
  cheersIcon: {
    width: 24,
    height: 24,
    opacity: 0.72,
    tintColor: 'white',
  },
  buttonSection: {
    gap: 30, // Space between the two buttons
    alignItems: 'center',
  },
  actionButton: {
    width: 250,
    height: 88,
    // Simulating the gradient/blend-mode with a solid distinct color
    backgroundColor: '#9A4655', 
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    // CSS Box Shadow: 3px 10px 4px rgba(68, 68, 68, 0.25)
    shadowColor: '#444',
    shadowOffset: { width: 3, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8, // For Android shadow
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnIcon: {
    width: 20,
    height: 20,
    tintColor: '#F5F5F5',
  },
  btnText: {
    color: '#F5F5F5',
    fontSize: 18,
    fontFamily: 'Inter',
    fontWeight: '400',
  },
});

export default HomeScreen;