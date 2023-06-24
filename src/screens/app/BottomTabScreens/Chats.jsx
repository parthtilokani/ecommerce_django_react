import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Button from '../../../components/Button/Button.jsx';
import {width} from '../../../constant/index.js';

const Chats = () => {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button
        text={'Sign In'}
        style={styles.buttonStyle}
        onPress={() => navigation.navigate('SignIn')}
      />
    </View>
  );
};

export default Chats;

const styles = StyleSheet.create({
  buttonStyle: {
    margin: 5,
    width: width * 0.7,
  },
});
