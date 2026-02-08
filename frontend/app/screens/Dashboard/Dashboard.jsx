import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import BACRing from './BACRing';
import MainLayout from '../../MainLayout';
import BottomNavBar from '../../components/BottomNavBar';
import toastStyles from '../../components/ToastStyles';
import { useUser } from '../../context/UserContext';

const { width } = Dimensions.get('window');
const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

// One US standard drink ≈ 14g alcohol
const GRAMS_PER_DRINK = 14;

const Dashboard = () => {
  const router = useRouter();
  const { userId, weight, gender, firstName, lastName } = useUser();
  const [bac, setBac] = useState(0);
  const [recommendation, setRecommendation] = useState('');
  const [drinks, setDrinks] = useState(0);
  const [timeElapsedMinutes, setTimeElapsedMinutes] = useState(0);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reactionTimeMs, setReactionTimeMs] = useState(null); // mock or from game

  // Data guard: if weight or gender missing, block dashboard until user goes to Profile
  const hasWeight = weight != null && weight !== '' && !isNaN(parseFloat(weight)) && parseFloat(weight) > 0;
  const hasGender = gender === 'Male' || gender === 'Female';
  const profileIncomplete = !hasWeight || !hasGender;

  const calculateBAC = useCallback(async () => {
    const w = parseFloat(weight, 10);
    if (!weight || isNaN(w) || w <= 0) return;
    const sex = gender === 'Male' ? 'male' : gender === 'Female' ? 'female' : 'male';
    const weight_kg = w * 0.453592;
    const alcohol_grams = drinks * GRAMS_PER_DRINK;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/bac/estimate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId || 'anonymous',
          weight_kg,
          sex,
          alcohol_grams,
          time_elapsed_minutes: timeElapsedMinutes,
        }),
      });
      if (!res.ok) throw new Error('BAC estimate failed');
      const data = await res.json();
      setBac(data.bac ?? 0);
      // Fetch Gemini recommendation
      const recRes = await fetch(`${API_BASE}/sobriety/recommendation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bac: data.bac ?? 0,
          reaction_time_ms: reactionTimeMs ?? undefined,
        }),
      });
      if (recRes.ok) {
        const recData = await recRes.json();
        setRecommendation(recData.recommendation || '');
      } else {
        setRecommendation('');
      }
    } catch (e) {
      setToast({ message: e.message || 'Could not calculate BAC', key: Date.now() });
      setTimeout(() => setToast((t) => (t?.key === Date.now() ? null : t)), 2000);
    } finally {
      setLoading(false);
    }
  }, [userId, weight, gender, drinks, timeElapsedMinutes, reactionTimeMs]);

  useEffect(() => {
    if (weight && gender && (drinks > 0 || bac > 0)) {
      calculateBAC();
    } else if (drinks === 0 && timeElapsedMinutes === 0) {
      setBac(0);
      setRecommendation('');
    }
  }, [drinks, timeElapsedMinutes, weight, gender]);

  const showToast = (message) => {
    const key = Date.now();
    setToast({ message, key });
    setTimeout(() => setToast((t) => (t && t.key === key ? null : t)), 2000);
  };

  const handleNotifyGroup = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/groups/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          message: bac.toFixed(2),
        }),
      });
      if (res.ok) {
        showToast(`Group notified. BAC: ${bac.toFixed(2)}`);
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.detail || 'Not in a group');
      }
    } catch (e) {
      showToast(e.message || 'Could not notify group');
    }
  }, [userId, bac]);

  const handleGoHome = useCallback(() => {
    handleNotifyGroup();
    Linking.openURL('uber://?action=setPickup&pickup=my_location').catch(() => {
      Linking.openURL('https://m.uber.com').catch(() => {});
    });
  }, [handleNotifyGroup]);

  const statusText = recommendation || (bac === 0 ? 'You are sober' : `BAC ${bac.toFixed(2)}`);

  if (profileIncomplete) {
    return (
      <MainLayout>
        <View style={styles.container}>
          <Text style={styles.headerLabel}>Profile Incomplete</Text>
          <Text style={styles.statusText}>
            Please set your weight and gender in Profile to calculate BAC.
          </Text>
          <View style={styles.profileCtaWrap}>
            <TouchableOpacity
              style={styles.glassButton}
              onPress={() => router.replace('/profile')}
            >
              <Text style={styles.buttonText}>Go to Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <View style={styles.container}>
        <Text style={styles.headerLabel}>Your Blood Alcohol Content</Text>
        <View style={styles.gaugeContainer}>
          <BACRing value={bac} size={240} />
          {loading && (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          )}
          {/* Standard drinks stepper */}
          <View style={styles.stepperRow}>
            <Text style={styles.stepperLabel}>Standard drinks</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setDrinks((d) => Math.max(0, d - 1))}
              >
                <Text style={styles.stepperBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{drinks}</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setDrinks((d) => d + 1)}
              >
                <Text style={styles.stepperBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.recalcButton} onPress={calculateBAC}>
            <Text style={styles.recalcButtonText}>Recalculate BAC</Text>
          </TouchableOpacity>
          {/* NFC scaffold (commented): use expo-nfc-manager to scan tag then increment drinks.
          import NfcManager from 'expo-nfc-manager';
          useEffect(() => { NfcManager.start(); return () => NfcManager.stop(); }, []);
          NfcManager.registerTagEvent(tag => { setDrinks(d => d + 1); showToast('Drink added'); });
          NfcManager.unregisterTagEvent() on unmount. */}
          <TouchableOpacity
            style={styles.nfcButton}
            onPress={() => {
              setDrinks((d) => d + 1);
              showToast('NFC Tap Drink');
            }}
          >
            <Text style={styles.nfcButtonText}>NFC Tap Drink</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.statusText}>{statusText}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.glassButton} onPress={handleNotifyGroup}>
            <Text style={styles.buttonText}>Notify Group</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.glassButton} onPress={handleGoHome}>
            <Text style={styles.buttonText}>Go Home</Text>
          </TouchableOpacity>
        </View>
        {toast && (
          <View style={toastStyles.toastContainer} pointerEvents="none">
            <Text style={toastStyles.toastText}>{toast.message}</Text>
          </View>
        )}
      </View>
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
    paddingTop: 40,
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
  loadingWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  stepperLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  stepperBtn: {
    width: 40,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperBtnText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
  },
  stepperValue: {
    color: 'white',
    fontSize: 18,
    minWidth: 32,
    textAlign: 'center',
  },
  recalcButton: {
    marginTop: 12,
    backgroundColor: '#444',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  recalcButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  nfcButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  nfcButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  statusText: {
    color: 'white',
    fontSize: 22,
    fontFamily: 'Inter',
    fontWeight: '300',
    marginBottom: 50,
    opacity: 0.9,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  profileCtaWrap: {
    width: '100%',
    paddingHorizontal: 30,
    marginTop: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    gap: 15,
  },
  glassButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
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
