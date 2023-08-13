import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React from 'react';
import {COLORS, FONTSIZE} from '../../../constant/theme.js';
import GobackHeader from '../../../components/GobackHeader.jsx';
import {useNavigation, useRoute} from '@react-navigation/native';
import {height, icons, normalize, width} from '../../../constant/index.js';
import {getSubCategory} from '../../../utils/customHook/backEndCalls.js';
import {useQuery} from '@tanstack/react-query';

const SubCategory = ({route}) => {
  const {
    params: {item},
  } = useRoute();
  const {data: subCategories, isLoading: loading} = useQuery({
    queryKey: ['subCategories'],
    queryFn: async () => {
      const data = await getSubCategory();
      return data.filter(e => e?.category === item?.id);
    },
  });
  const navigation = useNavigation();

  const renderFlatItems = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.subCategory}
        onPress={() =>
          navigation.navigate('Category', {
            item: item,
            category: true,
          })
        }>
        <Text style={styles.subCategoryTxt}>{item?.name}</Text>
      </TouchableOpacity>
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
            ? 'Select Sub-Category'
            : 'Sub-Categories not found'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <GobackHeader title={'Select Category'} bg />
      <View style={{margin: 10}}>
        <TouchableOpacity
          style={styles.mainCategory}
          onPress={() => navigation.goBack()}>
          <Text style={styles.tileTxt}>{item?.name}</Text>
          <Image source={icons.close} style={styles.closeIcon} />
        </TouchableOpacity>
        <FlatList
          data={subCategories}
          renderItem={renderFlatItems}
          keyExtractor={(item, index) => index}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={flatHeader}
          ListHeaderComponentStyle={{
            padding: 10,
          }}
          stickyHeaderIndices={[0]}
          ListFooterComponent={() => <View style={{height: height * 0.1}} />}
        />
      </View>
    </SafeAreaView>
  );
};

export default SubCategory;

const styles = StyleSheet.create({
  mainCategory: {
    backgroundColor: COLORS.white,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  subCategory: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  closeIcon: {
    width: width * 0.04,
    height: height * 0.02,
    tintColor: 'red',
  },
  tileTxt: {
    color: COLORS.black,
    fontSize: normalize(FONTSIZE.medium),
  },
  subCategoryTxt: {
    color: COLORS.black,
    fontSize: normalize(FONTSIZE.xxSmall),
  },
});
