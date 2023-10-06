import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  InputAccessoryView,
  ScrollView,
  Animated,
  FlatList,
  Dimensions,
} from 'react-native';
import {COLORS, FONTSIZE, SHADOWS} from '../../../../constant/theme.js';
import GobackHeader from '../../../../components/GobackHeader.jsx';
import {height, normalize, width} from '../../../../constant/index.js';

import {useRoute} from '@react-navigation/native';
import Button from '../../../../components/Button/Button.jsx';

const Membership = () => {
  const {
    params: {userInfo},
  } = useRoute();

  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const scrollX = useRef(new Animated.Value(0)).current;
  const onViewRef = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });
  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});

  const renderItem = ({item, idx}) => {
    return (
      <View style={[styles.flatItemContainer]}>
        <View style={[styles.flatItemView, SHADOWS.medium]}>
          <Text style={[styles.flatItemText, {fontSize: normalize(40)}]}>
            {`${item?.ads_plan?.name}${
              item?.count > 1 ? ' x ' + item?.count : ''
            }`}
          </Text>
          <Text
            style={[
              styles.flatItemText,
              {fontSize: normalize(FONTSIZE.medium)},
            ]}>
            {item?.ads_plan?.ads_number_restriction} Regular Ads
          </Text>
          <View
            style={{
              marginVertical: 30,
              // backgroundColor: COLORS.lightBlue,
              width: width * 0.85,
              alignItems: 'center',
            }}>
            <Text style={[styles.flatItemText, {fontSize: normalize(35)}]}>
              ₹{item?.ads_plan?.price}
            </Text>
            <Text
              style={[
                styles.flatItemText,

                {
                  fontSize: normalize(FONTSIZE.xxSmall),
                  textAlign: 'center',
                },
              ]}>
              Per Month
            </Text>
          </View>
          <View
            style={{
              marginHorizontal: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={[
                styles.flatItemText,
                {
                  fontSize: normalize(FONTSIZE.xLarge),
                  marginBottom: 10,
                },
              ]}>
              {item?.ads_plan?.description}
            </Text>
          </View>
          <View
            style={{
              // backgroundColor: COLORS.lightBlue,
              width: width * 0.85,
              alignItems: 'center',
            }}>
            <Button
              text={'Active'}
              style={[styles.btn]}
              textStyle={styles.btnText}
              // onPress={() => onPayment(item?.ads_plan?.id)}
              // disable={true}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <GobackHeader bg title="Your Membership" />

      <View
        style={{
          // flex: 1,
          alignItems: 'center',
          // justifyContent: 'center',
        }}>
        <Text
          style={{
            fontSize: normalize(FONTSIZE.medium),
            color: COLORS.black,
            fontWeight: '700',
            marginTop: 50,
          }}>
          ACTIVE PLANS
        </Text>
        <Text
          style={{
            fontSize: normalize(FONTSIZE.xxSmall),
            color: COLORS.black,
            fontWeight: '700',
          }}>
          Remaining Monthly Credits : {`${userInfo?.remaining_credits}`}
        </Text>

        <FlatList
          style={{marginTop: 50}}
          ref={flatListRef}
          data={userInfo?.user_ads_plans?.reduce((acc, curr) => {
            const existingPlan = acc.find(
              plan => plan.ads_plan.id === curr.ads_plan.id,
            );

            if (existingPlan) {
              existingPlan.count++;
            } else {
              acc.push({
                ...curr,
                count: 1,
              });
            }
            return acc;
          }, [])}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          // onScroll={handleScroll}
          snapToInterval={Dimensions.get('window').width}
          snapToAlignment="start"
          decelerationRate="fast"
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: false},
          )}
        />
        <View style={styles.indicatorContainer}>
          {userInfo?.user_ads_plans
            ?.reduce((acc, curr) => {
              const existingPlan = acc.find(
                plan => plan.ads_plan.id === curr.ads_plan.id,
              );

              if (existingPlan) {
                existingPlan.count++;
              } else {
                acc.push({
                  ...curr,
                  count: 1,
                });
              }
              return acc;
            }, [])
            .map((_, index) => {
              const indicatorStyle =
                index === currentIndex
                  ? styles.activeIndicator
                  : styles.inactiveIndicator;
              return (
                <Animated.View
                  key={index}
                  style={[styles.indicator, indicatorStyle]}
                />
              );
            })}
        </View>

        {/* {userInfo?.user_ads_plans
          ?.reduce((acc, curr) => {
            const existingPlan = acc.find(
              plan => plan.ads_plan.id === curr.ads_plan.id,
            );

            if (existingPlan) {
              existingPlan.count++;
            } else {
              acc.push({
                ...curr,
                count: 1,
              });
            }
            return acc;
          }, [])
          .map(({ads_plan, count}, i) => {
            return (
              <View
                key={i}
                style={{
                  alignItems: 'center',
                  marginVertical: 10,
                  backgroundColor: COLORS.primary,
                  width: width * 0.8,
                  borderRadius: 10,
                  padding: 10,
                }}>
                <Text
                  style={{
                    fontSize: normalize(FONTSIZE.xxSmall),
                    color: COLORS.white,
                    fontWeight: '700',
                    marginVertical: 3,
                  }}>{`${ads_plan?.name}${
                  count > 1 ? ' x ' + count : ''
                }`}</Text>
                <Text
                  style={{
                    fontSize: normalize(FONTSIZE.xxSmall),
                    color: COLORS.white,
                    fontWeight: '700',
                    marginVertical: 3,
                  }}>
                  {ads_plan?.description || '-'}
                </Text>
                <Text
                  style={{
                    fontSize: normalize(FONTSIZE.xxSmall),
                    color: COLORS.white,
                    fontWeight: '700',
                    marginVertical: 3,
                  }}>
                  Number of ads you can post:
                  {ads_plan?.ads_number_restriction || '-'}
                </Text>
              </View>
            );
          })} */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  flatItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    // ...SHADOWS.medium,
  },
  image: {
    width: 50,
    // height: 200,
    // resizeMode: 'cover',
    borderRadius: 8,
  },
  flatItemView: {
    width: width * 0.75,
    marginHorizontal: 30,
    backgroundColor: COLORS.primary,
    height: 400,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatItemText: {color: COLORS.white, fontWeight: '700'},
  btn: {
    backgroundColor: COLORS.secondary,
    width: width * 0.3,
    height: height * 0.045,
    marginVertical: 15,
    borderRadius: 25,
  },
  btnText: {},
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: 'gray',
  },
  activeIndicator: {
    backgroundColor: 'blue',
  },
  inactiveIndicator: {
    backgroundColor: 'lightgray',
  },
});

export default Membership;
