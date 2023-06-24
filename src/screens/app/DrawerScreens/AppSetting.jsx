import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import GobackHeader from '../../../components/GobackHeader.jsx';
import CustomSwitch from '../../../components/Switch/CustomSwitch.jsx';
import {COLORS, FONTSIZE, normalize} from '../../../constant/index.js';

const Appsetting = () => {
  const [switchData, setSwitchData] = useState({
    listView: false,
    adsApproval: false,
    expiredList: false,
  });

  const onChangeSwitch = key => {
    setSwitchData(prev => ({...prev, [key]: !switchData[key]}));
  };

  return (
    <SafeAreaView>
      <GobackHeader bg title={'Settings'} />
      <Text style={styles.title}>Notification</Text>
      <CustomSwitch
        text={'Ads Approval'}
        value={switchData.adsApproval}
        setValue={() => onChangeSwitch('adsApproval')}
      />
      <CustomSwitch
        text={'Expired Listing'}
        value={switchData.expiredList}
        setValue={() => onChangeSwitch('expiredList')}
      />
      <Text style={styles.title}>Listing Display Style</Text>
      <CustomSwitch
        text={'List View'}
        value={switchData.listView}
        setValue={() => onChangeSwitch('listView')}
      />
    </SafeAreaView>
  );
};

export default Appsetting;

const styles = StyleSheet.create({
  title: {
    fontSize: normalize(FONTSIZE.medium),
    color: COLORS.black,
    fontWeight: '500',
    marginTop: 10,
    marginHorizontal: 10,
  },
});
