import {
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
  Platform,
  Text,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import Header from '../../../components/Header/Header.jsx';
import Categories from '../../../components/Categories/Categories.jsx';
import Button from '../../../components/Button/Button.jsx';
import {useNavigation} from '@react-navigation/native';

import {COLORS, SHADOWS} from '../../../constant/theme.js';
import icons from '../../../constant/icons.js';
import ListGridAds from '../../../components/Ads/ListGridAds.jsx';
import {PERMISSIONS} from 'react-native-permissions';
import {CheckPermission, RequestPermission} from '../../../utils/Permission.js';
import {Getlocation} from '../../../utils/Getlocation.js';
import useLocation from '../../../hooks/useLocation.js';
import Loader from '../../../components/Loader/Loader.jsx';
import {height, width} from '../../../constant/index.js';
import {isConnectedToInternet} from '../../../utils/supportFunctions.js';
import Tostify from '../../../components/Tostify/Tostify.jsx';
import ToastManager, {Toast} from 'toastify-react-native';
import {axiosOpen} from '../../../utils/axios.js';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate.js';
import {retrieveUserSession} from '../../../utils/AsyncStorage/userSession.js';

const Home = () => {
  const navigation = useNavigation();
  const {location, setLocation} = useLocation();
  const scrollViewRef = useRef();
  const [refreshing, setRefreshing] = useState(false);
  const [fetchQueries, setFetchedQueries] = useState([false]);
  const [popularCategory, setPopulaCategory] = useState(null);
  const [mostRecentAds, setMostRecentAds] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (await isConnectedToInternet()) checkPermission();
    })();
    fetchPopularCategory();
    fetchMostRecentAds();
  }, []);

  const checkPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const isPermissionGranted = await CheckPermission(permission);
    if (isPermissionGranted) {
      // setLoading(true);
      const position = await Getlocation();
      setLocation(position[0].formatted_address);
    } else {
      await RequestPermission(permission);
      const position = await Getlocation();
      setLocation(position[0].formatted_address);
    }
    // setLoading(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // ads = fetchAds();
    // console.log('refresh', fetchAds());
    // setRefreshing(false);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const fetchPopularCategory = async () => {
    console.log(await retrieveUserSession('userToken'));
    try {
      setIsLoading(true);
      const popularCategory = await axiosOpen('/ads/ads/popular_category');
      setPopulaCategory(popularCategory.data?.popular_category);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log('error popularCategory', e);
    }
  };

  const fetchMostRecentAds = async () => {
    try {
      setIsLoading(true);
      const {data} = await axiosOpen('/ads/ads/most_recent', {
        params: {
          page: 1,
          limit: 8,
        },
      });
      setIsLoading(false);
      console.log('most recent ads', JSON.stringify(data?.popular_category));
      setMostRecentAds(
        data?.popular_category && typeof data?.popular_category === 'object'
          ? [...data?.popular_category]
          : [],
      );
    } catch (e) {
      setIsLoading(false);
      console.log('error mostRecentAds', e?.response?.data);
    }
  };

  const handleScrollToTop = () => {
    scrollViewRef.current.scrollTo({y: 0, animated: true});
  };

  return (
    <View style={{flex: 1}}>
      <Loader visible={isLoading} />
      <Header isSearchInput btnText={location} />
      <ScrollView
        ref={scrollViewRef}
        style={{marginBottom: 10}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        <Categories
          scrollEnabled={false}
          categories={popularCategory}
          title={'Popular Category'}
        />

        <Button
          style={styles.viewAllCategoriesBtn}
          text={'View All Categories'}
          onPress={() => navigation.navigate('AllCategories')}
        />
        <ListGridAds
          data={mostRecentAds}
          title={'Latest Ads'}
          changeLayoutStyle
          scrollEnabled={false}
        />
        {/* <Pressable
          style={[styles.scrollUpButton, SHADOWS.medium]}
          onPress={handleScrollToTop}>
          <Image source={icons.back} style={styles.scrollUpIcon} />
        </Pressable> */}
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  viewAllCategoriesBtn: {
    alignSelf: 'center',
    marginVertical: 15,
  },
  contentContainer: {
    paddingVertical: 20,
  },
  scrollUpButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: COLORS.secondary,
    bottom: 100,
    borderRadius: 40,
    right: 20,
    zIndex: 1,
    padding: 15,
  },
  scrollUpIcon: {
    width: width * 0.075,
    height: height * 0.039,
    tintColor: COLORS.white,
    transform: [{rotate: '90deg'}],
  },
});
