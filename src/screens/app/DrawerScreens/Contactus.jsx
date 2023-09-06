import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import GobackHeader from '../../../components/GobackHeader.jsx';
import {
  COLORS,
  FONTSIZE,
  appName,
  height,
  normalize,
  width,
  icons,
} from '../../../constant/index.js';
import KeyboardAvoidingWrapper from '../../../components/KeyboardAvoidingWrapper.jsx';
import Loader from '../../../components/Loader/Loader.jsx';
import Input from '../../../components/Inputs/Input.jsx';
import Button from '../../../components/Button/Button.jsx';
import {axiosOpen} from '../../../utils/axios.js';
import ToastManager, {Toast} from 'toastify-react-native';
import {useMutation} from '@tanstack/react-query';
import {isValid} from '../../../utils/supportFunctions.js';
import {useNavigation} from '@react-navigation/native';

const Contactus = () => {
  const navigation = useNavigation();
  const [formDetails, setFormDetails] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  //   const [loading, setLoading] = useState(false);
  const handleInputChange = (field, value) => {
    setFormDetails(prevState => ({...prevState, [field]: value}));
  };

  const [viewHeight, setViewHeight] = useState();

  const handleContentSizeChange = event => {
    const {height} = event.nativeEvent.contentSize + 0.02;
    setViewHeight(height);
  };

  const {mutate, isLoading} = useMutation({
    mutationFn: async formData => {
      return await axiosOpen.post(`/user/contact_us`, formData);
    },
    onSuccess: res => {
      Toast.success('Your message has been recorded');
      setFormDetails({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setTimeout(() => {
        navigation.replace('Drawer');
      }, 2000);
    },
    onError: err => {
      console.log(err);
      Toast.error(err?.response?.data?.detail || 'Something went wrong! Retry');
    },
  });

  const handleSubmit = () => {
    const obj = {
      email: isValid('Email', formDetails.email, 'email'),
      name: isValid('Name', formDetails.name),
      subject: isValid('Subject', formDetails.subject),
      message: isValid('Message', formDetails.message),
    };
    if (Object.values(obj).filter(e => e !== '').length > 0)
      return setErrors(obj);

    mutate(formDetails);
  };
  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={{flex: 1}}>
        <Loader visible={isLoading} />
        <ToastManager style={{width: width * 0.9}} />
        <GobackHeader bg title={'Contact Us'} />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: height - 100,
          }}>
          <View>
            <View style={styles.mainContainer}>
              <Text style={styles.pageName}>Send Us A Message</Text>
            </View>

            <View
              style={{
                alignItems: 'center',
              }}>
              <Input
                id={'name'}
                errors={errors}
                placeholder={'Name*'}
                value={formDetails?.name}
                onChangeText={text => handleInputChange('name', text)}
                // leftIcon={icons.user}
                style={styles.input}
              />
              <Input
                id={'email'}
                errors={errors}
                placeholder={'Email*'}
                value={formDetails.email}
                onChangeText={text => handleInputChange('email', text)}
                // leftIcon={icons.email}
                style={styles.input}
              />
              <Input
                id={'subject'}
                errors={errors}
                placeholder={'Subject*'}
                value={formDetails?.subject}
                onChangeText={text => handleInputChange('subject', text)}
                // leftIcon={icons.email}
                style={styles.input}
              />
              <Input
                id={'message'}
                placeholder={'Message*'}
                errors={errors}
                value={formDetails?.message}
                onChangeText={text => handleInputChange('message', text)}
                multiline
                style={[
                  styles.input,
                  {height: viewHeight, minHeight: height * 0.05},
                ]}
                maxLength={250}
                onContentSizeChange={handleContentSizeChange}
              />
              <Button
                text={'Submit'}
                style={styles.signInbtn}
                onPress={handleSubmit}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
};

export default Contactus;

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
