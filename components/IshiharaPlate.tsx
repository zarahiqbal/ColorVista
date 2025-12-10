// components/IshiharaPlate.tsx
import { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

interface Props {
  number: string;
  fgColor: string; // Color of the number
  bgColor: string; // Color of the background dots
  size?: number;
  difficulty?: 'easy' | 'hard';
}

export default function IshiharaPlate({ number, fgColor, bgColor, size = 300, difficulty = 'easy' }: Props) {
  
  // Adjust plate complexity based on difficulty
  const dotConfig = useMemo(() => {
    if (difficulty === 'easy') {
      return {
        bgDotCount: 400,      // Fewer background dots for easier visibility
        fgDotCount: 80,       // Fewer foreground noise dots
        colorVariation: 10,   // Lower variation (more consistent colors) = easier to see
        fgOpacity: 0.9        // Higher opacity for the number
      };
    } else {
      return {
        bgDotCount: 1000,      // More background dots for harder difficulty
        fgDotCount: 150,      // More foreground noise to obscure the number
        colorVariation: 30,   // Higher variation (more color mix) = harder to see
        fgOpacity: 0.6        // Lower opacity for the number
      };
    }
  }, [difficulty]);

  // useMemo ensures we don't recalculate dots on every frame (performance)
  const { bgDots, fgDots } = useMemo(() => {
    const bg = [];
    const fg = [];

    // 1. Generate background dots with difficulty adjustment
    for (let i = 0; i < dotConfig.bgDotCount; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * (size * 0.04) + (size * 0.015);
      
      // Adjust color variation based on difficulty
      const fill = Math.random() > 0.5 ? bgColor : adjustColorWithVariation(bgColor, dotConfig.colorVariation);
      bg.push(<Circle key={`bg-${i}`} cx={x} cy={y} r={r} fill={fill} />);
    }

    // 2. Generate foreground noise dots
    const centerX = size / 2;
    const centerY = size / 2;
    for (let i = 0; i < dotConfig.fgDotCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * (size * 0.2);
      const dotX = centerX + Math.cos(angle) * distance;
      const dotY = centerY + Math.sin(angle) * distance;
      const r = Math.random() * (size * 0.03) + (size * 0.01);
      fg.push(<Circle key={`fg-${i}`} cx={dotX} cy={dotY} r={r} fill={fgColor} opacity={dotConfig.fgOpacity} />);
    }

    return { bgDots: bg, fgDots: fg };
  }, [number, fgColor, bgColor, size, difficulty, dotConfig]);

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
          fontFamily="Arial"
          x={size / 2}
          y={size / 2 + (size * 0.15)}
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

// Helper function to adjust color with variable intensity
function adjustColorWithVariation(color: string, variation: number): string {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  const newR = Math.max(0, Math.min(255, r + (Math.random() - 0.5) * variation));
  const newG = Math.max(0, Math.min(255, g + (Math.random() - 0.5) * variation));
  const newB = Math.max(0, Math.min(255, b + (Math.random() - 0.5) * variation));

  return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;
}