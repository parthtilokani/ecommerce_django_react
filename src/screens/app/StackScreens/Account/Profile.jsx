import {
  View,
  Image,
  Text,
  SafeAreaView,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons.js';
import React, {useState} from 'react';
import GobackHeader from '../../../../components/GobackHeader.jsx';
import {COLORS, FONTSIZE, SHADOWS} from '../../../../constant/theme.js';
import Input from '../../../../components/Inputs/Input.jsx';
import icons from '../../../../constant/icons.js';
import {height, normalize, width} from '../../../../constant/index.js';
import KeyboardAvoidingWrapper from '../../../../components/KeyboardAvoidingWrapper.jsx';
import Button from '../../../../components/Button/Button.jsx';
import {isValid} from '../../../../utils/supportFunctions.js';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNavigation, useRoute} from '@react-navigation/native';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate.js';
import ToastManager, {Toast} from 'toastify-react-native';
import Loader from '../../../../components/Loader/Loader.jsx';

const Profile = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigation = useNavigation();
  const {
    params: {userData},
  } = useRoute();
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
  const [imageUri, setImageUri] = useState(
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_xdDre4lqxczG2sdZ73IGUPaQlA4B0p9RhQdgkRbnCg&s',
  );
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
        Toast.success('Successfully updated!');
        setTimeout(() => {
          return navigation.replace('Drawer');
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
      <GobackHeader bg title={'Edit Profile'} />
      <View style={styles.container}>
        <KeyboardAvoidingWrapper>
          <View>
            <Text style={styles.inputTitleTxt}>Username</Text>
            <Input
              value={formDetails.userName}
              leftIcon={icons.user}
              placeholder="Username*"
              errors={errors}
              style={styles.input}
              editable={false}
            />
            <Text style={styles.inputTitleTxt}>Email</Text>
            <Input
              value={formDetails.email}
              leftIcon={icons.email}
              placeholder="Email*"
              errors={errors}
              style={styles.input}
              editable={false}
            />
            <Text style={styles.inputTitleTxt}>Name</Text>
            <Input
              id={'name'}
              value={formDetails.name}
              onChangeText={text => handleInputChange('name', text)}
              leftIcon={icons.user}
              placeholder="Name*"
              errors={errors}
              style={styles.input}
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
              leftIcon={icons.phone}
              style={styles.input}
              maxLength={10}
              keyboardType={'phone-pad'}
              onChangeCountry={onChangeCountry}
              editable={false}
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
              onFocus={() => {
                setShow(true);
                Keyboard.dismiss();
              }}
              showSoftInputOnFocus={false}
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
              text={'Update Profile'}
              style={styles.btnView}
              onPress={onUpdateProfile}
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
    marginTop: 5,
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
