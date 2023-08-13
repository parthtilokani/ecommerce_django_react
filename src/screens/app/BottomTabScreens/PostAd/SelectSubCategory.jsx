import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  View,
} from 'react-native';
import React, {useState} from 'react';
import GobackHeader from '../../../../components/GobackHeader.jsx';
import {useQuery} from '@tanstack/react-query';
import {useRoute} from '@react-navigation/native';
import icons from '../../../../constant/icons.js';
import Loader from '../../../../components/Loader/Loader.jsx';
import {COLORS, FONTSIZE, SHADOWS} from '../../../../constant/theme.js';
import {height, width, normalize} from '../../../../constant/index.js';
import {axiosOpen} from '../../../../utils/axios.js';

const SelectSubCategory = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const {
    params: {category_id},
  } = useRoute();
  const {data: subCategories} = useQuery({
    queryKey: ['subCategories'],
    queryFn: async () => {
      setLoading(true);
      const data = await axiosOpen('/ads/subcategory');
      setLoading(false);
      return data?.data?.filter(e => e?.category === category_id);
    },
  });
  const renderFlatItems = ({item, index}) => {
    return (
      <View style={[styles.categoryMainContainer, SHADOWS.small]}>
        <TouchableOpacity
          key={index}
          style={styles.categoryView}
          onPress={() =>
            navigation.navigate('PostAdDetails', {
              category_id,
              subcategory_id: item?.id,
              dynamic_field: item?.dynamic_field?.map(df => ({
                ...df,
                value: '',
              })),
            })
          }>
          <View style={styles.categoryInnerView}>
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
          {subCategories?.length >= 1
            ? 'Select sub-category'
            : 'Data not found'}
        </Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <Loader visible={loading} />
      <GobackHeader bg title="Post Your Ads" />
      <View style={styles.flatListMainView}>
        <FlatList
          data={subCategories}
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
      </View>
    </SafeAreaView>
  );
};

export default SelectSubCategory;

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
  categoryInnerView: {flexDirection: 'row', alignItems: 'center', padding: 10},
  icon: {
    marginHorizontal: 5,
    width: width * 0.06,
    height: height * 0.03,
    resizeMode: 'contain',
    tintColor: COLORS.black,
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
