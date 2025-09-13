
import { Heading, styled } from "tamagui";


export const ThemedHeading = styled(Heading, {
  name: "SectionHeading",
  userSelect: "none",
  pointerEvents: "none",
  selectable: false,
  role: "heading",
  size: "$6"
});
