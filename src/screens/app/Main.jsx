import {Alert, View, BackHandler} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppHeader from './../../components/AppHeader';
import Bottomtab from './../../components/BottomTab/Bottomtab.jsx';
import Home from './BottomTabScreens/Home.jsx';
import Search from './BottomTabScreens/Search.jsx';
import Chats from './BottomTabScreens/Chats.jsx';
import Account from './BottomTabScreens/Account.jsx';
import {appName, width} from '../../constant/index.js';
import {useIsFocused, useRoute} from '@react-navigation/native';
import CustomAlert from '../../components/CustomAlert/CustomAlert.jsx';
import ToastManager, {Toast} from 'toastify-react-native';
const Main = () => {
  const [tab, setTab] = useState(0);
  const isFocused = useIsFocused();
  const [customAlert, setCustomAert] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if (isFocused) {
        setCustomAert(true);
        // Alert.alert('ALERT!', 'Are you sure you want to exit app?', [
        //   {
        //     text: 'Cancel',
        //     onPress: () => null,
        //     style: 'cancel',
        //   },
        //   {text: 'YES', onPress: () => BackHandler.exitApp()},
        // ]);
        return true;
      } else {
        backHandler.remove();
      }
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => {
      backHandler.remove();
    };
  }, [isFocused]);

  const getSelectedTab = tabNumber => {
    setTab(tabNumber);
  };
  const payment = useRoute()?.params?.payment;
  useEffect(() => {
    if (payment) {
      Toast.success('Plan purches successfully!');
    } else if (payment === false) {
      Toast.error('Plan purches failed!');
    }
  }, [payment]);

  return (
    <View style={{flex: 1}}>
      <ToastManager style={{width: width * 0.9}} />
      <CustomAlert
        visible={customAlert}
        title={'Alert!'}
        message={'Are you sure you want to exit app?'}
        onOkPress={() => {
          setCustomAert(false);
          BackHandler.exitApp();
        }}
        onCancel={() => setCustomAert(false)}
      />

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
