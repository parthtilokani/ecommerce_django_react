import React from 'react';
import AppNavigator from './src/navigator/AppNavigator.js';
import {CustomStatusBar} from './src/components/CustomStatusBar.jsx';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {COLORS} from './src/constant/theme.js';
import {LocationProvider} from './src/contexts/LocationProvider.js';
const App = () => {
  return (
    <SafeAreaProvider>
      <CustomStatusBar backgroundColor={COLORS.primary} />
      <LocationProvider>
        <AppNavigator />
      </LocationProvider>
    </SafeAreaProvider>
  );
};

export default App;
