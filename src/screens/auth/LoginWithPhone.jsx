import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import GobackHeader from '../../components/GobackHeader';
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';
import {
  COLORS,
  FONTSIZE,
  appName,
  height,
  icons,
  normalize,
  width,
} from '../../constant';
import Input from '../../components/Inputs/Input';
import Button from '../../components/Button/Button';
import {
  requestOtp,
  signIN,
  verifyOtp,
} from '../../utils/customHook/backEndCalls.js';
import {isConnectedToInternet, isValid} from '../../utils/supportFunctions.js';
import Loader from '../../components/Loader/Loader.jsx';
import useAuth from '../../hooks/useAuth.js';
import PhoneOtpModal from '../../components/PhoneOtpModal/PhoneOtpModal.jsx';
import ToastManager, {Toast} from 'toastify-react-native';

const LoginWithPhone = ({navigation}) => {
  const [formDetails, setFormDetails] = useState({
    phoneNumber: '',
    otpValue: '',
    btnText: 'Send OTP',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [phoneOtpModal, setPhoneOtpModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpSentOnce, setOtpSentOnce] = useState(false);
  const [clock, setClock] = useState(60);
  const {setAuth} = useAuth();

  const handleInputChange = (field, value) => {
    setFormDetails(prevState => ({...prevState, [field]: value}));
  };

  const onSendOTP = async () => {
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
    const data = {phone: formDetails.phoneNumber};
    const response = await requestOtp(data);
    setLoading(false);
    if (response?.success) {
      Toast.success('OTP sent. You will receive SMS or Call.');
      setPhoneOtpModal(true);
      setFormDetails(prev => ({...prev, btnText: 'Verify OTP'}));
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
    } else {
      setLoading(false);
      Toast.error(response?.res);
    }
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
    const data = {
      phone_no: formDetails.phoneNumber,
      otp: formDetails?.otpValue,
    };
    setLoading(true);
    const response = await verifyOtp(data, 'token/withotp');
    setLoading(false);
    if (response?.success) {
      setAuth(response?.res);
      Toast.success('Login sucessful!');
      setTimeout(() => {
        return navigation.replace('Drawer');
      }, 3000);
    } else {
      Toast.error('OTP verify unsuccessful');
    }
  };
  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={{flex: 1}}>
        <Loader visible={loading} />
        <ToastManager style={{width: width * 0.9, height: height * 0.1}} />
        <GobackHeader navigation={navigation} />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: height - 120,
          }}>
          <View>
            <View style={styles.mainContainer}>
              <Text style={styles.logo}>{appName}</Text>
              <Text style={styles.pageName}>Sign In with Phone Number</Text>
            </View>

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
                  onPress={onSendOTP}
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
                    onSendOTP();
                  } else {
                    onVerifyOTP();
                  }
                }}
              />
            </View>

            {/* Login Optional View */}

            {/* <PhoneOtpModal
              visible={phoneOtpModal}
              onModalClose={() => setPhoneOtpModal(false)}
              verifyOTP={verifyOTP}
              handleOTPvalueChange={(text, phoneNumber) => {
                setFormDetails(prevState => ({
                  ...prevState,
                  phoneNumber: phoneNumber,
                }));
                setOtpValue(text);
              }}
            /> */}
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
};

export default LoginWithPhone;

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
