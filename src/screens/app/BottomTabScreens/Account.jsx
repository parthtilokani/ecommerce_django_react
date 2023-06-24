import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Button from '../../../components/Button/Button.jsx';
import {SHADOWS, width} from '../../../constant/index.js';
import {useNavigation} from '@react-navigation/native';

const Account = () => {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button
        text={'Sign In'}
        style={[styles.buttonStyle, SHADOWS.medium]}
        onPress={() => navigation.replace('SignIn')}
      />
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  buttonStyle: {
    margin: 5,
    width: width * 0.7,
  },
});
