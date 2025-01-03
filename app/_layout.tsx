import '../utils/polyfills';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { ConnectionProvider } from '@/contexts/ConnectionContext';
import { WalletProvider } from '@/contexts/WalletContext';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ConnectionProvider>
      <WalletProvider>
        <RootLayoutNav />
      </WalletProvider>
    </ConnectionProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.dark.background}
        translucent
      />
      <ThemeProvider value={DarkTheme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors[colorScheme as keyof typeof Colors].card,
            },
            headerTintColor: Colors[colorScheme as keyof typeof Colors].text,
            contentStyle: {
              backgroundColor: Colors[colorScheme as keyof typeof Colors].background,
            },
          }}>
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
