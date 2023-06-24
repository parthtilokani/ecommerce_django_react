import {Platform, StyleSheet, AppState, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppHeader from './../../components/AppHeader';
import Bottomtab from './../../components/BottomTab/Bottomtab.jsx';
import Home from './BottomTabScreens/Home.jsx';
import Search from './BottomTabScreens/Search.jsx';
import Chats from './BottomTabScreens/Chats.jsx';
import Account from './BottomTabScreens/Account.jsx';
import {useIsFocused} from '@react-navigation/native';
import {PERMISSIONS} from 'react-native-permissions';
import {CheckPermission} from '../../utils/Permission.js';
import {Getlocation} from '../../utils/Getlocation.js';
import CustomAlert from '../../components/CustomAlert/CustomAlert.jsx';
import {appName} from '../../constant/index.js';

const Main = ({navigation}) => {
  const isFocused = useIsFocused();
  const [tab, setTab] = useState(0);

  const getSelectedTab = tabNumber => {
    setTab(tabNumber);
  };

  useEffect(() => {
    // setTab(0);
    getSelectedTab(0);
    checkPermission();
  }, [isFocused]);

  const checkPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const isPermissionGranted = await CheckPermission(permission);
    if (isPermissionGranted) Getlocation();
  };

  return (
    <View style={{flex: 1}}>
      <AppHeader
        title={appName}
        logo={require('../../assets/logo-ecommerce.png')}
      />
      {tab == 0 ? (
        <Home />
      ) : tab == 1 ? (
        <Search />
      ) : tab == 3 ? (
        <Chats />
      ) : (
        <Account />
      )}

      {/* <CustomAlert visible={true} title={'hii'} message={'sdsads'} /> */}

      <Bottomtab callBack={getSelectedTab} tabValue={tab} />
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({});
