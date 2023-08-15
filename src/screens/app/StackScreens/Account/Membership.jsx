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
import {axiosOpen} from '../../../../utils/axios.js';
import Loader from '../../../../components/Loader/Loader.jsx';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate.js';
import {retrieveUserSession} from '../../../../utils/AsyncStorage/userSession.js';
import {useNavigation, useRoute} from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay';
import ToastManager, {Toast} from 'toastify-react-native';

const Membership = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [plans, setPlans] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScroll = event => {
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffset / viewSize);
    setCurrentIndex(index);
  };

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
    const userToken = await retrieveUserSession('userToken');
    console.log(JSON.stringify(userToken));
    if (!userToken) return navigation.replace('SignIn');
    axiosPrivate
      .post('/ads_plan/pay', {ads_plan_id: plan_id})
      .then(res => {
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
            console.log(`Error: ${error.code} | ${error.description}`);
          });
      })
      .catch(err => console.error(err));
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
        <Loader visible={isLoading} />
        <ToastManager style={{width: width * 0.9}} />
        <View style={[styles.flatItemView, SHADOWS.medium]}>
          <Text style={[styles.flatItemText, {fontSize: normalize(35)}]}>
            {item?.name}
          </Text>
          <Text
            style={[
              styles.flatItemText,
              {fontSize: normalize(FONTSIZE.xxSmall)},
            ]}>
            Ads number : {item?.ads_number_restriction}
          </Text>
          <View style={{marginVertical: 30}}>
            <Text style={[styles.flatItemText, {fontSize: normalize(50)}]}>
              ₹{item?.price}
            </Text>
            <Text
              style={[
                styles.flatItemText,

                {fontSize: normalize(FONTSIZE.xxSmall), textAlign: 'center'},
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
              {item?.description}
            </Text>
          </View>

          <Button
            text="Get Started"
            style={styles.btn}
            textStyle={styles.btnText}
            onPress={() => onPayment(item?.id)}
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
        data={plans}
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
