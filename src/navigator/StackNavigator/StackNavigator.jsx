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
import StoreDetails from '../../screens/app/DrawerScreens/Stores/StoreDetails.jsx';
import SubCategory from '../../screens/app/StackScreens/SubCategory.jsx';
import Profile from '../../screens/app/StackScreens/Account/Profile.jsx';
import PostSubCategory from '../../screens/app/StackScreens/PostCategory/PostSubCategory.jsx';
import PostAdDetails from '../../screens/app/StackScreens/PostCategory/PostAdDetails.jsx';
import AllStores from '../../screens/app/DrawerScreens/Stores/AllStores.jsx';
import Membership from '../../screens/app/StackScreens/Account/Membership.jsx';
import SelectSubCategory from '../../screens/app/BottomTabScreens/PostAd/SelectSubCategory.jsx';
import ListGridAds from '../../components/Ads/ListGridAds.jsx';
import MyListing from '../../screens/app/StackScreens/Account/MyListing/MyListing.jsx';
import EditAdDetails from '../../screens/app/StackScreens/PostCategory/EditAdDetails.jsx';
import LoginWithPhone from '../../screens/auth/LoginWithPhone.jsx';
import ShowAdsDetails from '../../components/Ads/ShowAdsDetails.jsx';
import Search from '../../screens/app/Search.jsx';
import Allplans from '../../screens/app/StackScreens/Account/Allplans.jsx';
import EditPhoneNumber from '../../screens/app/StackScreens/Account/EditPhoneNumber.jsx';
import Contactus from '../../screens/app/DrawerScreens/Contactus.jsx';
import Transaction from '../../screens/app/StackScreens/Account/Transaction.jsx';
const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="Postad" component={Postad} />
      <Stack.Screen name="AllCategories" component={AllCatagories} />
      <Stack.Screen name="AllStores" component={AllStores} />
      <Stack.Screen name="SubCategory" component={SubCategory} />
      <Stack.Screen name="Location" component={LocationScreen} />

      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="LoginWithPhone" component={LoginWithPhone} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="MyListing" component={MyListing} />
      <Stack.Screen name="Category" component={Category} />
      <Stack.Screen name="AppSetting" component={Appsetting} />
      <Stack.Screen name="StoreDetails" component={StoreDetails} />
      <Stack.Screen name="ListGridAds" component={ListGridAds} />
      <Stack.Screen name="Search" component={Search} />

      {/* <Stack.Screen name="PostSubCategory" component={PostSubCategory} /> */}
      <Stack.Screen name="SelectSubCategory" component={SelectSubCategory} />
      <Stack.Screen name="PostAdDetails" component={PostAdDetails} />
      <Stack.Screen name="EditAdDetails" component={EditAdDetails} />
      <Stack.Screen name="Membership" component={Membership} />
      <Stack.Screen name="ShowAdsDetails" component={ShowAdsDetails} />
      <Stack.Screen name="Allplans" component={Allplans} />
      <Stack.Screen name="EditPhoneNumber" component={EditPhoneNumber} />
      <Stack.Screen name="Contactus" component={Contactus} />
      <Stack.Screen name="Transaction" component={Transaction} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
