import React from 'react';
import { View, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopNavbar from './components/TopNavBar';

const { height } = Dimensions.get('window');

const MainLayout = ({ children }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* GLOBAL BACKGROUND BLOBS */}
      <View style={styles.blobRed} />
      <View style={styles.blobLight} />
      <SafeAreaView style={styles.safeArea}>
        {/* GLOBAL NAVBAR - Stays fixed at the top */}
        <TopNavbar userName="Name" />
        {/* PAGE CONTENT */}
        <View style={styles.contentContainer}>
          {children}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
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
