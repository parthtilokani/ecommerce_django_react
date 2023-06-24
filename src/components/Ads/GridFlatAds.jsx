import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLORS, FONTSIZE, SHADOWS} from '../../constant/theme.js';
import icons from '../../constant/icons.js';
import {height, normalize, width} from '../../constant/index.js';

const GridFlatAds = () => {
  return (
    <TouchableOpacity style={[styles.container, SHADOWS.medium]}>
      <View style={styles.image_soldOutView}>
        <View style={[styles.sold_outView, SHADOWS.medium]}>
          <Text style={styles.sold_outText}>SOLD OUT</Text>
        </View>
        <Image source={icons.account} style={styles.image} />
      </View>
      <View style={styles.bottomView}>
        <Text style={styles.titleText} numberOfLines={1}>
          Properties for Rent
        </Text>
        <View style={styles.category_locationContainer}>
          {/* icon */}
          <Image source={icons.tag} style={styles.miniIcon} />
          <Text style={styles.text} numberOfLines={1}>
            Category
          </Text>
        </View>
        <View style={styles.category_locationContainer}>
          {/* icon */}
          <Image source={icons.location} style={styles.miniIcon} />
          <Text style={styles.text} numberOfLines={1}>
            Location
          </Text>
        </View>
        <Text style={styles.priceText}>$1,240</Text>
      </View>
    </TouchableOpacity>
  );
};

export default GridFlatAds;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightWhite,
    borderRadius: 5,
    maxWidth: width * 0.5,
    height: height * 0.32,
    alignSelf: 'center',
    // flexDirection: 'row',
    padding: 5,
    margin: 5,
  },
  image_soldOutView: {
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 10,
  },
  image: {
    resizeMode: 'contain',
    width: width * 0.43,
    height: height * 0.17,
    // borderRadius: 10,
    // width: 100,
    // height: 100,
    // backgroundColor: 'red',
  },
  bottomView: {
    flex: 1,
    marginLeft: 5,
  },
  sold_outView: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    position: 'absolute',
    top: 25,
    right: -25,
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
    width: width * 0.42,
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
    marginVertical: 3,
  },
  priceText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: normalize(FONTSIZE.xxSmall),
    // position: 'absolute',
    // marginVertical: 5,
    // bottom: 5,
  },
});
