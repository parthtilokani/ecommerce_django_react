import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
} from 'react-native';
import React from 'react';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import {COLORS, FONTSIZE, height, icons, normalize, width} from '../constant';

const AppHeader = ({title, leftIcon, logo}) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerView}>
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Image source={icons.menu} style={styles.icon} />
        </Pressable>
        {/* <Image source={logo} style={styles.logoImage} /> */}
        <Text style={styles.title}>{title}</Text>
      </View>
    </SafeAreaView>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height * 0.092,
    backgroundColor: COLORS.primary,
  },
  innerView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    left: 10,
    top: -7,
    width: 20,
    height: 20,
    alignSelf: 'flex-start',
    tintColor: COLORS.white,
  },
  logoImage: {
    width: width * 0.45,
    height: height * 0.05,
    resizeMode: 'stretch',
    marginLeft: width * 0.2,
  },

  // this style for Text Title
  title: {
    marginLeft: width * 0.2,
    fontSize: normalize(FONTSIZE.xxLarge),
    color: COLORS.white,
    fontWeight: '700',
    textAlign: 'center',
  },
});
