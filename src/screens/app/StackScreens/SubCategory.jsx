import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {COLORS, FONTSIZE} from '../../../constant/theme.js';
import GobackHeader from '../../../components/GobackHeader.jsx';
import {useNavigation} from '@react-navigation/native';
import {height, icons, normalize, width} from '../../../constant/index.js';

const SubCategory = ({route}) => {
  const paramData = route?.params;
  const navigation = useNavigation();
  const data = ['1', '2', '3'];
  return (
    <SafeAreaView>
      <GobackHeader title={'Select Category'} bg />
      <View style={{margin: 10}}>
        <TouchableOpacity
          style={styles.mainCategory}
          onPress={() => navigation.goBack()}>
          <Text style={styles.tileTxt}>{paramData?.item?.title}</Text>
          <Image source={icons.close} style={styles.closeIcon} />
        </TouchableOpacity>
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.subCategory}
            onPress={() =>
              navigation.navigate('Category', {
                item: paramData?.item,
                category: true,
              })
            }>
            <Text style={styles.subCategoryTxt}>
              Show all of Business & Industry
            </Text>
          </TouchableOpacity>
        ))}
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
