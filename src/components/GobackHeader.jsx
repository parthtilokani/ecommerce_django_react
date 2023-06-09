import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS, FONTSIZE, icons, width} from '../constant';
import {useNavigation} from '@react-navigation/native';

const GobackHeader = ({title, bg, resetBack}) => {
  const navigation = useNavigation();
  return (
    <View style={[styles.container, bg && {backgroundColor: COLORS.tertiary}]}>
      <Pressable
        onPress={() =>
          resetBack ? navigation.goBack('Main') : navigation.goBack()
        }>
        <Image
          source={icons.back}
          style={[
            styles.icon,
            bg ? {tintColor: COLORS.white} : {tintColor: COLORS.tertiary},
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
    tintColor: COLORS.tertiary,
  },
  title: {
    marginLeft: width * 0.25,
    fontSize: FONTSIZE.large,
    fontWeight: '700',
    color: COLORS.white,
  },
});
