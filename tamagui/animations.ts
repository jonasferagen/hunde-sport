// tamagui.config.ts (or animations.ts)
import { createAnimations } from "@tamagui/animations-moti";

export const animations = createAnimations({
  // your default spring for layout transitions
  spring: { damping: 25, mass: 0.8, stiffness: 300 },

  // a timing-based fade you can reuse if needed
  fast: {
    type: "timing",
    duration: 150,
  },
  medium: {
    type: "timing",
    duration: 300,
  },
  slow: {
    type: "timing",
    duration: 600,
  },
});
