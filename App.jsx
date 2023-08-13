import React from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import AppNavigator from './src/navigator/AppNavigator.js';
import {CustomStatusBar} from './src/components/CustomStatusBar.jsx';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {COLORS} from './src/constant/theme.js';
import {LocationProvider} from './src/contexts/LocationProvider.js';
import {AuthProvider} from './src/contexts/AuthProvider.js';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <CustomStatusBar backgroundColor={COLORS.primary} />
        <AuthProvider>
          <LocationProvider>
            <AppNavigator />
          </LocationProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default App;
