// Prof.tsx
import React from "react";
import { useEvent } from "tamagui";
export const Prof: React.FC<{
  id: string;
  children: React.ReactNode;
  disable?: boolean;
}> = ({ id, children, disable }) => {
  const onRender = useEvent((id, phase, actual) => {
    console.log(`[RENDER] ${id}  ${phase} duration=${actual.toFixed(1)}ms `);
  });
  return disable ? (
    <>{children}</>
  ) : (
    <React.Profiler id={id} onRender={onRender}>
      {children}
    </React.Profiler>
  );
};
