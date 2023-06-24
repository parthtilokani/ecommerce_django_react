import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS, FONTSIZE} from '../../constant/theme.js';
import Button from '../Button/Button.jsx';
import {height, icons, width} from '../../constant/index.js';
import Input from '../Inputs/Input.jsx';
import {useNavigation} from '@react-navigation/native';
import {Searchbar} from 'react-native-paper';
const Header = ({isSearchInput, btnStyle}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Button
        icon={icons.location}
        style={[styles.btn, btnStyle]}
        tintColor={COLORS.secondary}
        text={'Location'}
        textStyle={styles.textStyle}
        onPress={() => navigation.navigate('Location')}
      />
      {isSearchInput && (
        <Searchbar
          style={styles.searchTextInput}
          mode="bar"
          placeholder="Search..."
          placeholderTextColor={COLORS.black}
          icon={icons.search}
          iconColor={COLORS.secondary}
          clearButtonMode="always"
          inputStyle={{
            alignSelf: 'center',
          }}
          loading={false}
        />
      )}
      {/* {isSearchInput && (
        <Input
          placeholder={'Search...'}
          leftIcon={icons.search}
          style={styles.searchTextInput}
          isSearch={true}
        />
      )} */}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height * 0.07,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    margin: 5,
    backgroundColor: COLORS.white,
    width: width * 0.32,
    height: height * 0.054,
  },
  textStyle: {
    color: COLORS.black,
  },
  searchTextInput: {
    // fontSize: FONTSIZE.medium,
    color: COLORS.black,
    borderRadius: 10,
    width: width * 0.64,
    height: height * 0.054,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
