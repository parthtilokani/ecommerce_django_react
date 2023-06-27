import React, {useState} from 'react';
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
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
import CustomAlert from '../../components/CustomAlert/CustomAlert.jsx';
import {isValid} from '../../utils/supportFunctions.js';
import {signUP} from '../../utils/customHook/backEndCalls.js';
import Loader from '../../components/Loader/Loader.jsx';
import {forceTouchGestureHandlerProps} from 'react-native-gesture-handler/lib/typescript/handlers/ForceTouchGestureHandler.js';

const SignUp = ({navigation}) => {
  const [formDetails, setFormDetails] = useState({
    name: '',
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
    date: new Date(),
    dob: '',
    gender: '',
  });
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
      email: isValid('Email', formDetails.email, 'email'),
      phoneNumber: isValid(
        'Phone number',
        formDetails.phoneNumber,
        'phonenumber',
      ),
      password: isValid('Password', formDetails.password, 'password'),
    };
    if (Object.values(obj).filter(e => e !== '').length > 0)
      return setErrors(obj);
    setErrors({});

    const data = {
      name: formDetails.name,
      username: formDetails.userName,
      email: formDetails.email,
      phonenumber: formDetails.phoneNumber,
      password: formDetails.password,
      dob: formDetails.dob,
      gender: formDetails.gender,
    };
    setLoading(true);
    const res = await signUP(data);
    setLoading(false);

    if (res) return navigation.replace('SignIn');

    // setOtpModalVisible(true);
  };

  const onOTPSubmitBtnPress = () => {
    setOtpModalVisible(false);
    navigation.navigate('SignIn');
  };

  const onChange = (event, selectedDate) => {
    setShow(false);
    const formattedDate = new Date(selectedDate).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
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
          marginVertical: height * 0.05,
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
                placeholder={'Name'}
                value={formDetails.name}
                onChangeText={text => handleInputChange('name', text)}
                leftIcon={icons.user}
                style={styles.input}
              />
              <Input
                id={'userName'}
                errors={errors}
                placeholder={'Username'}
                value={formDetails.userName}
                onChangeText={text => handleInputChange('userName', text)}
                leftIcon={icons.user}
                style={styles.input}
              />
              <Input
                id={'email'}
                errors={errors}
                placeholder={'Email'}
                value={formDetails.email}
                onChangeText={text => handleInputChange('email', text)}
                leftIcon={icons.email}
                style={styles.input}
              />
              <Input
                id={'phoneNumber'}
                errors={errors}
                placeholder={'Phone Number'}
                value={formDetails.phoneNumber}
                onChangeText={text => handleInputChange('phoneNumber', text)}
                leftIcon={icons.phone}
                style={styles.input}
                maxLength={10}
                keyboardType={'phone-pad'}
              />
              <Input
                id={'password'}
                errors={errors}
                placeholder={'Password'}
                value={formDetails.password}
                onChangeText={text => handleInputChange('password', text)}
                leftIcon={icons.lock}
                isPassword={true}
                style={styles.input}
              />
              <Input
                id={'dob'}
                errors={errors}
                placeholder={'Date of Birth'}
                value={formDetails.dob.toString()}
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
                }}>
                <Text style={{color: COLORS.black}}>Gender(Optional):</Text>
                <RadioButton.Android
                  value="Male"
                  status={checked === 'Male' ? 'checked' : 'unchecked'}
                  onPress={() => setChecked('Male')}
                />
                <Text style={{color: COLORS.black}}>Male</Text>
                <RadioButton.Android
                  value="Female"
                  status={checked === 'Female' ? 'checked' : 'unchecked'}
                  onPress={() => setChecked('Female')}
                />
                <Text style={{color: COLORS.black}}>Female</Text>
                <RadioButton.Android
                  value="Other"
                  status={checked === 'Other' ? 'checked' : 'unchecked'}
                  onPress={() => setChecked('Other')}
                />
                <Text>Other</Text>
              </View>
            </View>
          </KeyboardAvoidingWrapper>
          <View style={styles.checkboxView}>
            <CheckboxComponent
              checkboxValue={checkboxValue}
              setCheckboxValue={onCheckboxChange}
              text={'I have read and agree to the website Terms and Conditions'}
              // secondTxt={' Terms and Conditions'}
            />
          </View>

          <CustomAlert
            visible={otpModalVisible}
            isOtpModal
            onOkPress={onOTPSubmitBtnPress}
          />

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
            <Text style={{color: COLORS.gray}}>Already have an account? </Text>
            <Text
              style={{color: COLORS.primary}}
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
    // marginBottom: 10,
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
});
