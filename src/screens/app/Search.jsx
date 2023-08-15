import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import GobackHeader from '../../components/GobackHeader.jsx';
import {
  COLORS,
  FONTSIZE,
  height,
  icons,
  normalize,
  width,
} from '../../constant/index.js';
import {Searchbar} from 'react-native-paper';
import {Getlocation} from '../../utils/Getlocation.js';
import {axiosOpen} from '../../utils/axios.js';
import ListGridAds from '../../components/Ads/ListGridAds.jsx';

const Search = () => {
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(8);
  const [totalData, setTotalData] = useState(0);
  const [location, setLocation] = useState([] || null);

  useEffect(() => {
    (async () => {
      Getlocation()
        .then(e => {
          console.log(JSON.stringify(e[0]?.geometry?.location?.lat));
          setLocation(e);
          onSearch();
        })
        .catch(err => console.log(err));
    })();
  }, [searchValue]);

  const onSearch = async () => {
    const paramsObj = {
      page: currentPage,
      page_size: itemPerPage,
      lat: location[0]?.geometry?.location?.lat,
      long: location[0]?.geometry?.location?.lng,
    };
    if (searchValue) {
      paramsObj.search = searchValue;
    }
    const {data} = await axiosOpen.get('/ads/ads', {
      params: paramsObj,
    });
    setTotalData(data);
  };
  return (
    <SafeAreaView style={{marginBottom: 100}}>
      <GobackHeader bg title={'Search'} />
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
      <ListGridAds
        data={totalData?.results}
        changeLayoutStyle
        scrollEnabled={true}
        pagination={totalData?.results?.length <= 10 ? false : true}
        prevPage={!(currentPage - 1 < 1)}
        nextPage={
          !((currentPage + 1) * itemPerPage - itemPerPage > totalData - 1)
        }
        onNextPress={() => setCurrentPage(prev => prev + 1)}
        onPrevPress={() => setCurrentPage(prev => prev - 1)}
      />
    </SafeAreaView>
  );
};

export default Search;
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
    width: width * 0.9,
    height: height * 0.054,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 10,
  },
});
