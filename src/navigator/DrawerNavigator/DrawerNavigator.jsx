import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';

import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Main from '../../screens/app/Main.jsx';
import AppHeader from '../../components/AppHeader.jsx';
import CustomDrawerContent from './CustomDrawerContent.jsx';
import {width} from '../../constant/index.js';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {width: width * 0.8},
      }}>
      <Drawer.Screen name="Main" component={Main} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
