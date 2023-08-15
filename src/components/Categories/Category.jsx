import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import ListGridAds from '../Ads/ListGridAds.jsx';
import Header from '../Header/Header.jsx';
import AppHeader from '../AppHeader.jsx';
import GobackHeader from '../GobackHeader.jsx';
import {useRoute} from '@react-navigation/native';
import {getAds} from '../../utils/customHook/backEndCalls.js';
import {useQuery} from '@tanstack/react-query';
import {getPostAge} from '../../utils/supportFunctions.js';
import {baseURL} from '../../utils/Api.js';
import Button from '../Button/Button.jsx';
import {width} from '../../constant/index.js';
import {axiosOpen} from '../../utils/axios.js';

const Category = ({navigation}) => {
  const {
    params: {item},
  } = useRoute();
  // const [nextPage, setNextPage] = useState('');
  // const [prevPage, setPrevPage] = useState('');
  const [url, setUrl] = useState('ads/ads');

  const {
    data: ads,
    isLoading: loading,
    error: error,
    refetch,
  } = useQuery({
    queryKey: ['ads'],
    queryFn: async () => {
      const data = await axiosOpen('ads/ads');
      return data?.data?.results?.filter(
        e => e?.sub_category === item?.category?.id,
      );
    },
  });

  return (
    <View style={styles.container}>
      <GobackHeader title={'Ads'} bg />
      <View style={styles.listGirdView}>
        <ListGridAds
          isChange
          title={'Ads'}
          data={ads}
          onChnagePress={() => navigation.replace('AllCategories')}
          changeLayoutStyle
          scrollEnabled={true}
        />
      </View>
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listGirdView: {
    marginVertical: 10,
  },
});
