import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
  ScrollView,
} from 'react-native';
import MainLayout from '../../MainLayout';
import BottomNavBar from '../../components/BottomNavBar';
import { contactData } from '../../data/contacts';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const GROUP_MEMBER_NAMES = [
  'Designated Diana',
  'Martini Mandy',
  'Cosmo Cassidy',
  'Bubbly Bonnie',
  'Sangria Samantha',
];
const MOCK_PEOPLE = contactData
  .filter((c) => GROUP_MEMBER_NAMES.includes(c.name))
  .sort((a, b) => GROUP_MEMBER_NAMES.indexOf(a.name) - GROUP_MEMBER_NAMES.indexOf(b.name))
  .map((c, i) => ({
    ...c,
    color: c.statusColor || '#C44',
    x: [18, 48, 72, 78, 82][i] ?? 20 + i * 10,
    y: [28, 52, 55, 22, 26][i] ?? 30 + i * 5,
  }));

const CENTER_LOCATION = "Harry's Chocolate Shop, West Lafayette, IN 47906";

const BOTTOM_NAV_HEIGHT = 64;
const COLLAPSED_HEIGHT = 140;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.55 - BOTTOM_NAV_HEIGHT;

function PersonDot({ person, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress?.(person)}
      style={[
        styles.dot,
        {
          backgroundColor: person.color,
          left: `${person.x}%`,
          top: `${person.y}%`,
          marginLeft: -24,
          marginTop: -24,
        },
      ]}
    >
      <Text style={styles.dotInitials}>{person.initials}</Text>
      {person.bac === 0 && (
        <View style={styles.carIconContainer}>
          <Text style={styles.carIcon}>🚗</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// Bottom sheet handle (burger-style drag handle)
function SheetHandle({ onPress }) {
  return (
    <TouchableOpacity style={styles.sheetHandle} onPress={onPress} activeOpacity={1}>
      <View style={styles.sheetHandleLine} />
    </TouchableOpacity>
  );
}

// Single row in the sheet: avatar, name, chat/call/alert icons
function PersonRow({ person, onBellPress }) {
  return (
    <View style={styles.personRow}>
      {/* Avatar stays neutral, must be a <Text> for initials and car icon */}
      <View style={[styles.personAvatar, { backgroundColor: '#333', position: 'relative' }]}> 
        {/* Center initials absolutely */}
        <Text style={styles.personAvatarText}>{person.initials}</Text>
        {/* Car icon overlaps bottom edge of avatar if Designated Diana and BAC is 0.00 */}
        {person.name === 'Designated Diana' && person.bac === 0 && (
          <Text style={styles.carIconInline}>🚗</Text>
        )}
      </View>
      <Text
        style={[styles.personNameBg, { backgroundColor: person.color }]} numberOfLines={1}
      >
        <Text style={styles.personName}>{person.name}</Text>
      </Text>
      <View style={styles.personActions}>
        <TouchableOpacity style={styles.actionIcon}>
          <Text style={styles.actionIconText}>💬</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionIcon}>
          <Text style={styles.actionIconText}>📞</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionIcon} onPress={() => onBellPress(person)}>
          <Text style={styles.actionIconText}>🔔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function GroupMapScreen() {
  const sheetHeight = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;
  const [isExpanded, setIsExpanded] = useState(false);
  const [toast, setToast] = useState(null); // { message: string, key: number }

  const expandSheet = () => {
    setIsExpanded(true);
    Animated.spring(sheetHeight, {
      toValue: EXPANDED_HEIGHT,
      useNativeDriver: false,
      tension: 65,
      friction: 11,
    }).start();
  };

  const collapseSheet = () => {
    setIsExpanded(false);
    Animated.spring(sheetHeight, {
      toValue: COLLAPSED_HEIGHT,
      useNativeDriver: false,
      tension: 65,
      friction: 11,
    }).start();
  };

  const toggleSheet = () => (isExpanded ? collapseSheet() : expandSheet());

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
      onPanResponderRelease: (_, g) => {
        if (g.dy < -30) expandSheet();
        else if (g.dy > 30) collapseSheet();
      },
    })
  ).current;

  // Show toast for 2 seconds
  const showToast = (message) => {
    const key = Date.now();
    setToast({ message, key });
    setTimeout(() => {
      setToast((t) => (t && t.key === key ? null : t));
    }, 2000);
  };

  // Bell button handler
  const handleBellPress = (person) => {
    const bac = typeof person.bac === 'number' ? person.bac.toFixed(2) : 'N/A';
    showToast(`You alerted ${person.name} of their BAC status (BAC: ${bac})`);
    // Here you could also trigger a real notification/send event
  };

  return (
    <MainLayout>
      <View style={styles.container}>
        {/* ...existing code... */}

        <View style={styles.mapArea}>
          <Text style={[styles.title, { marginTop: 0, marginBottom: 0 }]}>Your Group</Text>
          <Text style={[styles.location, { marginTop: 0, marginBottom: 4 }]}>{CENTER_LOCATION}</Text>
          <Image
            source={require('../../assets/harrys.png')}
            style={styles.harrysBg}
            resizeMode="cover"
          />
          <View style={styles.dotsContainer} pointerEvents="box-none">
            {MOCK_PEOPLE.map((person) => (
              <PersonDot key={person.id} person={person} />
            ))}
          </View>
        </View>

        {/* Slide-up bottom sheet */}
        <Animated.View
          style={[styles.sheet, { height: sheetHeight }]}
          {...panResponder.panHandlers}
        >
          <SheetHandle onPress={toggleSheet} />
          <ScrollView
            style={styles.sheetScroll}
            contentContainerStyle={styles.sheetScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {MOCK_PEOPLE.map((person) => (
              <PersonRow key={person.id} person={person} onBellPress={handleBellPress} />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Toast notification */}
        {toast && (
          <View style={toastStyles.toastContainer} pointerEvents="none">
            <Text style={toastStyles.toastText}>{toast.message}</Text>
          </View>
        )}

        <BottomNavBar />
      </View>
    </MainLayout>
  );
}
// Toast styles
const toastStyles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 100,
    alignItems: 'center',
    zIndex: 9999,
  },
  toastText: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    color: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    fontSize: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7F3B4A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingTop: 48,
    backgroundColor: '#6B2D3C',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#8B3A45',
  },
  headerAvatarImg: {
    width: '100%',
    height: '100%',
  },
  headerName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  hamburger: {
    padding: 8,
  },
  hamburgerLines: {
    gap: 5,
  },
  hamburgerLine: {
    width: 24,
    height: 2,
    backgroundColor: '#fff',
    marginBottom: 5,
    borderRadius: 1,
  },
  mapArea: {
    flex: 1,
    backgroundColor: '#8B3A45',
    paddingTop: 24,
    alignItems: 'center',
  },
  dotsContainer: {
    ...StyleSheet.absoluteFillObject,
    top: 160,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dot: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotInitials: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  carIcon: {
    fontSize: 18,
    textAlign: 'center',
  },
  carIconContainer: {
    position: 'absolute',
    left: '50%',
    bottom: -12,
    transform: [{ translateX: -12 }],
    zIndex: 10,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  harrysBg: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    opacity: 0.65,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 0,
  },
  location: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 24,
    marginTop: 0,
    marginBottom: 4,
  },
  carIconContainerProfile: {
    position: 'absolute',
    left: '50%',
    bottom: -10,
    transform: [{ translateX: -12 }],
    zIndex: 10,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carIconInline: {
    fontSize: 18,
    position: 'absolute',
    left: '20%',
    bottom: -12,
    transform: [{ translateX: -12 }], // Center horizontally
    zIndex: 10,
    width: 24,
    height: 24,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: BOTTOM_NAV_HEIGHT - 18,
    backgroundColor: '#9A4655',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  sheetHandle: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  sheetHandleLine: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 2,
  },
  sheetScroll: {
    flex: 1,
  },
  sheetScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)',
    gap: 14,
  },
  personAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#333',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  personAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  personNameBg: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff', // Needed for <Text>
    overflow: 'hidden',
  },
  personName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  personActions: {
    flexDirection: 'row',
    gap: 12,
    marginLeft: 'auto', // Push icons to the right
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 110, // Ensures consistent alignment
  },
  actionIcon: {
    padding: 6,
  },
  actionIconText: {
    fontSize: 18,
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: BOTTOM_NAV_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#6B2D3C',
  },
  navIcon: {
    padding: 8,
  },
  navIconLabel: {
    fontSize: 24,
  },
});
