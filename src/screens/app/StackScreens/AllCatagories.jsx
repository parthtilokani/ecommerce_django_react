import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import GobackHeader from '../../../components/GobackHeader.jsx';
import Categories from '../../../components/Categories/Categories.jsx';

const AllCatagories = () => {
  return (
    <View style={styles.container}>
      <GobackHeader resetBack bg title={'Select Category'} />
      <View style={styles.CategoriesView}>
        <Categories scrollEnabled={true} />
      </View>
    </View>
  );
};

export default AllCatagories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  CategoriesView: {
    marginVertical: 10,
  },
});
