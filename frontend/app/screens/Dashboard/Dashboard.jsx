import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import BACRing from './BACRing';
import MainLayout from '../../MainLayout';
import BottomNavBar from '../../components/BottomNavBar';
import toastStyles from '../../components/ToastStyles';

const { width } = Dimensions.get('window');


const Dashboard = () => {
  const [bac, setBac] = useState(0.00);
  const [toast, setToast] = useState(null); // { message: string, key: number }
  // For demo: cycle through values from 0.00 to 0.30 by 0.01
  const testValues = Array.from({ length: 31 }, (_, i) => parseFloat((i * 0.01).toFixed(2)));
  const nextBac = () => {
    const idx = testValues.findIndex(v => v === bac);
    setBac(testValues[(idx + 1) % testValues.length]);
  };
  // Determine status text based on BAC value (updated ranges)
  let statusText = '';
  if (bac === 0) {
    statusText = 'You are sober';
  } else if (bac > 0 && bac < 0.04) {
    statusText = 'Drinking light, relaxed';
  } else if (bac >= 0.04 && bac < 0.08) {
    statusText = 'Reduced inhibition';
  } else if (bac >= 0.08 && bac < 0.15) {
    statusText = 'You CANNOT drive';
  } else if (bac >= 0.15 && bac < 0.20) {
    statusText = 'Blackout possible soon';
  } else if (bac >= 0.20 && bac <= 0.30) {
    statusText = 'Coma is possible';
  }

  // Show toast for 2 seconds
  const showToast = (message) => {
    const key = Date.now();
    setToast({ message, key });
    setTimeout(() => {
      setToast((t) => (t && t.key === key ? null : t));
    }, 2000);
  };

  const handleNotifyGroup = () => {
    showToast(`You notified your group: BAC status is ${bac.toFixed(2)}`);
    // Here you could also trigger a real notification/send event
  };

  return (
    <MainLayout>
      <View style={styles.container}>
        {/* Top Label */}
        <Text style={styles.headerLabel}>Your Blood Alcohol Content</Text>
        {/* Main Circular Gauge */}
        <View style={styles.gaugeContainer}>
          <BACRing value={bac} size={240} />
          <TouchableOpacity style={{marginTop: 24, backgroundColor: '#444', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 10}} onPress={nextBac}>
            <Text style={{color: 'white', fontSize: 16, fontWeight: '600'}}>Test Next BAC</Text>
          </TouchableOpacity>
        </View>
        {/* Status Text */}
        <Text style={styles.statusText}>{statusText}</Text>
        {/* Action Buttons Row */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.glassButton} onPress={handleNotifyGroup}>
            <Text style={styles.buttonText}>Notify Group</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.glassButton}>
            <Text style={styles.buttonText}>Go Home</Text>
          </TouchableOpacity>
        </View>
        {/* Toast notification */}
        {toast && (
          <View style={toastStyles.toastContainer} pointerEvents="none">
            <Text style={toastStyles.toastText}>{toast.message}</Text>
          </View>
        )}
      </View>
      {/* Bottom Navigation Bar */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', zIndex: 100 }}>
        <BottomNavBar />
      </View>
    </MainLayout>
  );
};

export default Dashboard;

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