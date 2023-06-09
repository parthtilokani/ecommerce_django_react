import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS, FONTSIZE} from '../../constant/theme.js';
import Button from '../Button/Button.jsx';
import {height, icons, width} from '../../constant/index.js';
import Input from '../Inputs/Input.jsx';
import {useNavigation} from '@react-navigation/native';

const Header = ({isSearchInput, btnStyle}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Button
        icon={icons.location}
        style={[styles.btn, btnStyle]}
        tintColor={COLORS.tertiary}
        text={'Location'}
        textStyle={styles.textStyle}
        onPress={() => navigation.navigate('Location')}
      />
      {isSearchInput && (
        <Input
          placeholder={'Search...'}
          leftIcon={icons.search}
          style={styles.searchTextInput}
          isSearch={true}
        />
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height * 0.07,
    backgroundColor: COLORS.tertiary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    margin: 5,
    backgroundColor: COLORS.white,
    width: width * 0.32,
  },
  textStyle: {
    color: COLORS.black,
  },
  searchTextInput: {
    fontSize: FONTSIZE.medium,
    width: width * 0.64,
    height: height * 0.057,
  },
});
