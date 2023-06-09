import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import icons from '../../constant/icons.js';
import {
  COLORS,
  FONTSIZE,
  SHADOWS,
  height,
  width,
} from '../../constant/index.js';

const Ads = () => {
  return (
    <View style={[styles.container, SHADOWS.small]}>
      <Image source={icons.account} style={styles.image} />
      <View style={styles.rightSideView}>
        <View style={[styles.sold_outView, SHADOWS.medium]}>
          <Text style={styles.sold_outText}>SOLD OUT</Text>
        </View>
        <Text style={styles.titleText}>Properties for Rent</Text>
        <View style={styles.category_locationContainer}>
          {/* icon */}
          <Image source={icons.chat} style={styles.miniIcon} />
          <Text style={styles.text}>Category</Text>
        </View>
        <View style={styles.category_locationContainer}>
          {/* icon */}
          <Image source={icons.chat} style={styles.miniIcon} />
          <Text style={styles.text}>Location</Text>
        </View>
        <Text style={styles.priceText}>$1,240</Text>
      </View>
    </View>
  );
};

export default Ads;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightWhite,
    borderRadius: 5,
    width: width * 0.95,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  image: {
    // borderTopLeftRadius: 5,
    // borderBottomLeftRadius: 5,
    overflow: 'hidden',
    resizeMode: 'contain',
    width: width * 0.45,
    height: height * 0.17,
  },
  rightSideView: {
    flex: 1,
    // width: width * 0.47,
    marginLeft: 5,
    // backgroundColor: COLORS.tertiary,
  },
  sold_outView: {
    backgroundColor: COLORS.tertiary,
    alignItems: 'center',
    position: 'absolute',
    top: 30,
    right: 0,
    zIndex: 10,
    justifyContent: 'flex-end',
    width: width * 0.3,
    transform: [{rotate: '45deg'}],
  },
  sold_outText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: FONTSIZE.medium,
  },
  titleText: {
    fontSize: FONTSIZE.medium,
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
    color: COLORS.grey,
  },
  priceText: {
    color: COLORS.tertiary,
    fontWeight: 'bold',
    fontSize: FONTSIZE.medium,
    position: 'absolute',
    bottom: 10,
    // justifyContent: 'flex-end',
  },
});
