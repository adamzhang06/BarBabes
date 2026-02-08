import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useUser } from '../context/UserContext';

const TopNavbar = ({ imageUri, onNotificationPress }) => {
  const { firstName, photoUri } = useUser();
  return (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <View style={styles.avatarWrapper}>
          <Image 
            source={photoUri ? { uri: photoUri } : { uri: imageUri || 'https://placehold.co/32x32/png' }}
            style={styles.avatar} 
          />
        </View>
        <Text style={styles.userName}>{firstName}</Text>
      </View>
      <TouchableOpacity onPress={onNotificationPress} style={styles.notificationButton}>
         <Image 
            source={{ uri: 'https://img.icons8.com/ios-filled/50/ffffff/menu--v1.png' }} 
            style={styles.iconImage}
         />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60, // Fixed height for consistency
    paddingHorizontal: 24,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    padding: 8,
  },
  iconImage: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
});

export default TopNavbar;