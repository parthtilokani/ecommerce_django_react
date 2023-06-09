import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import GobackHeader from '../../../components/GobackHeader.jsx';
import Categories from '../../../components/Categories/Categories.jsx';

const AllCatagories = () => {
  return (
    <View>
      <GobackHeader resetBack bg title={'Select Category'} />
      <Categories scrollEnabled={true} />
    </View>
  );
};

export default AllCatagories;

const styles = StyleSheet.create({});
