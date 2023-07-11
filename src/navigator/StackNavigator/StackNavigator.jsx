import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DrawerNavigator from '../DrawerNavigator/DrawerNavigator.jsx';
import Postad from '../../screens/app/BottomTabScreens/Postad.jsx';
import Main from '../../screens/app/Main.jsx';
import LocationScreen from '../../screens/app/StackScreens/LocationScreen.jsx';
import AllCatagories from '../../screens/app/StackScreens/AllCatagories.jsx';
import SignIn from '../../screens/auth/SignIn.jsx';
import SignUp from '../../screens/auth/SignUp.jsx';
import Splash from '../../screens/auth/Splash.jsx';
import ForgotPassword from '../../screens/auth/ForgotPassword.jsx';
import Category from '../../components/Categories/Category.jsx';
import Appsetting from '../../screens/app/DrawerScreens/AppSetting.jsx';
import StoreDetails from '../../screens/app/StackScreens/StoreDetails.jsx';
import SubCategory from '../../screens/app/StackScreens/SubCategory.jsx';
import Profile from '../../screens/app/BottomTabScreens/Profile.jsx';
import PostSubCategory from '../../screens/app/StackScreens/PostCategory/PostSubCategory.jsx';
import PostAdDetails from '../../screens/app/StackScreens/PostCategory/PostAdDetails.jsx';
import AllStores from '../../screens/app/StackScreens/AllStores.jsx';
const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      // screenOptions={{headerShown: false}}
      initialRouteName="Splash">
      <Stack.Screen
        name="Drawer"
        component={DrawerNavigator}
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
        name="AllCategories"
        component={AllCatagories}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AllStores"
        component={AllStores}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SubCategory"
        component={SubCategory}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Location"
        component={LocationScreen}
        options={{headerShown: false}}
      />
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
        name="ForgotPassword"
        component={ForgotPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Category"
        component={Category}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AppSetting"
        component={Appsetting}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="StoreDetails"
        component={StoreDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PostSubCategory"
        component={PostSubCategory}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PostAdDetails"
        component={PostAdDetails}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
