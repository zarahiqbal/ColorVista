import { useMemo } from "react";
import { View } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";

interface Props {
  number?: string;
  value?: string;
  fgColor: string;
  bgColor: string;
  size?: number;
  difficulty?: "easy" | "hard";
}

export default function IshiharaPlate({
  number,
  value,
  fgColor,
  bgColor,
  size = 300,
  difficulty = "easy",
}: Props) {
  const displayedValue = number ?? value ?? "";

  const dotConfig = useMemo(() => {
    if (difficulty === "easy") {
      return {
        bgDotCount: 400,
        fgDotCount: 80,
        colorVariation: 10,
        fgOpacity: 0.9,
      };
    }

    return {
      bgDotCount: 1000,
      fgDotCount: 150,
      colorVariation: 30,
      fgOpacity: 0.6,
    };
  }, [difficulty]);

  const { bgDots, fgDots } = useMemo(() => {
    const bg = [];
    const fg = [];

    for (let i = 0; i < dotConfig.bgDotCount; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * (size * 0.04) + size * 0.015;
      const fill =
        Math.random() > 0.5
          ? bgColor
          : adjustColorWithVariation(bgColor, dotConfig.colorVariation);

      bg.push(<Circle key={`bg-${i}`} cx={x} cy={y} r={r} fill={fill} />);
    }

    const centerX = size / 2;
    const centerY = size / 2;

    for (let i = 0; i < dotConfig.fgDotCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * (size * 0.2);
      const dotX = centerX + Math.cos(angle) * distance;
      const dotY = centerY + Math.sin(angle) * distance;
      const r = Math.random() * (size * 0.03) + size * 0.01;

      fg.push(
        <Circle
          key={`fg-${i}`}
          cx={dotX}
          cy={dotY}
          r={r}
          fill={fgColor}
          opacity={dotConfig.fgOpacity}
        />,
      );
    }

    return { bgDots: bg, fgDots: fg };
  }, [fgColor, bgColor, size, dotConfig]);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: "hidden",
        backgroundColor: "#F0F0F0",
      }}
    >
      <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
        {bgDots}

        <SvgText
          fill={fgColor}
          stroke={fgColor}
          strokeWidth="2"
          fontSize={size * 0.45}
          fontWeight="bold"
          fontFamily="Arial"
          x={size / 2}
          y={size / 2 + size * 0.15}
          textAnchor="middle"
        >
          {displayedValue}
        </SvgText>

        {fgDots}
      </Svg>
    </View>
  );
}

function adjustColorWithVariation(color: string, variation: number): string {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  const newR = Math.max(0, Math.min(255, r + (Math.random() - 0.5) * variation));
  const newG = Math.max(0, Math.min(255, g + (Math.random() - 0.5) * variation));
  const newB = Math.max(0, Math.min(255, b + (Math.random() - 0.5) * variation));

  return `#${Math.round(newR).toString(16).padStart(2, "0")}${Math.round(
    newG,
  )
    .toString(16)
    .padStart(2, "0")}${Math.round(newB).toString(16).padStart(2, "0")}`;
}
