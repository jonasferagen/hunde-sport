// AnimalIcon.tsx
import { Bird, Cat, Dog, Fish, Rat, Squirrel } from "@tamagui/lucide-icons";
import React, { type JSX } from "react";

// Infer the proper Lucide-like props from one icon:
type IconProps = React.ComponentProps<typeof Cat>;
type IconComponent = (props: IconProps) => JSX.Element;

// Non-empty tuple ensures there's at least one icon in the pool
const ICONS = [Cat, Dog, Fish, Squirrel, Rat, Bird] as const;

export interface AnimalIconProps extends IconProps {
  /** Pick a specific animal icon. If omitted, a random one is chosen (stable per mount). */
  icon?: IconComponent;
}

function pickRandomIcon(): IconComponent {
  const idx = Math.floor(Math.random() * ICONS.length);
  // Fallback keeps TS happy under noUncheckedIndexedAccess
  return ICONS[idx] ?? Cat;
}

export const AnimalIcon: React.FC<AnimalIconProps> = ({ icon, ...props }) => {
  // Stable choice per mount if icon is not provided:
  const Icon = React.useMemo(() => icon ?? pickRandomIcon(), [icon]);
  return <Icon {...props} />;
};
