import React, { useState } from 'react';
import { useUser } from './context/UserContext';
import { View, StyleSheet, StatusBar, Dimensions, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopNavbar from './components/TopNavBar';
import { UserProvider } from './context/UserContext';
import { useRouter } from 'expo-router';

const { height } = Dimensions.get('window');

const MainLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleMenuPress = () => setMenuOpen(true);
  const handleCloseMenu = () => setMenuOpen(false);
  const { leaveGroup } = useUser ? useUser() : { leaveGroup: async () => {} };
  const handleLeaveGroup = async () => {
    setMenuOpen(false);
    if (leaveGroup) await leaveGroup();
    router.replace('/screens/Home/HomeScreen');
  };

  const handleProfilePress = () => {
    setMenuOpen(false);
    router.push('/screens/User/Profile');
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* GLOBAL BACKGROUND BLOBS */}
      <View style={styles.blobRed} />
      <View style={styles.blobLight} />
      <SafeAreaView style={styles.safeArea}>
        {/* GLOBAL NAVBAR - Stays fixed at the top */}
        <TopNavbar onNotificationPress={handleMenuPress} />
        {/* Hamburger Menu Overlay */}
        {menuOpen && (
          <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={handleCloseMenu}>
            <View style={styles.menuBox}>
              <TouchableOpacity style={styles.menuItem} onPress={handleProfilePress}>
                <Text style={styles.menuText}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => {
                setMenuOpen(false);
                router.replace('/screens/User/Login');
              }}>
                <Text style={styles.menuText}>Log Out</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.menuItem, styles.menuItemDanger]} onPress={handleLeaveGroup}>
                <Text style={styles.menuTextDanger}>Leave Group</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        {/* PAGE CONTENT */}
        <View style={styles.contentContainer}>
          {children}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 200,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  menuBox: {
    marginTop: 70,
    width: '80%',
    backgroundColor: '#222',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'stretch',
    elevation: 8,
  },
  menuItem: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  menuText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'left',
  },
  menuItemDanger: {
    borderBottomWidth: 0,
    marginTop: 8,
    // No background color, same padding as others
    borderRadius: 10,
  },
  menuTextDanger: {
    color: '#FF4B4B',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'left',
  },
  container: {
    flex: 1,
    backgroundColor: '#7F3B4A',
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1, // Takes up remaining space below header
  },
  // Background Blob Styles
  blobRed: {
    position: 'absolute',
    width: 600,
    height: 600,
    backgroundColor: '#B4524C',
    borderRadius: 300,
    top: height * 0.4,
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
});

export default MainLayout;
