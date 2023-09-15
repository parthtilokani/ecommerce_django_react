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

import {COLORS, FONTSIZE, SHADOWS} from '../../../constant/theme.js';
import icons from '../../../constant/icons.js';
import ListGridAds from '../../../components/Ads/ListGridAds.jsx';
import {PERMISSIONS} from 'react-native-permissions';
import {CheckPermission, RequestPermission} from '../../../utils/Permission.js';
import {Getlocation} from '../../../utils/Getlocation.js';
import useLocation from '../../../hooks/useLocation.js';
import {height, normalize, width} from '../../../constant/index.js';
import {isConnectedToInternet} from '../../../utils/supportFunctions.js';
import Tostify from '../../../components/Tostify/Tostify.jsx';
import ToastManager, {Toast} from 'toastify-react-native';
import {axiosOpen} from '../../../utils/axios.js';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate.js';
import {retrieveUserSession} from '../../../utils/AsyncStorage/userSession.js';
import HalfScreenModal from '../../../components/PhoneOtpModal/HalfScreenModal.jsx';

const Home = () => {
  const navigation = useNavigation();
  const {location, setLocation} = useLocation();
  const scrollViewRef = useRef();
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [popularCategory, setPopulaCategory] = useState(null);
  const [mostRecentAds, setMostRecentAds] = useState(null);
  const [popularCategoryLoader, setPopularCategoryLoader] = useState(false);
  const [mostRecentAdsLoader, setMostRecentAdsLoader] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(8);
  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchLocation, setSearchLoacation] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (await isConnectedToInternet()) checkPermission();
    })();
    fetchPopularCategory();
    fetchMostRecentAds();
  }, [searchLocation]);

  useEffect(() => {
    (async () => {
      Getlocation()
        .then(e => {
          setSearchLoacation(e);
          onSearch();
        })
        .catch(err => console.log(err));
    })();
  }, [searchValue, category, subCategory]);

  const onSearch = async () => {
    const paramsObj = {
      page: currentPage,
      page_size: itemPerPage,
      lat: searchLocation[0]?.geometry?.location?.lat,
      long: searchLocation[0]?.geometry?.location?.lng,
      place_id: searchLocation[0]?.place_id,
    };
    if (searchValue) paramsObj.search = searchValue;
    if (category) paramsObj.category = category;
    if (subCategory) paramsObj.sub_category = subCategory;

    console.log('paramObj', paramsObj);

    try {
      setSearchLoading(true);
      const {data} = await axiosOpen.get('/ads/ads', {
        params: paramsObj,
      });
      setSearchLoading(false);
      setSearchData(data);
    } catch (e) {
      setSearchLoading(false);
      setSearchData(data);
    }
  };

  const checkPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const isPermissionGranted = await CheckPermission(permission);
    if (isPermissionGranted) {
      // setLoading(true);
      const position = await Getlocation();
      if (location === 'Location') {
        setLocation(position[0].formatted_address);
      }
    } else {
      await RequestPermission(permission);
      if (location === 'Location') {
        const position = await Getlocation();
        setLocation(position[0].formatted_address);
      }
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
      setPopularCategoryLoader(true);
      const popularCategory = await axiosOpen('/ads/ads/popular_category');
      setPopulaCategory(popularCategory.data?.popular_category);
      setPopularCategoryLoader(false);
    } catch (e) {
      setPopularCategoryLoader(false);
      console.log('error popularCategory', e);
    }
  };

  const fetchMostRecentAds = async () => {
    console.log('mostrecentAds', searchLocation[0]?.place_id);
    try {
      setMostRecentAdsLoader(true);
      console.log(searchLocation[0]?.geometry?.location?.lat);
      const {data} = await axiosOpen('/ads/ads/most_recent', {
        params: {
          latitude: searchLocation[0]?.geometry?.location?.lat,
          longitude: searchLocation[0]?.geometry?.location?.lng,
          place_id: searchLocation[0]?.place_id || '',
          page: 1,
          limit: 8,
        },
      });
      setMostRecentAdsLoader(false);
      setMostRecentAds(
        data?.popular_category && typeof data?.popular_category === 'object'
          ? [...data?.popular_category]
          : [],
      );
      console.log('data?.popular_category', data?.popular_category);
    } catch (e) {
      setMostRecentAdsLoader(false);
      console.log('error mostRecentAds', e?.response?.data);
    }
  };

  const handleScrollToTop = () => {
    scrollViewRef.current.scrollTo({y: 0, animated: true});
  };

  return (
    <View style={{flex: 1}}>
      <Header
        isSearchInput
        btnText={location}
        setFilterModalVisible={setFilterModalVisible}
        searchValue={searchValue?.trim()}
        setSearchValue={setSearchValue}
        onSearch={onSearch}
      />
      {location === 'Location' ? (
        <Text
          style={{
            color: COLORS.black,
            textAlign: 'center',
            margin: 10,
            fontSize: normalize(FONTSIZE.medium),
          }}>
          Please select location
        </Text>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          style={{marginBottom: 10}}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }>
          {searchValue != '' && (
            <>
              <ListGridAds
                data={searchData?.results}
                changeLayoutStyle
                scrollEnabled={false}
                pagination={searchData?.results?.length <= 10 ? false : true}
                prevPage={!(currentPage - 1 < 1)}
                nextPage={
                  !(
                    (currentPage + 1) * itemPerPage - itemPerPage >
                    searchData - 1
                  )
                }
                onNextPress={() => setCurrentPage(prev => prev + 1)}
                onPrevPress={() => setCurrentPage(prev => prev - 1)}
                isLoading={searchLoading}
              />
            </>
          )}
          {searchValue == '' && (
            <>
              <Categories
                scrollEnabled={false}
                categories={popularCategory}
                title={'Popular Category'}
                isLoading={popularCategoryLoader}
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
                isLoading={mostRecentAdsLoader}
              />
            </>
          )}
          <HalfScreenModal
            setSearch={setSearchValue}
            isVisible={filterModalVisible}
            onClose={() => setFilterModalVisible(false)}
            category={category}
            setCategory={setCategory}
            subCategory={subCategory}
            setSubCategory={setSubCategory}
          />
        </ScrollView>
      )}
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