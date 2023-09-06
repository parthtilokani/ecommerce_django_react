import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import GobackHeader from '../../../components/GobackHeader.jsx';
import {
  COLORS,
  FONTSIZE,
  SHADOWS,
  height,
  icons,
  normalize,
  width,
} from '../../../constant/index.js';
import {useQuery} from '@tanstack/react-query';
import Loader from '../../../components/Loader/Loader.jsx';
import {axiosOpen} from '../../../utils/axios.js';

const Postad = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const {data: categories, error: error} = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      setLoading(true);
      const data = await axiosOpen('/ads/category');
      setLoading(false);
      return data;
    },
  });

  const renderFlatItems = ({item, index}) => {
    return (
      <View style={[styles.categoryMainContainer, SHADOWS.small]}>
        <TouchableOpacity
          key={index}
          style={styles.categoryView}
          onPress={() =>
            navigation.navigate('SelectSubCategory', {category_id: item?.id})
          }>
          <View style={styles.categoryInnerView}>
            <Image source={{uri: item?.icon}} style={styles.icon} />
            <Text numberOfLines={1} style={styles.categoryText}>
              {item?.name}
            </Text>
          </View>
          <Image source={icons.next} style={styles.rightIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  const flatHeader = () => {
    return (
      <View>
        <Text
          style={{
            fontSize: normalize(FONTSIZE.medium),
            color: COLORS.black,
            fontWeight: 'bold',
            alignSelf: 'center',
          }}>
          {categories?.data?.length >= 1 ? 'Select Category' : 'Data not found'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      {/* <Loader visible={loading} /> */}
      <GobackHeader bg resetBack title={'Post Your Ads'} />
      <View style={styles.flatListMainView}>
        {loading ? (
          <ActivityIndicator
            size={'large'}
            color={COLORS.primary}
            style={{alignSelf: 'center', marginTop: 50}}
          />
        ) : (
          <FlatList
            data={categories?.data}
            keyExtractor={(item, index) => index}
            showsVerticalScrollIndicator={false}
            renderItem={renderFlatItems}
            ListHeaderComponent={flatHeader}
            ListHeaderComponentStyle={{
              backgroundColor: COLORS.lightWhite,
              padding: 10,
            }}
            stickyHeaderIndices={[0]}
            ListFooterComponent={() => <View style={{height: height * 0.1}} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Postad;

const styles = StyleSheet.create({
  flatListMainView: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  categoryMainContainer: {
    backgroundColor: COLORS.lightWhite,
    justifyContent: 'center',
    width: width * 0.85,
    padding: 5,
    paddingVertical: 7,
    margin: 10,
    borderRadius: 10,
  },
  categoryView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryInnerView: {flexDirection: 'row', alignItems: 'center', padding: 5},
  icon: {
    marginHorizontal: 5,
    width: width * 0.1,
    height: height * 0.04,
    resizeMode: 'contain',
    // tintColor: COLORS.black,
  },
  rightIcon: {
    marginRight: 20,
    width: width * 0.1,
    height: height * 0.03,
    resizeMode: 'contain',
    tintColor: COLORS.black,
  },

  categoryText: {
    fontSize: normalize(FONTSIZE.xxSmall),
    color: COLORS.black,
    marginLeft: 10,
    fontWeight: '500',
    width: width * 0.55,
  },
});
