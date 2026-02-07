import React from 'react';
import { View, Text } from 'react-native';

export default function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#7F3B4A' }}>
      <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold' }}>Profile Page</Text>
    </View>
  );
}
