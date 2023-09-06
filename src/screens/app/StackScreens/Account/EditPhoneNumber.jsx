import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import GobackHeader from '../../../../components/GobackHeader.jsx';
import {
  COLORS,
  FONTSIZE,
  normalize,
  width,
  height,
  icons,
} from '../../../../constant/index.js';
import {isValid} from '../../../../utils/supportFunctions.js';
import useAuth from '../../../../hooks/useAuth.js';
import {
  requestOtp,
  verifyOtp,
} from '../../../../utils/customHook/backEndCalls.js';
import Input from '../../../../components/Inputs/Input.jsx';
import Button from '../../../../components/Button/Button.jsx';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate.js';
import ToastManager, {Toast} from 'toastify-react-native';
import {useNavigation} from '@react-navigation/native';
import Loader from '../../../../components/Loader/Loader.jsx';

const EditPhoneNumber = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigation = useNavigation();
  const [formDetails, setFormDetails] = useState({
    phoneNumber: '',
    otpValue: '',
    btnText: 'Send OTP',
  });
  const [errors, setErrors] = useState({});
  const [phoneOtpModal, setPhoneOtpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpSentOnce, setOtpSentOnce] = useState(false);
  const [clock, setClock] = useState(60);
  const {setAuth} = useAuth();

  const handleInputChange = (field, value) => {
    setFormDetails(prevState => ({...prevState, [field]: value}));
  };
  const onGetOTP = async () => {
    let obj = {
      phoneNumber: isValid(
        'Phone number',
        formDetails.phoneNumber,
        'phonenumber',
      ),
    };
    if (Object.values(obj).filter(e => e !== '').length > 0)
      return setErrors(obj);
    setErrors({});
    setLoading(true);
    axiosPrivate
      .get('/user/user/get_otp_to_change_contact', {
        params: {phone: formDetails?.phoneNumber},
      })
      .then(res => {
        setLoading(false);
        Toast.success('OTP sent. You will receive SMS or Call.');
        setFormDetails(prev => ({...prev, btnText: 'Verify OTP'}));
        setPhoneOtpModal(true);
        setOtpSent(true);
        setOtpSentOnce(true);
        setClock(60);
        const newInterval = setInterval(() => {
          setClock(prev => {
            if (prev === 0) {
              setErrors({});
              clearInterval(newInterval);
              return prev;
            }
            return prev - 1;
          });
        }, 1000);
      })
      .catch(err => {
        setLoading(false);
        if (!err?.response) return Toast.error('No internet connection!');

        console.log(err.response);
        if (typeof err.response?.data?.error === 'string')
          Toast.error(err?.response?.data?.error);
        else Toast.error('Something went wrong!');
      })
      .finally(() => setLoading(false));
  };

  const onChangeCountry = country => {
    setFormDetails(prevState => ({
      ...prevState,
      areaCode: country?.callingCode,
    }));
  };

  const onVerifyOTP = async () => {
    if (formDetails?.otpValue.length < 6) {
      return setErrors(prev => ({...prev, otpValue: 'Please enter OTP'}));
    }
    setLoading(true);
    axiosPrivate
      .post('/user/user/change_user_contact', {
        otp: formDetails?.otpValue,
        phone_no: formDetails?.phoneNumber,
      })
      .then(res => {
        setLoading(false);
        Toast.success('Phone no. changed successfully.');
        setTimeout(() => {
          navigation.replace('Main', {tab: 4});
        }, 3000);
      })
      .catch(err => {
        console.log(err?.response);
        setLoading(false);
        if (!err?.response) return Toast.error('No internet connection!');
        const {phone_no, detail, Details, error} = err?.response?.data;
        Toast.error(
          phone_no && phone_no?.length > 0
            ? phone_no[0]
            : detail || Details || error,
        );
      })
      .finally(() => setLoading(false));
    // setLoading(true);
    // const response = await verifyOtp(data, 'token/withotp');
    // setLoading(false);
    // if (response?.success) {
    //   setAuth(response?.res);
    //   Toast.success('Login sucessful!');
    //   setTimeout(() => {
    //     return navigation.replace('Drawer');
    //   }, 3000);
    // } else {
    //   Toast.error('OTP verify unsuccessful');
    // }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <GobackHeader bg title={'Edit Phone Number'} />
      <Loader visible={loading} />
      <ToastManager style={{width: width * 0.9}} />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          //   height: height - 120,
        }}>
        <View>
          <View
            style={{
              alignItems: 'center',
            }}>
            <Input
              id={'phoneNumber'}
              errors={errors}
              placeholder={'Phone Number*'}
              value={formDetails.phoneNumber}
              onChangeText={text =>
                handleInputChange('phoneNumber', text.replace(/[^0-9]/, ''))
              }
              leftIcon={icons.phone}
              style={styles.input}
              maxLength={10}
              keyboardType={'phone-pad'}
              onChangeCountry={onChangeCountry}
              editable={!otpSent}
            />
            {phoneOtpModal && (
              <Input
                id={'otpValue'}
                errors={errors}
                placeholder={'OTP*'}
                value={formDetails.otpValue}
                onChangeText={text =>
                  handleInputChange('otpValue', text.replace(/[^0-9]/, ''))
                }
                leftIcon={icons.otp}
                style={styles.input}
                keyboardType={'phone-pad'}
              />
            )}
            {otpSent && (
              <Text
                style={{
                  fontSize: normalize(FONTSIZE.xxSmall),
                  color: COLORS.black,
                }}
                onPress={onGetOTP}
                disabled={loading || clock > 0}>
                {clock === 0
                  ? 'Resend OTP'
                  : 'Resend otp in ' + clock + ' second/s.'}
              </Text>
            )}
            <Button
              text={formDetails?.btnText}
              style={styles.signInbtn}
              onPress={() => {
                if (!phoneOtpModal) {
                  onGetOTP();
                } else {
                  onVerifyOTP();
                }
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditPhoneNumber;

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  logo: {
    fontSize: normalize(FONTSIZE.xxLarge),
    fontWeight: 'bold',
    color: COLORS.primary,
    marginVertical: 15,
  },
  pageName: {
    fontSize: normalize(FONTSIZE.medium),
    fontWeight: '500',
    color: COLORS.black,
  },
  input: {
    marginVertical: 10,
  },
  forgotPasswordTxt: {
    fontSize: normalize(FONTSIZE.small),
    color: COLORS.gray,
    margin: 15,
    alignSelf: 'flex-end',
  },
  signInbtn: {
    marginVertical: 15,
  },
  loginOptionalView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  horizontalView: {
    width: width * 0.2,
    height: 0.5,
    backgroundColor: '#000',
    marginHorizontal: 5,
  },
  phoneBtn: {
    width: width * 0.5,
    alignSelf: 'center',
  },
  optionalLoginBtnView: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginVertical: 15,
  },
  optionalLoginBtnText: {
    color: COLORS.black,
  },
  optionalLoginBtn: {
    width: width * 0.4,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  createAccountView: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: height * 0.02,
  },
  createAccText: {
    color: COLORS.primary,
    fontSize: normalize(FONTSIZE.small),
  },
});
