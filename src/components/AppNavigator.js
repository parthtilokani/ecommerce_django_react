import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import Home from '../screens/app/stackScreens/Home';
import Profile from '../screens/app/drawerScreens/Profile';
import Setting from '../screens/app/drawerScreens/Setting';
import {Image, Text} from 'react-native';
import {COLORS, icons, width} from '../constant';
import Splash from '../screens/auth/Splash';
import SignIn from '../screens/auth/SignIn';
import SignUp from '../screens/auth/SignUp';
import Main from '../screens/app/Main.jsx';
import Postad from '../screens/app/stackScreens/Postad.jsx';
import LocationScreen from '../screens/app/stackScreens/LocationScreen.jsx';
import Search from '../screens/app/stackScreens/Search';
import AllCategories from '../screens/app/stackScreens/AllCatagories.jsx';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNav() {
  return (
    <Drawer.Navigator
      screenOptions={
        {
          // drawerStyle: {
          //   backgroundColor: COLORS.white,
          //   width: width * 0.3,
          // },
          // headerStyle: {
          //   backgroundColor: COLORS.tertiary,
          // },
          // headerTintColor: COLORS.white,
          // headerTitleStyle: {
          //   fontWeight: 'bold',
          // },
          // drawerActiveTintColor: 'blue',
          // drawerLabelStyle: {
          //   color: '#111',
          // },
        }
      }>
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerLabel: 'Classima',
          title: 'Classima',
          drawerIcon: () => <Image source={icons.menu} />,
        }}
      />
      <Stack.Screen name="Setting" component={Setting} />
    </Drawer.Navigator>
  );
}

function StackNav() {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen
        name="Drawer"
        component={DrawerNav}
        options={{headerShown: false}}
      /> */}
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Main"
        component={Main}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Postad"
        component={Postad}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LocationScreen"
        component={LocationScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AllCategories"
        component={AllCategories}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Search" component={Search} />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  return <StackNav />;
}

export default AppNavigator;
