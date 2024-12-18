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
  const colorScheme: 'light' | 'dark' = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme as keyof typeof Colors].tint,
        tabBarInactiveTintColor: Colors[colorScheme as keyof typeof Colors].tabIconDefault,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme as keyof typeof Colors].card,
          borderTopColor: Colors[colorScheme as keyof typeof Colors].border,
          height: 60,
          paddingBottom: 7,
        },
        headerStyle: {
          backgroundColor: Colors[colorScheme as keyof typeof Colors].card,
        },
        headerTintColor: Colors[colorScheme as keyof typeof Colors].text,
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
          title: 'SPL Swap',
          tabBarIcon: ({ color }) => <TabBarIcon name="exchange-alt" color={color} />,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="whale-tracker"
        options={{
          title: 'SOL Tracker',
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
