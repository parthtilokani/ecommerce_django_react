import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS, FONTSIZE, icons, normalize, width} from '../constant';
import {useNavigation} from '@react-navigation/native';

const GobackHeader = ({title, bg, resetBack}) => {
  const navigation = useNavigation();
  return (
    <View style={[styles.container, bg && {backgroundColor: COLORS.primary}]}>
      <Pressable
        onPress={() =>
          resetBack ? navigation.goBack('Main') : navigation.goBack()
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
    padding: 10,
  },
  icon: {
    width: 25,
    height: 25,
    tintColor: COLORS.primary,
  },
  title: {
    marginLeft: width * 0.23,
    fontSize: normalize(FONTSIZE.large),
    fontWeight: '700',
    color: COLORS.white,
  },
});
