import { Stack } from "expo-router";
import React from 'react';

export default function CheckoutLayout() {
  return (
    <Stack.Screen
      name="index" // This is the name of the page and must match the url from root
      options={{
        title: 'Kassen',
      }}
    />
  );
}
