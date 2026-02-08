import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import MainLayout from '../../MainLayout';
import BottomNavBar from '../../components/BottomNavBar';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  return (
    <MainLayout>
      <View style={styles.container}>
        
        {/* Top Label */}
        <Text style={styles.headerLabel}>Your Blood Alcohol Content</Text>

        {/* Main Circular Gauge */}
        <View style={styles.gaugeContainer}>
          {/* Outer Glow/Ring */}
          <View style={styles.outerRing}>
            {/* Inner Circle */}
            <View style={styles.innerCircle}>
              <Text style={styles.bacValue}>0.06</Text>
            </View>
          </View>
        </View>

        {/* Status Text */}
        <Text style={styles.statusText}>Take a Break</Text>

        {/* Action Buttons Row */}
        <View style={styles.buttonRow}>
          {/* Button 1: Outlined */}
          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.buttonText}>Notify Group</Text>
          </TouchableOpacity>

          {/* Button 2: Filled/Glass */}
          <TouchableOpacity style={styles.glassButton}>
            <Text style={styles.buttonText}>Go Home</Text>
          </TouchableOpacity>
        </View>

      </View>
      
      {/* Bottom Navigation Bar */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', zIndex: 100 }}>
        <BottomNavBar />
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40, // Space from top navbar
  },
  headerLabel: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Inter',
    fontWeight: '200',
    marginBottom: 40,
    letterSpacing: 0.5,
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  outerRing: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow to simulate the glow in design
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
    backgroundColor: 'rgba(127, 59, 74, 0.3)', // Subtle dark fill
  },
  innerCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 10,
    borderColor: 'rgba(255, 255, 255, 0.1)', // The "track" of the progress
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: '#FF6B6B', // Simulating the "Progress" part at the top
    borderRightColor: '#FF6B6B', // Continued progress
    transform: [{ rotate: '-45deg' }], // Rotate so the gap/progress looks natural
  },
  bacValue: {
    color: 'white',
    fontSize: 84, // Very large text
    fontFamily: 'Inter',
    fontWeight: '300',
    transform: [{ rotate: '45deg' }], // Counter-rotate text so it's straight
  },
  statusText: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Inter',
    fontWeight: '300',
    marginBottom: 50,
    opacity: 0.9,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    gap: 15,
  },
  outlineButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Glassy effect
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '400',
  },
});