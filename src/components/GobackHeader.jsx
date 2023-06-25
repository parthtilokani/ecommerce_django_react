import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS, FONTSIZE, icons, normalize, width} from '../constant';
import {useNavigation} from '@react-navigation/native';

const GobackHeader = ({title, bg, resetBack}) => {
  const navigation = useNavigation();
  return (
    <View style={[styles.container, bg && {backgroundColor: COLORS.primary}]}>
      <Pressable
        style={{position: 'absolute', left: 15}}
        onPress={() =>
          resetBack ? navigation.replace('Drawer') : navigation.goBack()
        }>
        <Image
          source={icons.back}
          style={[
            styles.icon,
            bg ? {tintColor: COLORS.white} : {tintColor: COLORS.primary},
          ]}
        />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default GobackHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  icon: {
    width: 25,
    height: 25,
    tintColor: COLORS.primary,
  },
  title: {
    fontSize: normalize(FONTSIZE.large),
    fontWeight: '700',
    color: COLORS.white,
  },
});
