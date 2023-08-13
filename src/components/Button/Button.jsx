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
      style={[styles.container, style, disable && {backgroundColor: 'gray'}]}
      onPress={onPress}
      disabled={disable}>
      {icon && (
        <Image source={icon} style={[styles.icon, {tintColor: tintColor}]} />
      )}
      <Text style={[styles.text, textStyle]} numberOfLines={1}>
        {text}
      </Text>
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
    width: width * 0.05,
    height: height * 0.027,
    marginRight: 10,
    resizeMode: 'contain',
  },
  text: {
    fontSize: normalize(FONTSIZE.xxSmall),
    color: COLORS.white,
    fontWeight: '500',
    overflow: 'hidden',
  },
});
