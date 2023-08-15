import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React from 'react';
import {COLORS, FONTSIZE, SHADOWS} from '../../constant/theme.js';
import icons from '../../constant/icons.js';
import {height, normalize, width} from '../../constant/index.js';
import Icons from 'react-native-vector-icons/dist/MaterialIcons.js';
import {baseURL} from '../../utils/Api.js';
import {useNavigation} from '@react-navigation/native';

const GridFlatAds = ({data, deleteAds, editDelete}) => {
  const navigation = useNavigation();
  let imageUri;
  if (data?.ads_image[0]?.image.includes(baseURL?.replace('/api', ''))) {
    imageUri = data?.ads_image[0]?.image;
  } else {
    imageUri = `${baseURL?.replace('/api', data?.ads_image[0]?.image)}`;
  }
  return (
    <TouchableOpacity
      style={[styles.container, SHADOWS.medium]}
      onPress={() => navigation.navigate('ShowAdsDetails', {data})}>
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
      {editDelete && (
        <View
          style={[
            {
              flexDirection: 'row',
              alignSelf: 'center',
              position: 'absolute',
              top: height * 0.18,
            },
            SHADOWS.medium,
          ]}>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.secondary,
              borderRadius: 30,
              padding: 8,
              marginHorizontal: 20,
            }}
            onPress={() => navigation.navigate('EditAdDetails', {data: data})}>
            <Icons name="edit" size={width * 0.07} color={COLORS.black} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.secondary,
              borderRadius: 30,
              padding: 8,
              marginHorizontal: 20,
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
      <View style={styles.bottomView}>
        <Text style={styles.titleText} numberOfLines={1}>
          {data?.ad_title}
        </Text>
        <View style={styles.category_locationContainer}>
          {/* icon */}
          <Image source={icons.tag} style={styles.miniIcon} />
          <Text style={styles.text} numberOfLines={1}>
            Sub-Category
          </Text>
        </View>
        <View style={styles.category_locationContainer}>
          {/* icon */}
          <Image source={icons.location} style={styles.miniIcon} />
          <Text style={styles.text} numberOfLines={1}>
            Location
          </Text>
        </View>
        <View style={styles.category_locationContainer}>
          <Image source={icons.time} style={styles.miniIcon} />
          <Text style={styles.text} numberOfLines={1}>
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
        <View style={styles.category_locationContainer}>
          <Image source={icons.rupee} style={styles.miniIcon} />
          <Text style={styles.priceText} numberOfLines={1}>
            ₹ {data?.price}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(GridFlatAds);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightWhite,
    borderRadius: 5,
    maxWidth: width * 0.49,
    height: (height * 0.41) / 0.95,
    alignSelf: 'center',
    padding: 5,
    margin: 5,
  },
  image_soldOutView: {
    overflow: 'hidden',
    width: width * 0.45,
    position: 'relative',
    borderRadius: 10,
  },
  image: {
    resizeMode: 'cover',
    backgroundColor: COLORS.gray2,
    width: width * 0.45,
    height: height * 0.2,
  },
  bottomView: {
    flex: 1,
    marginTop: height * 0.045,
    marginLeft: 5,
  },
  sold_outView: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    position: 'absolute',
    top: height * 0.029,
    right: -width * 0.08,
    zIndex: 1,
    justifyContent: 'flex-end',
    width: width * 0.3,
    flexShrink: 1,
    transform: [{rotate: '45deg'}],
  },
  sold_outText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: normalize(10),
  },
  titleText: {
    fontSize: normalize(FONTSIZE.xxSmall),
    color: COLORS.black,
    fontWeight: 'bold',
    width: width * 0.4,
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
    fontSize: normalize(FONTSIZE.xxSmall),
  },
  priceText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: normalize(FONTSIZE.xxSmall),
    // marginLeft: 5,
  },
});
