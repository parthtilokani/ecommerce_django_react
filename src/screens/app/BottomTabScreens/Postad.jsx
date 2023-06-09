import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import GobackHeader from '../../../components/GobackHeader.jsx';

const Postad = () => {
  return (
    <View style={{flex: 1}}>
      <GobackHeader bg resetBack title={'Classima'} />
      <Text>Post Ad</Text>
    </View>
  );
};

export default Postad;

const styles = StyleSheet.create({});
