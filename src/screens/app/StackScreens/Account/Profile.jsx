import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, {useEffect, useState} from 'react';
import GobackHeader from '../../../../components/GobackHeader.jsx';
import {COLORS, FONTSIZE, SHADOWS} from '../../../../constant/theme.js';
import Input from '../../../../components/Inputs/Input.jsx';
import icons from '../../../../constant/icons.js';
import {height, normalize, width} from '../../../../constant/index.js';
import KeyboardAvoidingWrapper from '../../../../components/KeyboardAvoidingWrapper.jsx';
import Button from '../../../../components/Button/Button.jsx';
import {isValid} from '../../../../utils/supportFunctions.js';
import {useNavigation, useRoute} from '@react-navigation/native';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate.js';
import ToastManager, {Toast} from 'toastify-react-native';
import Loader from '../../../../components/Loader/Loader.jsx';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5.js';

const Profile = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigation = useNavigation();
  const {
    params: {userData},
  } = useRoute();

  useEffect(() => {
    const backAction = () => {
      navigation.replace('Drawer', {tab: 4});
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  const [formDetails, setFormDetails] = useState({
    name: userData.name || '',
    userName: userData.username || '',
    email: userData.email || '',
    areaCode: userData.area_code || '',
    phoneNumber: userData.phone_no || '',
    date: new Date(),
    dob: userData.dob || undefined,
  });
  const [show, setShow] = useState(false);

  const [editOn, setEditOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormDetails(prevState => ({...prevState, [field]: value}));
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

  const onUpdateProfile = async () => {
    try {
      let obj = {
        name: isValid('Name', formDetails.name, 'name'),
      };
      if (Object.values(obj).filter(e => e !== '').length > 0)
        return setErrors(obj);
      setErrors({});
      setIsLoading(true);
      const update = await axiosPrivate.patch(`user/user/edit_user_profile`, {
        area_code: formDetails.areaCode,
        dob: formDetails?.dob,
        email: formDetails?.email,
        name: formDetails?.name,
        phone_no: formDetails.phoneNumber,
      });
      setIsLoading(false);
      if (update?.status === 200) {
        setEditOn(false);
        Toast.success('Successfully updated!');
        setTimeout(() => {
          return navigation.replace('Drawer', {
            screen: 'Main',
            params: {tab: 4},
          });
        }, 3000);
      } else {
        Toast.error('Something went wrong!');
      }
    } catch (err) {
      setIsLoading(false);
      Toast.error('Something went wrong!');
      console.log('error while updating profile', err?.response?.data);
    }
  };

  // const handleImageLibrary = async () => {
  //   const options = {
  //     mediaType: 'photo',
  //     selectionLimit: 1,
  //     includeBase64: false,
  //   };
  //   await launchImageLibrary(options)
  //     .then(res => {
  //       if (res?.assets) {
  //         const image = res?.assets.map(item => setImageUri(item?.uri));
  //         console.log(image);
  //       } else if (res?.didCancel) {
  //         console.log('dsada');
  //       } else if (res?.errorMessage) {
  //         console.log('sdsadsa23123', res);
  //       }
  //     })
  //     .catch(err => console.log('adsdasd', err));
  // };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Loader visible={isLoading} />
      <ToastManager style={{width: width * 0.9}} />
      <GobackHeader bg title={'Edit Profile'} screen={'Drawer'} />
      <View style={styles.container}>
        <KeyboardAvoidingWrapper>
          <View>
            {!editOn && (
              <>
                <Text style={styles.inputTitleTxt}>Username</Text>
                <Input
                  value={formDetails.userName}
                  leftIcon={icons.user}
                  placeholder="Username*"
                  errors={errors}
                  style={styles.input}
                  inputStyle={{color: COLORS.gray}}
                  editable={false}
                />
                <Text style={styles.inputTitleTxt}>Email</Text>
                <Input
                  value={formDetails.email}
                  leftIcon={icons.email}
                  placeholder="Email*"
                  errors={errors}
                  style={styles.input}
                  inputStyle={{color: COLORS.gray}}
                  editable={false}
                />
              </>
            )}

            <Text style={styles.inputTitleTxt}>Name</Text>
            <Input
              id={'name'}
              value={formDetails.name}
              onChangeText={text => handleInputChange('name', text)}
              leftIcon={icons.user}
              inputStyle={{color: editOn ? COLORS.black : COLORS.gray}}
              placeholder="Name*"
              errors={errors}
              style={styles.input}
              editable={editOn}
            />

            <Text style={styles.inputTitleTxt}>Phone Number</Text>
            <Input
              id={'phoneNumber'}
              errors={errors}
              placeholder={'Phone Number'}
              value={formDetails.phoneNumber}
              onChangeText={text =>
                handleInputChange('phoneNumber', text.replace(/[^0-9]/, ''))
              }
              onFocus={() => navigation.navigate('EditPhoneNumber')}
              leftIcon={icons.phone}
              style={styles.input}
              inputStyle={{color: editOn ? COLORS.black : COLORS.gray}}
              maxLength={10}
              keyboardType={'phone-pad'}
              onChangeCountry={onChangeCountry}
              editable={editOn}
              locationIcon={icons.gps}
            />

            <Text style={styles.inputTitleTxt}>Date of Birth (Optional)</Text>
            <Input
              id={'dob'}
              errors={errors}
              placeholder={'Date of Birth'}
              value={formDetails.dob?.toString()}
              // onChangeText={() => setShow(true)}
              leftIcon={icons.calendar}
              style={styles.input}
              inputStyle={{color: editOn ? COLORS.black : COLORS.gray}}
              onFocus={() => {
                setShow(true);
                Keyboard.dismiss();
              }}
              showSoftInputOnFocus={false}
              editable={editOn}
            />
            {show && (
              <DateTimePicker
                style={{alignSelf: 'center'}}
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
            <Button
              text={editOn ? 'Submit' : 'Edit Profile'}
              style={styles.btnView}
              onPress={() => {
                if (!editOn) {
                  setEditOn(true);
                } else {
                  onUpdateProfile();
                }
              }}
            />
          </View>
        </KeyboardAvoidingWrapper>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  inputTitleTxt: {
    color: COLORS.black,
    fontSize: normalize(FONTSIZE.xxSmall),
    marginTop: 10,
  },
  input: {
    height: height * 0.07,
    marginVertical: 5,
  },
  profileImageView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.9,
    padding: 5,
    margin: 5,
  },
  imageView: {
    // width: width * 0.26,
    // height: height * 0.13,
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  image: {
    // width: width * 0.25,
    // height: height * 0.12,
    width: 95,
    height: 95,
    resizeMode: 'cover',
    aspectRatio: 1,
    borderRadius: 50,
    margin: 5,
  },
  btnView: {
    width: width * 0.4,
    height: height * 0.065,
    marginVertical: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
