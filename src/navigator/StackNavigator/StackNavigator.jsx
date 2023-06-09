import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DrawerNavigator from '../DrawerNavigator/DrawerNavigator.jsx';
import Account from '../../screens/app/BottomTabScreens/Account.jsx';
import Postad from '../../screens/app/BottomTabScreens/Postad.jsx';
import Main from '../../screens/app/Main.jsx';
import LocationScreen from '../../screens/app/StackScreens/LocationScreen.jsx';
import AllCatagories from '../../screens/app/StackScreens/AllCatagories.jsx';
import GobackHeader from '../../components/GobackHeader.jsx';
import AppHeader from '../../components/AppHeader.jsx';
const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="Postad" component={Postad} />
      <Stack.Screen name="AllCategories" component={AllCatagories} />
      <Stack.Screen name="Location" component={LocationScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
