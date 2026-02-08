import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import MainLayout from '../../MainLayout';
import BottomNavBar from '../../components/BottomNavBar';

const { width } = Dimensions.get('window');

// Import shared contact data
import { contactData } from '../../data/contacts';

export default function ContactListScreen() {
  // Sort so Primary Contact 1 and 2 are always at the top
  const sortedContacts = [
    ...contactData.filter(c => c.name === 'Primary Contact 1' || c.name === 'Primary Contact 2'),
    ...contactData.filter(c => c.name !== 'Primary Contact 1' && c.name !== 'Primary Contact 2'),
  ];
  return (
    <MainLayout>
      <View style={styles.container}>
        {/* Page Title */}
        <Text style={styles.pageTitle}>Your Contacts</Text>
        {/* Scrollable List */}
        <ScrollView 
          contentContainerStyle={styles.listContainer} 
          showsVerticalScrollIndicator={false}
        >
          {sortedContacts.map((contact) => (
            <ContactRow 
              key={contact.id}
              name={contact.name}
              initials={contact.initials}
              statusColor={contact.statusColor}
            />
          ))}
        </ScrollView>
      </View>
      {/* Fixed Bottom Bar */}
      <BottomNavBar />
    </MainLayout>
  );
}

// --- Reusable Row Component ---
const ContactRow = ({ name, initials, statusColor }) => (
  <View style={styles.rowContainer}>
    {/* Avatar Circle */}
    <View style={[styles.avatarCircle, { backgroundColor: statusColor }]}> 
      <Text style={styles.initialsText}>{initials}</Text>
    </View>
    {/* Name */}
    <Text style={styles.nameText}>{name}</Text>
    {/* Action Icons (Right Side) */}
    <View style={styles.actionsContainer}>
      <TouchableOpacity style={styles.iconButton}>
        <Text style={{ fontSize: 18 }}>💬</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}>
        <Text style={{ fontSize: 18 }}>📞</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  pageTitle: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Inter',
    fontWeight: '300', // Light font weight
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 10,
  },
  listContainer: {
    paddingBottom: 100, // Extra space for BottomNavBar
    gap: 12, // Spacing between rows
  },
  // Row Styles
  rowContainer: {
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Glassy background
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    marginRight: 15,
  },
  initialsText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Inter',
  },
  nameText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '300',
    fontFamily: 'Inter',
    flex: 1, // Pushes icons to the right
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  iconButton: {
    padding: 5,
  },
  actionIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
});