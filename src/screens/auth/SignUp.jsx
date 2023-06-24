import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
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
import CheckboxComponent from '../../components/Checkbox/Checkbox';
import CustomAlert from '../../components/CustomAlert/CustomAlert.jsx';
import {
  isEmptyValue,
  doesNotMatchRegEx,
  isValid,
} from '../../utils/supportFunctions.js';

const SignUp = ({navigation}) => {
  const [formDetails, setFormDetails] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormDetails(prevState => ({...prevState, [field]: value}));
  };

  const onCheckboxChange = () => {
    setCheckboxValue(!checkboxValue);
  };

  const onSignUp = () => {
    let obj = {
      firstName: isValid('First name', formDetails.firstName, 'firstname'),
      lastName: isValid('Last name', formDetails.lastName, 'lastname'),
      userName: isValid('Username', formDetails.userName, 'username'),
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

    // if (
    //   isEmptyValue(formDetails?.firstName, 'Firstname', setErrors) ||
    //   isEmptyValue(formDetails?.lastName, 'Lastname', setErrors) ||
    //   isEmptyValue(formDetails?.userName, 'Username', setErrors) ||
    //   isEmptyValue(formDetails?.email, 'Email', setErrors) ||
    //   isEmptyValue(formDetails?.phoneNumber, 'Phone number', setErrors) ||
    //   isEmptyValue(formDetails?.password, 'Password', setErrors) ||
    //   doesNotMatchRegEx(formDetails?.password, 'Password', setErrors)
    // )
    //   return;

    // setErrors({});
    // setOtpModalVisible(true);
  };

  const onOTPSubmitBtnPress = () => {
    setOtpModalVisible(false);
    navigation.navigate('Drawer', {screen: 'Main'});
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <GobackHeader navigation={navigation} />
      <ScrollView
        style={{
          flex: 1,

          height: height - 100,
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
                // justifyContent: 'center',
                // marginTop: height * 0.05,
              }}
              contentContainerStyle={{alignItems: 'center'}}>
              <Input
                id={'firstName'}
                errors={errors}
                placeholder={'First Name'}
                value={formDetails.firstName}
                onChangeText={text => handleInputChange('firstName', text)}
                leftIcon={icons.user}
                style={styles.input}
              />
              <Input
                id={'lastName'}
                errors={errors}
                placeholder={'Last Name'}
                value={formDetails.lastName}
                onChangeText={text => handleInputChange('lastName', text)}
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
  },
});
