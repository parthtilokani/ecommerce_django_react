import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {COLORS, width} from '../../constant';

const Checkbox = ({text, secondTxt}) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  return (
    <View style={styles.container}>
      <CheckBox
        style={{marginRight:10,width:20,height:20}}
        boxType={'square'}
        animationDuration={0.1}
        value={toggleCheckBox}
        tintColors={{true: COLORS.tertiary, false: COLORS.gray}}
        onCheckColor={{true: COLORS.tertiary, false: COLORS.gray}}
        onFillColor={{true: COLORS.tertiary, false: COLORS.gray}}
        onValueChange={() => setToggleCheckBox(!toggleCheckBox)}
      />
      
      <Text style={{color: COLORS.black}}>{text}</Text>
      <Text style={{color: COLORS.tertiary}}>{secondTxt}</Text>
    </View>
  );
};

export default Checkbox;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    // alignItems: 'center',
    // justifyContent: 'center',
    width: width * 0.9,
    flexDirection: 'row',
  },
});
