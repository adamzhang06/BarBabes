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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Each person is an object: id, name, initials, color, position (x%, y%) for the map dot
const MOCK_PEOPLE = [
  { id: '1', name: 'Crunk Cynthia', initials: 'CC', color: '#C44', x: 18, y: 28 },
  { id: '2', name: 'Designated Dave', initials: 'DD', color: '#7B68EE', x: 48, y: 52 },
  { id: '3', name: 'Green Mike', initials: 'GM', color: '#4CAF50', x: 72, y: 55 },
  { id: '4', name: 'Brown Sam', initials: 'GM', color: '#CD853F', x: 78, y: 22 },
  { id: '5', name: 'Orange Alex', initials: 'GM', color: '#D2691E', x: 82, y: 26 },
];

const CENTER_LOCATION = "Harry's Chocolate Shop, West Lafayette, IN 47906";

const BOTTOM_NAV_HEIGHT = 64;
const COLLAPSED_HEIGHT = 140;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.55 - BOTTOM_NAV_HEIGHT;

// Dot on the map – each person as their own object
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
function PersonRow({ person }) {
  return (
    <View style={styles.personRow}>
      <View style={[styles.personAvatar, { backgroundColor: person.color }]}>
        <Text style={styles.personAvatarText}>{person.initials}</Text>
      </View>
      <Text style={styles.personName} numberOfLines={1}>{person.name}</Text>
      <View style={styles.personActions}>
        <TouchableOpacity style={styles.actionIcon}>
          <Text style={styles.actionIconText}>💬</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionIcon}>
          <Text style={styles.actionIconText}>📞</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionIcon}>
          <Text style={styles.actionIconText}>🔔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function GroupMapScreen() {
  const sheetHeight = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;
  const [isExpanded, setIsExpanded] = useState(false);

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

  return (
    <View style={styles.container}>
      {/* Top bar: profile + Name + hamburger */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAvatar}>
            <Image
              source={{ uri: 'https://placehold.co/40x40/6B2D3C/fff?text=U' }}
              style={styles.headerAvatarImg}
            />
          </View>
          <Text style={styles.headerName}>Name</Text>
        </View>
        <TouchableOpacity style={styles.hamburger}>
          <View style={styles.hamburgerLines}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Map area: title, location, pin, dots */}
      <View style={styles.mapArea}>
        <Text style={styles.title}>Your Group</Text>
        <Text style={styles.location}>{CENTER_LOCATION}</Text>
        <View style={styles.pinWrapper}>
          <Text style={styles.pinIcon}>📍</Text>
        </View>
        {/* Dots – each person as their own positioned object */}
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
            <PersonRow key={person.id} person={person} />
          ))}
        </ScrollView>
      </Animated.View>

      {/* Bottom nav bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navIcon}>
          <Text style={styles.navIconLabel}>👤</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navIcon}>
          <Text style={styles.navIconLabel}>⏱</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navIcon}>
          <Text style={styles.navIconLabel}>👥</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navIcon}>
          <Text style={styles.navIconLabel}>🎮</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
  },
  location: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  pinWrapper: {
    marginBottom: 16,
  },
  pinIcon: {
    fontSize: 32,
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
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: BOTTOM_NAV_HEIGHT,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  personAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  personName: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  personActions: {
    flexDirection: 'row',
    gap: 12,
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
