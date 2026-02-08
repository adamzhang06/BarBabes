import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

// Props: value (number, e.g. 0.06), size (number, px)
export default function BACRing({ value = 0.06, size = 240 }) {
  // Clamp value for BAC (0.00 - 0.30)
  const bac = Math.max(0, Math.min(value, 0.3));
  // Ring is full at 0.30
  const percent = Math.min(bac / 0.3, 1);
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference * (1 - percent);

  // Color logic:
  // 0.00 - 0.08: green to yellow
  // 0.08 - 0.15: yellow to orange
  // 0.15 - 0.30: orange to redder
  let ringColor = '#39FF14'; // Neon green
  if (bac === 0) {
    ringColor = '#00E6FF'; // Bright light blue for sobriety
  } else if (bac > 0 && bac < 0.08) {
    // Green to yellow
    const t = bac / 0.08;
    ringColor = interpolateColor('#39FF14', '#FFD600', t);
  } else if (bac >= 0.08 && bac < 0.15) {
    // Yellow to orange
    const t = (bac - 0.08) / (0.15 - 0.08);
    ringColor = interpolateColor('#FFD600', '#FF8C00', t);
  } else if (bac >= 0.15 && bac <= 0.30) {
    // Orange to redder
    const t = (bac - 0.15) / (0.30 - 0.15);
    ringColor = interpolateColor('#FF8C00', '#C80032', t);
  } else if (bac > 0.30) {
    ringColor = '#C80032';
  }

  function interpolateColor(a, b, t) {
    // a, b: hex colors, t: 0-1
    const ah = a.replace('#', '');
    const bh = b.replace('#', '');
    const ar = parseInt(ah.substring(0, 2), 16);
    const ag = parseInt(ah.substring(2, 4), 16);
    const ab = parseInt(ah.substring(4, 6), 16);
    const br = parseInt(bh.substring(0, 2), 16);
    const bg = parseInt(bh.substring(2, 4), 16);
    const bb = parseInt(bh.substring(4, 6), 16);
    const rr = Math.round(ar + (br - ar) * t);
    const rg = Math.round(ag + (bg - ag) * t);
    const rb = Math.round(ab + (bb - ab) * t);
    return `#${rr.toString(16).padStart(2, '0')}${rg.toString(16).padStart(2, '0')}${rb.toString(16).padStart(2, '0')}`;
  }

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#333"
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.18}
        />
        {/* Progress */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={{ position: 'absolute', top: 0, left: 0, width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'white', fontSize: size * 0.32, fontWeight: '700', fontFamily: 'Inter' }}>{bac.toFixed(2)}</Text>
        <Text style={{ color: 'white', fontSize: size * 0.12, opacity: 0.7 }}>BAC</Text>
      </View>
    </View>
  );
}
