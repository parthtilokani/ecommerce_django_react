import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import icons from '../../constant/icons.js';
import {
  COLORS,
  FONTSIZE,
  SHADOWS,
  height,
  normalize,
  width,
} from '../../constant/index.js';
import Icons from 'react-native-vector-icons/dist/MaterialIcons.js';
import {useNavigation} from '@react-navigation/native';
import {baseURL} from '../../utils/Api.js';

const ListFlatAds = ({data, editDelete, deleteAds, isMyAds}) => {
  const navigation = useNavigation();
  const imageUri = data?.ads_image[0]?.image;
  // let imageUri;
  // if (data?.ads_image[0]?.image.includes(baseURL?.replace('/api', ''))) {
  //   imageUri = data?.ads_image[0]?.image;
  // } else {
  //   imageUri = `${baseURL?.replace('/api', data?.ads_image[0]?.image)}`;
  // }
  return (
    <TouchableOpacity
      style={[styles.container, SHADOWS.medium]}
      onPress={() => navigation.navigate('ShowAdsDetails', {data, isMyAds})}>
      <View style={styles.image_soldOutView}>
        {data?.is_sold && (
          <View style={[styles.sold_outView, SHADOWS.medium]}>
            <Text style={styles.sold_outText}>SOLD OUT</Text>
          </View>
        )}

        <Image
          source={imageUri ? {uri: imageUri} : icons.account}
          style={styles.image}
        />
      </View>
      <View style={styles.rightSideView}>
        <Text style={styles.titleText}>{data?.ad_title}</Text>
        <View style={styles.category_locationContainer}>
          <Image source={icons.description} style={styles.miniIcon} />
          <Text style={styles.text} numberOfLines={1}>
            {data?.ad_description}
          </Text>
        </View>
        <View style={styles.category_locationContainer}>
          {/* icon */}
          <Image source={icons.tag} style={styles.miniIcon} />
          <Text style={styles.text}>{data?.sub_category_name}</Text>
        </View>
        <View style={styles.category_locationContainer}>
          {/* icon */}
          <Image source={icons.location} style={styles.miniIcon} />
          <Text style={[styles.text, {width: width * 0.4}]} numberOfLines={1}>
            {data?.location || '--'}
          </Text>
        </View>
        <View style={styles.category_locationContainer}>
          <Image source={icons.time} style={styles.miniIcon} />
          <Text style={styles.text}>
            {data?.posted_on &&
              new Date(data?.posted_on).toLocaleString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                // hour: '2-digit',
                // minute: 'numeric',
                // hour12: true,
              })}
          </Text>
        </View>
      </View>
      {editDelete && (
        <View
          style={[
            {
              justifyContent: 'center',
            },
            SHADOWS.medium,
          ]}>
          <TouchableOpacity
            style={{
              // backgroundColor: '#0870E8',
              backgroundColor: COLORS.secondary,
              borderRadius: 30,
              padding: 8,
              marginVertical: 20,
            }}
            onPress={() => navigation.navigate('EditAdDetails', {data: data})}>
            <Icons name="edit" size={width * 0.07} color={COLORS.black} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.secondary,
              borderRadius: 30,
              padding: 8,
              marginVertical: 20,
            }}
            onPress={() => deleteAds(data?.id)}>
            <Icons
              name="delete-forever"
              size={width * 0.07}
              color={COLORS.black}
            />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ListFlatAds;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightWhite,
    borderRadius: 5,
    width: width * 0.95,
    height: height * 0.2,
    alignSelf: 'center',
    flexDirection: 'row',
    marginVertical: 7,
    padding: 5,
  },
  image_soldOutView: {
    overflow: 'hidden',
    borderRadius: 10,
    position: 'relative',
  },
  image: {
    // overflow: 'hidden',
    // resizeMode: 'cover',
    backgroundColor: COLORS.gray2,
    borderRadius: 10,
    width: width * 0.45,
    height: height * 0.2,
    // width: 100,
    // height: 100,
  },
  rightSideView: {
    flex: 1,
    marginLeft: 5,
    overflow: 'hidden',
  },
  sold_outView: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    position: 'absolute',
    top: height * 0.03,
    left: width * 0.134,
    zIndex: 1,
    justifyContent: 'flex-end',
    width: width * 0.3,
    flexShrink: 1,
    transform: [{rotate: '45deg'}],
  },
  sold_outText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: normalize(FONTSIZE.xSmall),
  },
  titleText: {
    fontSize: normalize(FONTSIZE.xxSmall),
    color: COLORS.black,
    fontWeight: 'bold',
  },
  category_locationContainer: {
    flexDirection: 'row',
    marginVertical: 3,
    alignItems: 'center',
  },
  miniIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.gray,
    marginRight: 7,
  },
  text: {
    color: COLORS.black,
    fontSize: normalize(FONTSIZE.small),
  },
  priceText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: normalize(FONTSIZE.xxSmall),
    // position: 'absolute',
    // bottom: 10,
  },
});
