import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTSIZE, height, icons, width} from '../constant';
// import {} from '@react-navigation/drawer';

const AppHeader = ({title, leftIcon}) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerView}>
        <Pressable onPress={() => navigation.openDrawer()}>
          <Image source={icons.menu} style={styles.icon} />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
      </View>
    </SafeAreaView>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height * 0.075,
    backgroundColor: COLORS.tertiary,
  },
  innerView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    // justifyContent: 'space-between',
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: COLORS.white,
  },
  title: {
    marginLeft: width * 0.28,
    fontSize: FONTSIZE.xxLarge,
    color: COLORS.white,
    fontWeight: '700',
    textAlign: 'center',
  },
});
