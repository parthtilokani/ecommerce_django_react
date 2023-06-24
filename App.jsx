import {View, Text} from 'react-native';
import React from 'react';
import AppNavigator from './src/navigator/AppNavigator.js';
import {CustomStatusBar} from './src/components/CustomStatusBar.jsx';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {COLORS} from './src/constant/theme.js';

const App = () => {
  return (
    <SafeAreaProvider>
      <CustomStatusBar backgroundColor={COLORS.primary} />
      <AppNavigator />
    </SafeAreaProvider>
  );
};

export default App;
