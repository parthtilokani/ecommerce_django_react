import {Alert, View, BackHandler} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppHeader from './../../components/AppHeader';
import Bottomtab from './../../components/BottomTab/Bottomtab.jsx';
import Home from './BottomTabScreens/Home.jsx';
import Search from './BottomTabScreens/Search.jsx';
import Chats from './BottomTabScreens/Chats.jsx';
import Account from './BottomTabScreens/Account.jsx';
import {appName} from '../../constant/index.js';
import {useIsFocused} from '@react-navigation/native';

const Main = ({navigation}) => {
  const [tab, setTab] = useState(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    const backAction = () => {
      Alert.alert('ALERT!', 'Are you sure you want to exit app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => {
      console.log('sdasdad');
      backHandler.remove();
    };
  }, []);
  const getSelectedTab = tabNumber => {
    setTab(tabNumber);
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

      <Bottomtab callBack={getSelectedTab} tabValue={tab} />
    </View>
  );
};

export default Main;
