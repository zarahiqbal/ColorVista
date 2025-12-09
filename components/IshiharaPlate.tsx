// components/IshiharaPlate.tsx
import { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { adjustColor } from '../constants/questions';

interface Props {
  number: string;
  fgColor: string; // Color of the number
  bgColor: string; // Color of the background dots
  size?: number;
}

export default function IshiharaPlate({ number, fgColor, bgColor, size = 300 }: Props) {
  
  // useMemo ensures we don't recalculate 950 random dots on every frame (performance)
  const { bgDots, fgDots } = useMemo(() => {
    const bg = [];
    const fg = [];

    // 1. Generate 800 background dots (From your Loop 1)
    for (let i = 0; i < 800; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * (size * 0.04) + (size * 0.015); // Scaled radius
      const fill = Math.random() > 0.5 ? bgColor : adjustColor(bgColor);
      bg.push(<Circle key={`bg-${i}`} cx={x} cy={y} r={r} fill={fill} />);
    }

    // 2. Generate 150 foreground noise dots (From your Loop 2)
    const centerX = size / 2;
    const centerY = size / 2;
    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * (size * 0.2);
      const dotX = centerX + Math.cos(angle) * distance;
      const dotY = centerY + Math.sin(angle) * distance;
      const r = Math.random() * (size * 0.03) + (size * 0.01);
      fg.push(<Circle key={`fg-${i}`} cx={dotX} cy={dotY} r={r} fill={fgColor} opacity={0.8} />);
    }

    return { bgDots: bg, fgDots: fg };
  }, [number, fgColor, bgColor, size]);

  return (
    <View style={{ 
      width: size, 
      height: size, 
      borderRadius: size / 2, 
      overflow: 'hidden', 
      backgroundColor: '#f0f0f0',
      elevation: 5 
    }}>
      <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Layer 1: Background Dots */}
        {bgDots}

        {/* Layer 2: The Number Text */}
        <SvgText
          fill={fgColor}
          stroke={fgColor}
          strokeWidth="2"
          fontSize={size * 0.45}
          fontWeight="bold"
          fontFamily="Arial" // Fallback font
          x={size / 2}
          y={size / 2 + (size * 0.15)} // Vertical alignment fix
          textAnchor="middle"
        >
          {number}
        </SvgText>

        {/* Layer 3: Foreground Noise Dots (To break up the solid text lines) */}
        {fgDots}
      </Svg>
    </View>
  );
}