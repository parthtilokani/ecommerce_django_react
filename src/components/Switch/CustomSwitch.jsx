import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Switch} from 'react-native-paper';
import {COLORS, FONTSIZE} from '../../constant/theme.js';
import {normalize} from '../../constant/index.js';

const CustomSwitch = ({text, value, setValue}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      <Switch value={value} onValueChange={setValue} color={COLORS.primary} />
    </View>
  );
};

export default CustomSwitch;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 3,
  },
  text: {
    fontSize: normalize(FONTSIZE.xxSmall),
    color: COLORS.black,
  },
});
