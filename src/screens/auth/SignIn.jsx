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
import {signIN} from '../../utils/customHook/backEndCalls.js';
import {isConnectedToInternet, isValid} from '../../utils/supportFunctions.js';
import Loader from '../../components/Loader/Loader.jsx';

const SignIn = ({navigation}) => {
  const [formDetails, setFormDetails] = useState({email: '', password: ''});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormDetails(prevState => ({...prevState, [field]: value}));
  };

  const onSignin = async () => {
    let obj = {
      email: isValid('Email', formDetails.email, 'email'),
      password: isValid('Password', formDetails.password),
    };
    if (Object.values(obj).filter(e => e !== '').length > 0)
      return setErrors(obj);
    setErrors({});

    const data = {email: formDetails.email, password: formDetails.password};
    if (await isConnectedToInternet()) {
      setLoading(true);
      const res = await signIN(data);
      setLoading(false);
      if (res) return navigation.replace('Drawer');
    }
  };
  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={{flex: 1}}>
        <Loader visible={loading} />
        <GobackHeader resetBack navigation={navigation} />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: height - 100,
          }}>
          <View>
            <View style={styles.mainContainer}>
              <Text style={styles.logo}>{appName}</Text>
              <Text style={styles.pageName}>Sign In</Text>
            </View>

            {/* TextInput View */}
            <View
              style={{
                alignItems: 'center',
              }}>
              <Input
                id={'email'}
                errors={errors}
                placeholder={'Email'}
                value={formDetails.email}
                onChangeText={text => handleInputChange('email', text)}
                leftIcon={icons.user}
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
              <Text
                style={styles.forgotPasswordTxt}
                onPress={() => navigation.navigate('ForgotPassword')}>
                Forgot Password?
              </Text>
              <Button
                text={'Sign In'}
                style={styles.signInbtn}
                onPress={onSignin}
              />
            </View>

            {/* Login Optional View */}

            {/* <View style={styles.loginOptionalView}>
              <View style={styles.horizontalView} />
              <Text
                style={{
                  color: COLORS.gray,
                  fontSize: normalize(FONTSIZE.small),
                }}>
                Or Login With
              </Text>
              <View style={styles.horizontalView} />
            </View> */}

            {/* Login Optional Button View */}
            {/* <View style={styles.optionalLoginBtnView}>
          <Button
            text={'Facebook'}
            icon={icons.facebook}
            style={[styles.optionalLoginBtn, {backgroundColor: '#1976D2'}]}
          />
          <Button
            text={'Google'}
            icon={icons.google}
            textStyle={styles.optionalLoginBtnText}
            style={[styles.optionalLoginBtn, {backgroundColor: 'white'}]}
          />
        </View> */}
            {/* Create account view */}
            <View style={styles.createAccountView}>
              <Text
                style={{
                  color: COLORS.gray,
                  fontSize: normalize(FONTSIZE.small),
                }}>
                Don't have account?{' '}
              </Text>
              <Text
                style={styles.createAccText}
                onPress={() => navigation.navigate('SignUp')}>
                Create Account
              </Text>
            </View>
          </View>
        </View>
        {/* Phone Number Modal */}

        {/* Phone Number Modal */}
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
};

export default SignIn;

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
    marginVertical: 10,
  },
  forgotPasswordTxt: {
    fontSize: normalize(FONTSIZE.small),
    color: COLORS.gray,
    margin: 15,
    alignSelf: 'flex-end',
  },
  signInbtn: {},
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
