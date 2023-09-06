import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import GobackHeader from '../../components/GobackHeader.jsx';
import {
  COLORS,
  FONTSIZE,
  height,
  icons,
  normalize,
  width,
  SHADOWS,
} from '../../constant/index.js';
import {Searchbar} from 'react-native-paper';
import {Getlocation} from '../../utils/Getlocation.js';
import {axiosOpen} from '../../utils/axios.js';
import ListGridAds from '../../components/Ads/ListGridAds.jsx';
import {Dropdown} from 'react-native-element-dropdown';

const Search = () => {
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(8);
  const [totalData, setTotalData] = useState(0);
  const [location, setLocation] = useState([] || null);
  const [isLoading, setIsloading] = useState(false);
  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [categorySelected, setCategorySelected] = useState(false);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [filteredSubCategoryList, setFilteredSubCategoryList] = useState([]);

  useEffect(() => {
    (async () => {
      const category = await axiosOpen('/ads/category');
      const subCategory = await axiosOpen('/ads/subcategory');
      setCategoryList(category?.data);
      setSubCategoryList(subCategory?.data);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      Getlocation()
        .then(e => {
          setLocation(e);
          onSearch();
        })
        .catch(err => console.log(err));
    })();
  }, [searchValue, category, subCategory]);

  const onSearch = async () => {
    const paramsObj = {
      page: currentPage,
      page_size: itemPerPage,
      lat: location[0]?.geometry?.location?.lat,
      long: location[0]?.geometry?.location?.lng,
      // place_id: location[0]?.place_id,
    };
    if (searchValue) {
      paramsObj.search = searchValue;
    }
    if (category) paramsObj.category = category;
    if (subCategory) paramsObj.sub_category = subCategory;
    if (
      !location[0]?.geometry?.location?.lat &&
      !location[0]?.geometry?.location?.lng
    ) {
      paramsObj.place_id = location[0]?.place_id;
    }
    try {
      setIsloading(true);
      const {data} = await axiosOpen.get('/ads/ads', {
        params: paramsObj,
      });
      setIsloading(false);
      setTotalData(data);
    } catch (e) {
      setIsloading(false);
      setTotalData(data);
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={{}}>
      <GobackHeader bg title={'Search'} />
      <View style={{alignItems: 'center', marginVertical: 5}}>
        <Dropdown
          style={[styles.dropdown, {...SHADOWS.medium}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          itemTextStyle={{color: COLORS.black}}
          iconStyle={styles.iconStyle}
          data={categoryList}
          maxHeight={300}
          labelField="name"
          valueField="id"
          placeholder={'Select category'}
          value={category}
          onChange={item => {
            setCategorySelected(true);
            const sub = subCategoryList?.filter(e => e?.category === item?.id);
            setFilteredSubCategoryList(sub);
            setSubCategory('');
            setCategory(item?.id);
          }}
        />
      </View>
      <View style={{alignItems: 'center', marginVertical: 5}}>
        <Dropdown
          style={[styles.dropdown, {...SHADOWS.medium}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          itemTextStyle={{color: COLORS.black}}
          iconStyle={styles.iconStyle}
          data={
            categorySelected
              ? filteredSubCategoryList
              : subCategoryList.filter(e => e?.category === category)
          }
          maxHeight={300}
          labelField="name"
          valueField="id"
          placeholder={'Select subcategory'}
          value={subCategory}
          onChange={item => {
            setSubCategory(item?.id);
          }}
          disable={!categorySelected}
        />
      </View>
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
      <View style={{marginBottom: height * 0.4}}>
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
          isLoading={isLoading}
        />
      </View>
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
  inputFieldView: {flex: 1, alignItems: 'center', marginTop: 7},
  inputFieldTitleTxt: {
    alignSelf: 'flex-start',
    marginHorizontal: width * 0.05,
    marginVertical: 5,
    fontSize: normalize(FONTSIZE.xxSmall),
    color: COLORS.black,
  },
  textInputView: {
    borderWidth: 0.9,
    borderRadius: 15,
    margin: 5,
  },
  input: {
    height: height * 0.05,
    marginVertical: 10,
  },
  inputStyle: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    margin: 0,
  },

  dropdown: {
    height: height * 0.05,
    width: width * 0.9,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginVertical: 5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: COLORS.black,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: COLORS.black,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: COLORS.black,
  },
});
