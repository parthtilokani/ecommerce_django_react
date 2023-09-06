import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Animated,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {axiosOpen} from '../../../../utils/axios.js';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate.js';
import {useNavigation} from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay';
import ToastManager, {Toast} from 'toastify-react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons.js';
import Ionicons from 'react-native-vector-icons/Ionicons.js';
import Button from '../../../../components/Button/Button.jsx';
import Loader from '../../../../components/Loader/Loader.jsx';
import {retrieveUserSession} from '../../../../utils/AsyncStorage/userSession.js';
import {
  COLORS,
  FONTSIZE,
  normalize,
  height,
  width,
  SHADOWS,
} from '../../../../constant/index.js';
import GobackHeader from '../../../../components/GobackHeader.jsx';

const Allplans = () => {
  const axiosPrivate = useAxiosPrivate();

  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [plans, setPlans] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollX = useRef(new Animated.Value(0)).current;
  const onViewRef = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });
  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const data = await axiosOpen.get('/ads_plan/ads_plan/');
      setPlans(data?.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('error while getting plans', error?.response?.data);
    }
  };

  const onPayment = async plan_id => {
    console.log('first');
    const userToken = JSON.parse(await retrieveUserSession('userToken'));
    if (!userToken?.access) return navigation.replace('SignIn');
    setIsLoading(true);
    await axiosPrivate
      .post('/ads_plan/pay', {ads_plan_id: plan_id})
      .then(res => {
        setIsLoading(false);
        console.log(res);
        const options = {
          key: res.data?.api_id,
          amount: res.data?.payment?.amount,
          currency: res?.data?.payment?.currency,
          name: 'Classified Ads',
          description: 'Package and Pricing',
          order_id: res?.data?.payment?.id,
          // handler: function (response) {
          //   onPayment(response);
          // },
          theme: {
            color: '#3399cc',
          },
        };
        RazorpayCheckout.open(options)
          .then(data => {
            // handle success
            // alert(`Success: ${data.razorpay_payment_id}`);
            onPaymentSuccess(data);
          })
          .catch(error => {
            // handle failure
            setIsLoading(false);
            console.log(`Error: ${error.code} | ${error.description}`);
          });
      })
      .catch(err => {
        setIsLoading(false);
        console.error('sdasdsad', err);
      });
  };

  function onPaymentSuccess(response) {
    axiosPrivate
      .post(`/ads_plan/payment/sucess`, {response})
      .then(res => {
        navigation.replace('Main', {payment: true});
      })
      .catch(err => navigation.replace('Main', {payment: false}));
  }

  const renderItem = ({item, idx}) => {
    return (
      <View style={[styles.flatItemContainer]}>
        <View style={[styles.flatItemView, SHADOWS.medium]}>
          <Text style={[styles.flatItemText, {fontSize: normalize(40)}]}>
            {item?.name}
          </Text>
          <Text
            style={[
              styles.flatItemText,
              {fontSize: normalize(FONTSIZE.medium)},
            ]}>
            {item?.ads_number_restriction} Regular Ads
          </Text>
          <View
            style={{
              marginVertical: 30,
              // backgroundColor: COLORS.lightBlue,
              width: width * 0.85,
              alignItems: 'center',
            }}>
            <Text style={[styles.flatItemText, {fontSize: normalize(35)}]}>
              ₹{item?.price}
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
              {item?.description}
            </Text>
          </View>
          <View
            style={{
              // backgroundColor: COLORS.lightBlue,
              width: width * 0.85,
              alignItems: 'center',
            }}>
            <Button
              text={Number(item?.price) === 0.0 ? 'Default' : 'Purchase'}
              style={styles.btn}
              textStyle={styles.btnText}
              onPress={() => onPayment(item?.id)}
              disable={Number(item?.price) === 0.0}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <GobackHeader bg title={'All Plans'} />
      <View style={{height: 600, marginTop: 20}}>
        {isLoading ? (
          <ActivityIndicator
            size={'large'}
            color={COLORS.primary}
            style={{marginTop: 40}}
          />
        ) : (
          <>
            <Text
              style={{
                fontSize: normalize(FONTSIZE.large),
                fontWeight: '700',
                color: COLORS.black,
                alignSelf: 'center',
              }}>
              Choose a Plan
            </Text>
            <FlatList
              ref={flatListRef}
              data={plans}
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
              {plans?.map((_, index) => {
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
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Allplans;

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
