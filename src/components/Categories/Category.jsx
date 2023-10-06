import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import useLocation from '../../hooks/useLocation.js';

const Category = ({navigation}) => {
  const {
    params: {item},
  } = useRoute();
  const {location} = useLocation();
  const [ads, setAds] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await axiosOpen('ads/ads', {
        params: {
          lat: location?.lat,
          long: location?.lng,
          place_id: location?.place_id,
          page: 1,
          page_size: 10,
        },
      });
      console.log({
        lat: location?.lat,
        long: location?.lng,
        place_id: location?.place_id,
        page: 1,
        page_size: 10,
      });
      setAds(
        data?.data?.results?.filter(e => {
          return e?.category === (item?.category?.id || item?.id);
        }),
      );
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };

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
          isLoading={isLoading}
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
