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

const ListFlatAds = () => {
  return (
    <TouchableOpacity style={[styles.container, SHADOWS.medium]}>
      <View style={styles.image_soldOutView}>
        <View style={[styles.sold_outView, SHADOWS.medium]}>
          <Text style={styles.sold_outText}>SOLD OUT</Text>
        </View>

        <Image source={icons.account} style={styles.image} />
      </View>
      <View style={styles.rightSideView}>
        <Text style={styles.titleText}>Properties for Rent</Text>
        <View style={styles.category_locationContainer}>
          {/* icon */}
          <Image source={icons.tag} style={styles.miniIcon} />
          <Text style={styles.text}>Category</Text>
        </View>
        <View style={styles.category_locationContainer}>
          {/* icon */}
          <Image source={icons.location} style={styles.miniIcon} />
          <Text style={styles.text}>Location</Text>
        </View>
        <Text style={styles.priceText}>$1,240</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ListFlatAds;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightWhite,
    borderRadius: 5,
    width: width * 0.95,
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
    resizeMode: 'contain',
    width: width * 0.35,
    height: height * 0.15,
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
    top: 25,
    left: 45,
    zIndex: 1,
    justifyContent: 'flex-end',
    width: width * 0.3,
    flexShrink: 1,
    transform: [{rotate: '45deg'}],
  },
  sold_outText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: normalize(FONTSIZE.xxSmall),
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
    color: COLORS.gray,
  },
  priceText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: normalize(FONTSIZE.xxSmall),
    position: 'absolute',
    bottom: 10,
  },
});
