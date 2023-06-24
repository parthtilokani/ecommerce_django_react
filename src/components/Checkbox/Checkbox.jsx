import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
// import CheckBox from '@react-native-community/checkbox';
import {Checkbox} from 'react-native-paper';

import {COLORS, width} from '../../constant';

const CheckboxComponent = ({
  text,
  secondTxt,
  checkboxValue,
  setCheckboxValue,
}) => {
  // const [toggleCheckBox, setToggleCheckBox] = useState(false);
  return (
    <View style={styles.container}>
      <Checkbox.Android
        // style={{marginRight: 10, width: 30, height: 30}}
        color={COLORS.primary}
        uncheckedColor={COLORS.gray}
        status={checkboxValue ? 'checked' : 'unchecked'}
        onPress={setCheckboxValue}
      />

      <Text style={{color: COLORS.black}}>{text}</Text>
      <Text style={{color: COLORS.primary}}>{secondTxt}</Text>
    </View>
  );
};

export default CheckboxComponent;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
    width: width * 0.9,
    flexDirection: 'row',
  },
});
