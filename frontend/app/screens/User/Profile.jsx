import React from 'react';
import { useRouter } from 'expo-router';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  StatusBar,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Blobs */}
      <View style={styles.blobRed} />
      <View style={styles.blobLight} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          


          {/* Title (Compacted) */}
          <View style={styles.titleWrapper}>
            <Text style={styles.titleText}>LET’S GET YOU SET UP</Text>
          </View>
          
          {/* Form */}
          <View style={styles.formContainer}>
            
            {/* Row 1: Names (Combined to save space) */}
            <View style={styles.row}>
              <InputField label="First name" containerStyle={{ flex: 0.48 }} />
              <InputField label="Last name" containerStyle={{ flex: 0.48 }} />
            </View>

            {/* Divider 1 */}
            <Divider />

            {/* Row 2: Age & Gender */}
            <View style={styles.row}>
              <InputField label="Age" containerStyle={{ flex: 0.4 }} />
              <InputField label="Gender" isDropdown containerStyle={{ flex: 0.55 }} />
            </View>

            {/* Row 3: Height & Weight */}
            <View style={styles.row}>
              <InputField label="Height" containerStyle={{ flex: 0.48 }} />
              <InputField label="Weight" containerStyle={{ flex: 0.48 }} />
            </View>

            {/* Row 4: Medical Info */}
            <InputField label="Medical Conditions" isDropdown />
            
            {/* Row 5: Medications */}
            <InputField label="Medications" isDropdown />

            {/* Divider 2 */}
            <Divider />

            {/* Action Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.mainButton}
              onPress={() => router.push('../Home/HomeScreen')}
            >
              <Text style={styles.buttonText}>Discover Your BAC Tolerance</Text>
            </TouchableOpacity>

          </View>
        
        </View>
      </SafeAreaView>
    </View>
  );
}

// --- Helper Components ---

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
    backgroundColor: '#7F3B4A',
  },
  blobRed: {
    position: 'absolute',
    width: 600,
    height: 600,
    backgroundColor: '#B4524C',
    borderRadius: 300,
    top: height * 0.4, // Responsive positioning
    left: -200,
    opacity: 0.6,
  },
  blobLight: {
    position: 'absolute',
    width: 500,
    height: 500,
    backgroundColor: '#FFC9C9',
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
    justifyContent: 'space-evenly', // Distributes space so it fills screen exactly
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40, 
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#ddd',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  notificationButton: {
    padding: 5,
  },
  iconImage: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  titleWrapper: {
    alignItems: 'flex-start',
    marginVertical: 10, // Reduced margin
  },
  titleText: {
    color: 'white',
    fontSize: 36, // Reduced from 54
    lineHeight: 40,
    fontWeight: '400',
    letterSpacing: 1,
    width: '70%', // Force wrapping like design but tighter
  },
  formContainer: {
    gap: 12, // Reduced gap from 18
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    height: 45, // Reduced height from 50
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16, // Slightly tighter radius
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  inputLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14, // Slightly smaller text
    fontStyle: 'italic',
    fontWeight: '300',
  },
  dropdownArrow: {
    color: 'white',
    fontSize: 10,
    opacity: 0.8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4, // Tighter divider spacing
    opacity: 0.5,
  },
  dividerLine: {
    height: 2,
    width: 40,
    backgroundColor: '#E8DEF8',
    borderRadius: 2,
  },
  mainButton: {
    height: 50,
    backgroundColor: '#BE5C5C',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});