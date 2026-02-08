import { StyleSheet } from 'react-native';

const toastStyles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 140, // moved up by 20px
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

export default toastStyles;