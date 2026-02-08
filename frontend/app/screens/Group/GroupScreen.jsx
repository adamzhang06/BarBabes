import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useUser } from '../../context/UserContext';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
const STATUS_COLORS = { safe: '#4CAF50', caution: '#FFC107', alert: '#F44336' };

export default function GroupScreen() {
  const { userId, firstName, lastName } = useUser();
  const [groupId, setGroupId] = useState(null);
  const [groupCode, setGroupCode] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);

  const loadMembers = useCallback(async (gid) => {
    if (!gid) return;
    try {
      const res = await fetch(`${API_BASE}/groups/${gid}/members`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
      }
    } catch (_) {
      setMembers([]);
    }
  }, []);

  useEffect(() => {
    if (groupId) loadMembers(groupId);
  }, [groupId, loadMembers]);

  const handleCreateGroup = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      if (!res.ok) throw new Error('Failed to create group');
      const data = await res.json();
      setGroupId(data.group_id);
      setGroupCode(data.code || '');
      await loadMembers(data.group_id);
      Alert.alert('Group Created', `Share this code with friends: ${data.code}`);
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not create group');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    const code = joinCode.replace(/\D/g, '').slice(0, 6);
    if (code.length !== 6) {
      Alert.alert('Invalid Code', 'Enter a 6-digit code.');
      return;
    }
    setJoinLoading(true);
    try {
      const res = await fetch(`${API_BASE}/groups/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, user_id: userId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Invalid or expired code');
      }
      const data = await res.json();
      setGroupId(data.group_id);
      setGroupCode(code);
      setJoinModalVisible(false);
      setJoinCode('');
      await loadMembers(data.group_id);
    } catch (e) {
      Alert.alert('Join Failed', e.message || 'Could not join group');
    } finally {
      setJoinLoading(false);
    }
  };

  const handleProfilePress = () => router.push('/profile');
  const handleViewMapPress = () => router.push('/dashboard/group-map');

  const handleCall = (person) => {
    const phone = person.phone || person.primary_contact;
    if (phone) Linking.openURL(`tel:${phone}`);
    else Alert.alert('No number', `No phone number for ${person.name}.`);
  };

  const handleChat = (person) => {
    const phone = person.phone || person.primary_contact;
    if (phone) Linking.openURL(`sms:${phone}`);
    else Alert.alert('No number', `No phone number for ${person.name}.`);
  };

  const displayName = [firstName, lastName].filter(Boolean).join(' ') || 'Me';
  const initials = (firstName?.[0] || '') + (lastName?.[0] || '') || 'ME';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Your Group</Text>
            <Text style={styles.appName}>BarBabes</Text>
          </View>
          <TouchableOpacity onPress={handleProfilePress} style={styles.profileButton}>
            <Text style={styles.profileInitials}>{initials}</Text>
          </TouchableOpacity>
        </View>

        {!groupId ? (
          <>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleCreateGroup}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Create Group</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setJoinModalVisible(true)}
              >
                <Text style={styles.secondaryButtonText}>Join Group</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.hint}>Create a group and share the 6-digit code, or enter a code to join.</Text>
          </>
        ) : (
          <>
            {groupCode ? (
              <View style={styles.codeCard}>
                <Text style={styles.codeLabel}>Group code</Text>
                <Text style={styles.codeValue}>{groupCode}</Text>
              </View>
            ) : null}
            <TouchableOpacity style={styles.mapCard} onPress={handleViewMapPress} activeOpacity={0.8}>
              <View style={styles.mapCardContent}>
                <Text style={styles.mapCardIcon}>📍</Text>
                <View style={styles.mapCardText}>
                  <Text style={styles.mapCardTitle}>View on map</Text>
                  <Text style={styles.mapCardDesc}>See where everyone is</Text>
                </View>
                <Text style={styles.mapCardChevron}>›</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Group members</Text>
            {members.length === 0 ? (
              <Text style={styles.emptyText}>No members yet. Share the code to invite.</Text>
            ) : (
              members.map((person) => (
                <View key={person.user_id} style={styles.memberCard}>
                  <View style={styles.memberLeft}>
                    <View style={[styles.memberAvatar, { backgroundColor: '#333' }]}>
                      <Text style={styles.memberInitials}>
                        {(person.first_name?.[0] || '') + (person.last_name?.[0] || '') || '?'}
                      </Text>
                    </View>
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{person.name || 'Unknown'}</Text>
                      <View style={styles.statusRow}>
                        <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS.safe }]} />
                        <Text style={styles.statusLabel}>Safe</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.actionIcons}>
                    <TouchableOpacity onPress={() => handleChat(person)} style={styles.iconButton}>
                      <Text style={styles.actionIcon}>💬</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleCall(person)} style={styles.iconButton}>
                      <Text style={styles.actionIcon}>📞</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>

      <Modal
        visible={joinModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setJoinModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Join Group</Text>
            <TextInput
              style={styles.modalInput}
              value={joinCode}
              onChangeText={(t) => setJoinCode(t.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit code"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              maxLength={6}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={handleJoinGroup}
                disabled={joinLoading || joinCode.length !== 6}
              >
                {joinLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.modalButtonText}>Join</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => { setJoinModalVisible(false); setJoinCode(''); }}
              >
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    color: '#B0BEC5',
    fontSize: 16,
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
  },
  profileInitials: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  buttonGroup: {
    gap: 12,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#7F3B4A',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#333',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
  },
  secondaryButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  hint: {
    color: '#9E9E9E',
    fontSize: 14,
    textAlign: 'center',
  },
  codeCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  codeLabel: {
    color: '#9E9E9E',
    fontSize: 12,
    marginBottom: 4,
  },
  codeValue: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 6,
  },
  mapCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333',
  },
  mapCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapCardIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  mapCardText: {
    flex: 1,
  },
  mapCardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  mapCardDesc: {
    color: '#9E9E9E',
    fontSize: 12,
    marginTop: 2,
  },
  mapCardChevron: {
    color: '#9E9E9E',
    fontSize: 24,
    fontWeight: '300',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptyText: {
    color: '#9E9E9E',
    fontSize: 14,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  memberInitials: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusLabel: {
    color: '#9E9E9E',
    fontSize: 13,
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconButton: {
    padding: 10,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 320,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    color: '#FFF',
    fontSize: 24,
    letterSpacing: 8,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    gap: 12,
  },
  modalButtonPrimary: {
    backgroundColor: '#7F3B4A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalButtonSecondary: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextSecondary: {
    color: '#9E9E9E',
    fontSize: 16,
  },
});
