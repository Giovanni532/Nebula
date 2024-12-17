import React from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome5>['name'];
  color: string;
}) {
  return <FontAwesome5 size={22} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme].card,
          borderTopColor: Colors[colorScheme].border,
          height: 60,
          paddingBottom: 7,
        },
        headerStyle: {
          backgroundColor: Colors[colorScheme].card,
        },
        headerTintColor: Colors[colorScheme].text,
      }}>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color }) => <TabBarIcon name="wallet" color={color} />,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="swap"
        options={{
          title: 'Swap',
          tabBarIcon: ({ color }) => <TabBarIcon name="exchange-alt" color={color} />,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="whale-tracker"
        options={{
          title: 'Whale Tracker',
          tabBarIcon: ({ color }) => <TabBarIcon name="chart-line" color={color} />,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="trending"
        options={{
          title: 'Trending',
          tabBarIcon: ({ color }) => <TabBarIcon name="fire" color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
