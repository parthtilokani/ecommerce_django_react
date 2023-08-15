import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import GobackHeader from '../../../components/GobackHeader.jsx';
import Categories from '../../../components/Categories/Categories.jsx';
import {axiosOpen} from '../../../utils/axios.js';
import {useQuery} from '@tanstack/react-query';
import Loader from '../../../components/Loader/Loader.jsx';

const AllCatagories = () => {
  const [categoryData, setCategoryData] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setIsloading(true);
    const data = await axiosOpen('ads/category');
    console.log('AllCategory', data?.data);
    setCategoryData(data?.data);
    setIsloading(false);
  };

  return (
    <View style={styles.container}>
      <Loader visible={isLoading} />
      <GobackHeader resetBack bg title={'Category'} />
      <View style={styles.CategoriesView}>
        <Categories
          scrollEnabled={true}
          categories={categoryData}
          title={'Categories'}
          nav
        />
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
