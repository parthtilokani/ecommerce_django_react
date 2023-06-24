import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {COLORS, FONTSIZE, appName, normalize} from '../../constant';

const Splash = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Drawer');
    }, 2000);
  }, [navigation]);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{appName}</Text>
    </SafeAreaView>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: COLORS.white,
    fontSize: normalize(FONTSIZE.xxLarge),
  },
});
