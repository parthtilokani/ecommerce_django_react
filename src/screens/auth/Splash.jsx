import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {COLORS, FONTSIZE} from '../../constant';

const Splash = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('SignIn');
    }, 2000);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>CLASSIMA</Text>
    </SafeAreaView>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: COLORS.white,
    fontSize: FONTSIZE.xxLarge,
  },
});
