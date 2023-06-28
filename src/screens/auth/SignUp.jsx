import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
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
import CheckboxComponent from '../../components/Checkbox/Checkbox';
import {isConnectedToInternet, isValid} from '../../utils/supportFunctions.js';
import {
  requestOtp,
  signUP,
  verifyOtp,
} from '../../utils/customHook/backEndCalls.js';
import Loader from '../../components/Loader/Loader.jsx';
import OTPTextView from 'react-native-otp-textinput';

const SignUp = ({navigation}) => {
  const [formDetails, setFormDetails] = useState({
    name: '',
    userName: '',
    email: '',
    areaCode: '',
    phoneNumber: '',
    password: '',
    c_password: '',
    date: new Date(),
    dob: undefined,
    gender: '',
  });
  const [clock, setClock] = useState(50);
  const [optValue, setOtpValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState('first');
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormDetails(prevState => ({...prevState, [field]: value}));
  };

  const onCheckboxChange = () => {
    setCheckboxValue(!checkboxValue);
  };

  const onSignUp = async () => {
    let obj = {
      name: isValid('Name', formDetails.name, 'name'),
      userName: isValid('Username', formDetails.userName, 'username'),
      email: isValid('Email', formDetails.email, 'email'),
      areaCode: isValid('Area code', formDetails.areaCode),
      phoneNumber: isValid(
        'Phone number',
        formDetails.phoneNumber,
        'phonenumber',
      ),
      password: isValid('Password', formDetails.password, 'password'),
      c_password: isValid(
        'Confirm Password',
        formDetails.c_password,
        'c_password',
      ),
    };
    if (!obj?.c_password)
      obj.c_password =
        formDetails.password !== formDetails.c_password
          ? "Password doen't match"
          : '';
    if (Object.values(obj).filter(e => e !== '').length > 0)
      return setErrors(obj);
    setErrors({});

    const data = {
      name: formDetails.name,
      username: formDetails.userName,
      email: formDetails.email,
      phone_no: formDetails.phoneNumber,
      area_code: formDetails?.areaCode || '91',
      password: formDetails.password,
      gender: formDetails.gender,
      dob: formDetails.dob,
    };
    if (await isConnectedToInternet()) {
      setLoading(true);
      const res = await signUP(data);
      if (res) {
        Alert.alert(
          'ALERT!',
          'Sign Up sucessful! \nOPT has been sent to your phone number.',
          [
            {
              text: 'OK',
              onPress: () => {
                otpRequest();
                setOtpModalVisible(true);
              },
            },
          ],
        );
      }
      setLoading(false);
    }
  };

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

  // OTP Request
  const otpRequest = async () => {
    const data = {phone: formDetails.phoneNumber};
    const res = await requestOtp(data);
    startTimer();
    setOtpValue(res);
  };

  // Resend OTP
  const resendOtpRequest = async () => {
    const data = {phone: formDetails.phoneNumber};
    setLoading(true);
    const res = await requestOtp(data);
    setLoading(false);
    setOtpValue(res);
  };

  const verifyOTP = async () => {
    const data = {phone: formDetails.phoneNumber, otp: optValue};
    setLoading(true);
    const res = await verifyOtp(data);
    setLoading(false);
    if (res) {
      setOtpModalVisible(false);
      Alert.alert('ALERT!', 'OTP verify sucessful! \nSignIn to continue.', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('SignIn');
          },
        },
      ]);
    }
  };

  const onChangeCountry = country => {
    console.log(country?.callingCode);
    setFormDetails(prevState => ({
      ...prevState,
      areaCode: country?.callingCode,
    }));
  };

  const onChange = (event, selectedDate) => {
    setShow(false);
    const formattedDate = new Date(selectedDate).toISOString().slice(0, 10);

    setFormDetails(prevState => ({
      ...prevState,
      dob: formattedDate,
    }));
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Loader visible={loading} />
      <GobackHeader navigation={navigation} />
      <ScrollView
        style={{
          flex: 1,
          height: height,
        }}
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View>
          <View style={styles.mainContainer}>
            <Text style={styles.logo}>{appName}</Text>
            <Text style={styles.pageName}>Sign Up</Text>
          </View>

          {/* TextInput View */}
          <KeyboardAvoidingWrapper>
            <View
              style={{
                alignItems: 'center',
              }}>
              <Input
                id={'name'}
                errors={errors}
                placeholder={'Name*'}
                value={formDetails.name}
                onChangeText={text => handleInputChange('name', text)}
                leftIcon={icons.user}
                style={styles.input}
              />
              <Input
                id={'userName'}
                errors={errors}
                placeholder={'Username*'}
                value={formDetails.userName}
                onChangeText={text => handleInputChange('userName', text)}
                leftIcon={icons.user}
                style={styles.input}
              />
              <Input
                id={'email'}
                errors={errors}
                placeholder={'Email*'}
                value={formDetails.email}
                onChangeText={text => handleInputChange('email', text)}
                leftIcon={icons.email}
                style={styles.input}
              />

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
              <Input
                id={'password'}
                errors={errors}
                placeholder={'Password*'}
                value={formDetails.password}
                onChangeText={text => handleInputChange('password', text)}
                leftIcon={icons.lock}
                isPassword={true}
                style={styles.input}
              />
              <Input
                id={'c_password'}
                errors={errors}
                placeholder={'Confirm Password*'}
                value={formDetails.c_password}
                onChangeText={text => handleInputChange('c_password', text)}
                leftIcon={icons.lock}
                isPassword={true}
                style={styles.input}
              />
              <Input
                id={'dob'}
                errors={errors}
                placeholder={'Date of Birth (Optional)'}
                value={formDetails.dob?.toString()}
                onChangeText={() => setShow(true)}
                leftIcon={icons.calendar}
                style={styles.input}
                onFocus={() => {
                  setShow(true);
                  Keyboard.dismiss();
                }}
                showSoftInputOnFocus={false}
              />

              {show && (
                <DateTimePicker
                  display="default"
                  value={formDetails.date}
                  mode={'date'}
                  onChange={onChange}
                  themeVariant="light"
                  maximumDate={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 18),
                    )
                  }
                />
              )}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 5,
                }}>
                <Text
                  style={{
                    color: COLORS.black,
                    fontSize: normalize(FONTSIZE.small),
                  }}>
                  Gender(Optional):
                </Text>
                <RadioButton.Android
                  value="Male"
                  status={checked === 'Male' ? 'checked' : 'unchecked'}
                  onPress={() => setChecked('Male')}
                />
                <Text
                  style={{
                    color: COLORS.black,
                    fontSize: normalize(FONTSIZE.small),
                  }}>
                  Male
                </Text>
                <RadioButton.Android
                  value="Female"
                  status={checked === 'Female' ? 'checked' : 'unchecked'}
                  onPress={() => setChecked('Female')}
                />
                <Text
                  style={{
                    color: COLORS.black,
                    fontSize: normalize(FONTSIZE.small),
                  }}>
                  Female
                </Text>
                <RadioButton.Android
                  value="Other"
                  status={checked === 'Other' ? 'checked' : 'unchecked'}
                  onPress={() => setChecked('Other')}
                />
                <Text
                  style={{
                    color: COLORS.black,
                    fontSize: normalize(FONTSIZE.small),
                  }}>
                  Other
                </Text>
              </View>
            </View>
          </KeyboardAvoidingWrapper>
          <View style={styles.checkboxView}>
            <CheckboxComponent
              checkboxValue={checkboxValue}
              setCheckboxValue={onCheckboxChange}
              text={'I have read and agree to the website Terms and Conditions'}
            />
          </View>

          {/* OPT Modal */}
          <Modal visible={otpModalVisible} transparent>
            <View style={styles.container}>
              <View style={styles.alert}>
                <Text
                  style={{
                    color: COLORS.black,
                    fontWeight: '700',
                    textAlign: 'center',
                    fontSize: normalize(FONTSIZE.medium),
                  }}>
                  Enter OPT
                </Text>
                <Text
                  style={{
                    color: COLORS.black,
                    fontWeight: '700',
                    textAlign: 'center',
                    fontSize: normalize(FONTSIZE.medium),
                  }}>
                  Temperory OTP: {optValue}
                </Text>

                <OTPTextView
                  tintColor={COLORS.primary}
                  offTintColor={COLORS.secondary}
                  containerStyle={styles.textInputContainer}
                  textInputStyle={styles.otpTextInputStyle}
                  defaultValue={optValue}
                  // handleTextChange={text => setOtpValue(text)}
                  inputCount={6}
                  keyboardType="numeric"
                  autoFocus={true}
                />
                <Button
                  text={'Verify'}
                  disable={optValue.length == 6 ? false : true}
                  style={styles.otpSubmitButton}
                  onPress={verifyOTP}
                />

                <Text style={{color: 'black', alignSelf: 'center'}}>
                  {clock} second/s
                </Text>
                <TouchableOpacity
                  disabled={clock == 0 ? false : true}
                  onPress={resendOtpRequest}>
                  <Text
                    style={{
                      color: clock == 0 ? COLORS.black : COLORS.gray,
                      fontWeight: '700',
                      textAlign: 'center',
                    }}>
                    Resend OPT
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {/* OPT Modal */}

          <Button
            text={'Sign Up'}
            style={[
              styles.signInbtn,
              {
                backgroundColor: !checkboxValue ? COLORS.gray : COLORS.primary,
              },
            ]}
            disable={!checkboxValue}
            onPress={onSignUp}
          />

          {/* Create account view */}
          <View style={styles.createAccountView}>
            <Text
              style={{
                color: COLORS.gray,
                fontSize: normalize(FONTSIZE.small),
              }}>
              Already have an account?{' '}
            </Text>
            <Text
              style={{
                color: COLORS.primary,
                fontSize: normalize(FONTSIZE.small),
              }}
              onPress={() => navigation.navigate('SignIn')}>
              Sign In
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

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
  },
  pageName: {
    fontSize: normalize(FONTSIZE.large),
    fontWeight: '500',
    color: COLORS.black,
  },
  input: {
    height: height * 0.0634,
    marginVertical: 5,
  },
  signInbtn: {
    marginVertical: 5,
    alignSelf: 'center',
  },
  checkboxView: {
    margin: 10,
    flexShrink: 1,
  },

  createAccountView: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: height * 0.02,
    marginBottom: height * 0.07,
  },

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
    width: '80%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: normalize(FONTSIZE.xxSmall),
    fontWeight: 'bold',
    color: COLORS.black,
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
});
