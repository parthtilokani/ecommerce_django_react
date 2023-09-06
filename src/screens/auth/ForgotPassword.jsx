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
import {isEmptyValue} from '../../utils/supportFunctions.js';
import useAxiosPrivate from '../../hooks/useAxiosPrivate.js';
import ToastManager, {Toast} from 'toastify-react-native';
import Loader from '../../components/Loader/Loader.jsx';

const ForgotPassword = ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [continueBtn, setContinueBtn] = useState(false);
  const [errors, setErrors] = useState({});
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(false);

  const onChangeUsername = v => {
    setUserName(v);

    if (v.length > 3) {
      setContinueBtn(false);
    } else {
      setContinueBtn(true);
    }
  };

  const onSubmit = async () => {
    if (isEmptyValue(userName, 'Username/Email', setErrors)) return;

    setErrors({});
    try {
      setIsLoading(true);
      const resetPassword = await axiosPrivate.post('/user/password_reset/', {
        email: userName,
      });
      setIsLoading(false);
      Toast.success('Password reset email send to register \nemail address!');
      setTimeout(() => {
        navigation.replace('SignIn');
      }, 2000);
    } catch (e) {
      console.log(e?.response?.data?.email[0]);
      Toast.error("We couldn't find an account associated with that email.");
    }
  };

  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={{flex: 1}}>
        <Loader visible={isLoading} />
        <ToastManager style={{width: width * 0.9}} />
        <GobackHeader resetBack navigation={navigation} />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: height - 100,
          }}>
          <View>
            <View style={styles.mainContainer}>
              <Text style={styles.logo}>{appName}</Text>
              <Text style={styles.pageName}>Email Address</Text>
            </View>

            <Text
              style={{
                color: COLORS.gray,
                textAlign: 'center',
                fontSize: normalize(FONTSIZE.xxSmall),
                marginVertical: 5,
              }}>
              Enter your email address to reset password
            </Text>

            {/* TextInput View */}
            <View
              style={{
                alignItems: 'center',
                // marginTop: height * 0.05,
              }}>
              <Input
                id={'Email'}
                errors={errors}
                placeholder={'Email Address'}
                value={userName}
                onChangeText={v => onChangeUsername(v)}
                leftIcon={icons.user}
                style={styles.input}
              />
              <Button
                text={'Continue'}
                disable={continueBtn}
                style={[
                  styles.signInbtn,
                  {backgroundColor: continueBtn ? COLORS.gray : COLORS.primary},
                ]}
                onPress={onSubmit}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
};

export default ForgotPassword;

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
    // marginBottom: 20,
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
    fontSize: normalize(FONTSIZE.medium),
    color: COLORS.gray,
    margin: 15,
    alignSelf: 'flex-end',
  },
  signInbtn: {
    marginVertical: 10,
  },
  loginOptionalView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  horizontalView: {
    width: width * 0.2,
    height: 0.5,
    backgroundColor: '#000',
    marginHorizontal: 5,
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
    marginTop: height * 0.18,
  },
});
