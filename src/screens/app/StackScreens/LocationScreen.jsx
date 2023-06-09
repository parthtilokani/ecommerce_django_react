import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import GobackHeader from '../../../components/GobackHeader.jsx';
import Button from '../../../components/Button/Button.jsx';
import {height, width} from '../../../constant/index.js';

const LocationScreen = ({navigation}) => {
  return (
    <View>
      <GobackHeader bg title={'Select Location'} />
      <Button
        text={'Show all'}
        style={styles.showAllBtn}
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  showAllBtn: {
    width: width * 0.94,
    height: height * 0.04,
    alignSelf: 'center',
    margin: 10,
  },
});
