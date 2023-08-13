import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {COLORS, FONTSIZE, SHADOWS} from '../../../../constant/theme.js';
import GobackHeader from '../../../../components/GobackHeader.jsx';
import {height, normalize, width} from '../../../../constant/index.js';
import Button from '../../../../components/Button/Button.jsx';

const Membership = () => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = event => {
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffset / viewSize);
    setCurrentIndex(index);
  };

  const renderItem = ({item, idx}) => {
    return (
      <View style={[styles.flatItemContainer]}>
        <View style={[styles.flatItemView, SHADOWS.medium]}>
          <Text style={[styles.flatItemText, {fontSize: normalize(45)}]}>
            Free
          </Text>
          <Text
            style={[
              styles.flatItemText,
              {fontSize: normalize(FONTSIZE.xxSmall)},
            ]}>
            Get the party Started
          </Text>
          <View style={{marginVertical: 30}}>
            <Text style={[styles.flatItemText, {fontSize: normalize(50)}]}>
              $0
            </Text>
            <Text
              style={[
                styles.flatItemText,
                {fontSize: normalize(FONTSIZE.xxSmall)},
              ]}>
              Per Month
            </Text>
          </View>
          <View style={{marginHorizontal: 30}}>
            <Text
              style={[
                styles.flatItemText,
                {fontSize: normalize(FONTSIZE.small)},
              ]}>
              3 Regular Ads, No Featured Ads, No Top Ads, No Ads will be bumped
              up, Limited Support
            </Text>
          </View>

          <Button
            text="Get Started"
            style={styles.btn}
            textStyle={styles.btnText}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <GobackHeader bg title="Your Membership" />
      <FlatList
        ref={flatListRef}
        data={new Array(3)}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBlue,
  },
  flatItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  image: {
    width: 50,
    height: 200,
    // resizeMode: 'cover',
    borderRadius: 8,
  },
  flatItemView: {
    width: width * 0.9,
    backgroundColor: COLORS.primary,
    height: 450,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatItemText: {color: COLORS.white, fontWeight: '700'},
  btn: {
    backgroundColor: COLORS.secondary,
    width: width * 0.3,
    height: height * 0.065,
    marginVertical: 15,
    borderRadius: 25,
  },
  btnText: {},
});

export default Membership;
