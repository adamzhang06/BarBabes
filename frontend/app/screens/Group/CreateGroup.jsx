import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  Keyboard, 
  TouchableWithoutFeedback, 
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MainLayout from '../../MainLayout';
import { useUser } from '../../context/UserContext';
import { useRouter } from 'expo-router';



const CreateGroupScreen = () => {
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { userId } = useUser();
  const router = useRouter();
  const { setGroupId, setGroupCode, setGroupMembers } = useUser();

  const handleCreate = async () => {
    if (!groupName.trim()) {
      setError('Group name required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const apiBase = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
      // Create the group
      const res = await fetch(apiBase + '/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, name: groupName }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to create group');
      }
      const data = await res.json();
      setGroupId(String(data.group_id ?? ''));
      setGroupCode(String(data.code ?? ''));
      setGroupMembers([]);
      // Join the group as the user
      const joinRes = await fetch(apiBase + '/groups/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: data.code, user_id: userId }),
      });
      if (!joinRes.ok) {
        const err = await joinRes.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to join group after creation');
      }
      setLoading(false);
      router.replace('/screens/Dashboard/Dashboard');
    } catch (e) {
      setError(e.message || 'Failed to create group');
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <SafeAreaView style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Create a Group</Text>
            </View>
            <View style={styles.inputGroupNarrow}>
              <Text style={styles.formLabel}>Group Name</Text>
              <TextInput
                style={styles.formInputNarrow}
                placeholder="Name Your Group"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={groupName}
                onChangeText={setGroupName}
                editable={!loading}
                returnKeyType="done"
              />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={styles.mainButtonContainer} onPress={handleCreate} disabled={loading}>
              <LinearGradient
                colors={['#BE5C5C', '#6E1F30']}
                style={styles.mainButton}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.mainButtonText}>Create</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7F3B4A',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
  orbLarge: {
    width: 600,
    height: 600,
    backgroundColor: '#B4524C',
    top: 125,
    left: -220,
    opacity: 0.6,
  },
  orbSmall: {
    width: 420,
    height: 420,
    backgroundColor: 'rgba(255, 201, 201, 0.26)',
    top: 130,
    left: -210,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: '200',
    fontFamily: 'Inter',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '300',
    marginTop: 8,
  },
  searchSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchInput: {
    color: 'white',
    fontSize: 14,
  },
  sectionLabel: {
    color: 'white',
    fontStyle: 'italic',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 10,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    padding: 10,
    marginBottom: 15,
    height: 60,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 12,
  },
  contactName: {
    color: 'white',
    fontSize: 12,
    fontWeight: '300',
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusSymbol: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 20,
    lineHeight: 22,
  },
  inputGroup: {
    marginTop: 20,
  },
  inputGroupNarrow: {
    marginTop: 20,
    alignSelf: 'center',
    width: '80%',
    maxWidth: 320,
    minWidth: 200,
  },
  formLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
    marginLeft: 5,
  },
  formInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    height: 47,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 20,
    color: 'white',
    fontSize: 14,
    fontWeight: '200',
  },
  formInputNarrow: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    height: 47,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 20,
    color: 'white',
    fontSize: 14,
    fontWeight: '200',
    width: '100%',
    minWidth: 150,
    maxWidth: 320,
    alignSelf: 'center',
  },
  errorText: {
    color: '#FFBABA',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 5,
    fontSize: 14,
  },

  mainButtonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: 200,
    height: 55,
  },
  mainButton: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  mainButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateGroupScreen;
