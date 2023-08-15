import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, FONTSIZE} from '../../constant/theme.js';
import {height, icons, normalize, width} from '../../constant/index.js';
import OTPTextView from 'react-native-otp-textinput';
import Button from '../Button/Button.jsx';
import Input from '../Inputs/Input.jsx';
import {isConnectedToInternet, isValid} from '../../utils/supportFunctions.js';
import {requestOtp, verifyOtp} from '../../utils/customHook/backEndCalls.js';
import Loader from '../Loader/Loader.jsx';
import ToastManager, {Toast} from 'toastify-react-native';

const PhoneOtpModal = ({
  visible,
  isVisibleOTPView = false,
  onModalClose,
  verifyOTP,
  handleOTPvalueChange,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [optView, setOtpView] = useState(isVisibleOTPView);
  const [loading, setLoading] = useState(false);
  const [optValue, setOtpValue] = useState('');
  const [errors, setErrors] = useState({});
  const [clock, setClock] = useState(50);

  useEffect(() => {
    if (optView) {
      startTimer();
    }
  }, [optView]);

  // OTP Timer
  const startTimer = () => {
    setClock(50);
    const newInterval = setInterval(() => {
      setClock(prev => {
        if (prev === 0) {
          clearInterval(newInterval);
          return prev;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const onSendOTP = async () => {
    try {
      let obj = {
        phoneNumber: isValid('Phone number', phoneNumber, 'phonenumber'),
      };
      if (Object.values(obj).filter(e => e !== '').length > 0)
        return setErrors(obj);
      setErrors({});

      if (await isConnectedToInternet()) {
        const response = await requestOtp({phone: phoneNumber});
        setLoading(true);
        if (response?.success) {
          Toast.success('You will receive OTP on phone call');
          setOtpView(true);
          startTimer();
        } else {
          Toast.error(response?.res);
        }
        setLoading(false);
      }
    } catch (err) {
      Toast.error('Failed to send OTP!');
    }
  };

  return (
    <Modal visible={visible} transparent>
      <ToastManager />
      <Loader visible={loading} />
      <View style={styles.container}>
        <View style={styles.alert}>
          <Text
            style={{
              color: COLORS.black,
              fontWeight: '700',
              textAlign: 'center',
              fontSize: normalize(FONTSIZE.medium),
            }}>
            Enter OTP
          </Text>
          <OTPTextView
            tintColor={COLORS.primary}
            offTintColor={COLORS.secondary}
            containerStyle={styles.textInputContainer}
            textInputStyle={styles.otpTextInputStyle}
            handleTextChange={text =>
              handleOTPvalueChange(text.replace(/[^0-9]/, ''), phoneNumber)
            }
            inputCount={6}
            keyboardType="numeric"
          />
          <Button
            text={'Submit'}
            style={styles.otpSubmitButton}
            onPress={verifyOTP}
          />

          <Text style={{color: 'black', alignSelf: 'center'}}>
            {clock} second/s
          </Text>

          <TouchableOpacity
            onPress={onSendOTP}
            // disabled={clock === 0 ? false : true}
          >
            <Text
              style={{
                color: clock === 0 ? COLORS.black : COLORS.gray,
                fontWeight: '700',
                textAlign: 'center',
              }}>
              Resend OTP
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(PhoneOtpModal);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alert: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 5,
    width: '90%',
  },
  textInputContainer: {
    // width: 20,
    // backgroundColor: 'red',
  },
  otpSubmitButton: {
    width: width * 0.35,
    alignSelf: 'center',
    margin: 5,
  },
  otpTextInputStyle: {
    fontSize: normalize(FONTSIZE.medium),
    width: 35,
  },
  phoneInputStyle: {
    // backgroundColor: 'red',
    // width: width * 0.2,
  },
});
