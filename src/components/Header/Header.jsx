import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {COLORS, FONTSIZE} from '../../constant/theme.js';
import Button from '../Button/Button.jsx';
import {height, icons, normalize, width} from '../../constant/index.js';
import Input from '../Inputs/Input.jsx';
import {useNavigation} from '@react-navigation/native';
import {Searchbar} from 'react-native-paper';
const Header = ({isSearchInput, btnStyle, btnText = 'Location'}) => {
  const navigation = useNavigation();
  const [searchValue, setSearchValue] = useState('');
  return (
    <View style={styles.container}>
      <Button
        icon={icons.location}
        style={[styles.btn, btnStyle]}
        tintColor={COLORS.secondary}
        text={btnText}
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
          // clearButtonMode="always"
          value={searchValue}
          onChangeText={v => setSearchValue(v)}
          inputStyle={{
            alignSelf: 'center',
            fontSize: normalize(FONTSIZE.xxSmall),
          }}
          loading={false}
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
    width: width * 0.2,
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
