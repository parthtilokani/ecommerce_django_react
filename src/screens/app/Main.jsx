import {View} from 'react-native';
import React, {useState} from 'react';
import AppHeader from './../../components/AppHeader';
import Bottomtab from './../../components/BottomTab/Bottomtab.jsx';
import Home from './BottomTabScreens/Home.jsx';
import Search from './BottomTabScreens/Search.jsx';
import Chats from './BottomTabScreens/Chats.jsx';
import Account from './BottomTabScreens/Account.jsx';
import {appName} from '../../constant/index.js';

const Main = ({navigation}) => {
  const [tab, setTab] = useState(0);

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

      {/* <CustomAlert visible={true} title={'hii'} message={'sdsads'} /> */}

      <Bottomtab callBack={getSelectedTab} tabValue={tab} />
    </View>
  );
};

export default Main;
