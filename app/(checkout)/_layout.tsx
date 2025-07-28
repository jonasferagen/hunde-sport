import Drawer from "expo-router/drawer";
import React from 'react';

export default function CheckoutLayout() {
  return (
    <Drawer.Screen
      name="index" // This is the name of the page and must match the url from root
      options={{
        drawerLabel: 'Hjem',
        title: 'Hjem',
      }}
    />
  );
}
