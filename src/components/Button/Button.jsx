import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  COLORS,
  FONTSIZE,
  SHADOWS,
  height,
  normalize,
  width,
} from '../../constant';

const Button = ({
  icon,
  text,
  style,
  textStyle,
  onPress,
  tintColor,
  disable = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={disable}>
      {icon && (
        <Image source={icon} style={[styles.icon, {tintColor: tintColor}]} />
      )}
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    width: width * 0.9,
    height: height * 0.055,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    // right: -5,
    marginRight: 10,
  },
  text: {
    fontSize: normalize(FONTSIZE.xxSmall),
    color: COLORS.white,
    fontWeight: '500',
  },
});
