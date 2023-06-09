import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AppHeader from '../../../components/AppHeader';
import Header from '../../../components/Header/Header.jsx';
import {height, width} from '../../../constant/index.js';
import Categories from '../../../components/Categories/Categories.jsx';

const Search = ({navigation}) => {
  return (
    <View>
      <Header btnStyle={styles.locationBtnStyle} />
      <Categories />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  locationBtnStyle: {
    width: width * 0.97,
    height: height * 0.05,
  },
});
