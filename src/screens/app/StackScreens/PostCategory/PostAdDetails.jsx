import {
  FlatList,
  Keyboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {PERMISSIONS} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';
import GobackHeader from '../../../../components/GobackHeader.jsx';
import KeyboardAvoidingWrapper from '../../../../components/KeyboardAvoidingWrapper.jsx';
import Input from '../../../../components/Inputs/Input.jsx';
import {
  COLORS,
  FONTSIZE,
  SHADOWS,
  height,
  normalize,
  width,
} from '../../../../constant/index.js';
import AdImage from '../../../../components/PostAdImage/AdImage.jsx';
import {Dropdown} from 'react-native-element-dropdown';
import Button from '../../../../components/Button/Button.jsx';
import {CheckPermission} from '../../../../utils/Permission.js';
import {useNavigation, useRoute} from '@react-navigation/native';
import {PostAdDynamicFields} from './PostAdDynamicFields.js';
import {isValid} from '../../../../utils/supportFunctions.js';
import Loader from '../../../../components/Loader/Loader.jsx';
import {useMutation} from '@tanstack/react-query';
import {HelperText} from 'react-native-paper';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate.js';
import ToastManager, {Toast} from 'toastify-react-native';
import {axiosOpen} from '../../../../utils/axios.js';

const PostAdDetails = () => {
  const {
    params: {dynamic_field, category_id, subcategory_id},
  } = useRoute();
  const navigation = useNavigation();
  const axiosPrivate = useAxiosPrivate();

  const [imageUri, setImageUri] = useState(new Array(12).fill(null));
  const [viewHeight, setViewHeight] = useState();
  const [loading, setLoading] = useState(false);
  const [showDateTimeModal, setShowDateTimeModal] = useState({
    date: false,
    time: false,
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [formDetails, setFormDetails] = useState({
    ad_title: '',
    price: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [dynamicFields, setDynamicFields] = useState([
    ...(dynamic_field || []),
  ]);

  const handleInputChange = (field, value) => {
    setFormDetails(prevState => ({...prevState, [field]: value}));
  };

  const handlePostDFChange = (e, idx) => {
    let dynamicFieldsClone = dynamicFields;
    dynamicFieldsClone[idx] = {
      ...dynamicFieldsClone[idx],
      value: e,
    };
    setDynamicFields([...dynamicFieldsClone]);
  };

  const [country, setCountry] = useState('');
  const [countryList, setCountryList] = useState([]);

  const [state, setState] = useState('');
  const [filteredState, setFilteredState] = useState([]);
  const [stateList, setStateList] = useState([]);

  const [district, setDistrict] = useState('');
  const [filteredDist, setFilteredDist] = useState([]);
  const [distList, setDistList] = useState([]);

  const onChangeCountry = country => {
    setFormDetails(prevState => ({
      ...prevState,
      areaCode: country?.callingCode,
    }));
  };

  const onDateTimeFocus = type => {
    if (type == 'date') {
      setShowDateTimeModal({date: true});
    } else {
      setShowDateTimeModal({time: true});
    }
    Keyboard.dismiss();
  };

  const onDateTimeChange = (selectedDate, idx, type) => {
    setShowDateTimeModal({date: false, time: false});
    let dynamicFieldsClone = dynamicFields;
    if (type == 'date') {
      const formattedDate = new Date(selectedDate).toISOString().slice(0, 10);
      dynamicFieldsClone[idx] = {
        ...dynamicFieldsClone[idx],
        value: formattedDate,
      };
      setDynamicFields([...dynamicFieldsClone]);
    } else {
      const formattedTime = new Date(selectedDate).toLocaleTimeString();
      dynamicFieldsClone[idx] = {
        ...dynamicFieldsClone[idx],
        value: formattedTime,
      };
      setDynamicFields([...dynamicFieldsClone]);
    }
  };

  const handleContentSizeChange = event => {
    const {height} = event.nativeEvent.contentSize + 0.02;
    setViewHeight(height);
  };

  const checkLibraryPermission = async () => {
    const android =
      Platform.Version >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    const permission =
      Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : android;
    if (await CheckPermission(permission)) {
      handleImageLibrary();
    }
  };

  const handleImageLibrary = async () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 12,
      includeBase64: false,
    };
    await launchImageLibrary(options)
      .then(res => {
        if (res?.assets) {
          const image = res?.assets.map(item => item);
          const newImages = [...imageUri.filter(e => e), ...image].slice(0, 12);
          setImageUri([
            ...newImages,
            ...new Array(12 - newImages.length).fill(null),
          ]);
        } else if (res?.didCancel) {
          console.log('dsada');
        } else if (res?.errorMessage) {
          console.log('sdsadsa23123', res);
        }
      })
      .catch(err => console.log('adsdasd', err));
  };

  const handleDelete = idx => {
    setImageUri(prev => [...prev.filter((_, i) => i !== idx), null]);
  };

  const renderImageSelect = ({item, index}) => {
    return (
      <AdImage
        handleDelete={() => handleDelete(index)}
        key={index}
        imageURL={item?.uri}
        handleImage={() => checkLibraryPermission()}
      />
    );
  };

  const handleSelectChange = (item, idx) => {
    setSelectedItems(item);
    let dynamicFieldsClone = dynamicFields;
    dynamicFieldsClone[idx] = {
      ...dynamicFieldsClone[idx],
      value: item,
    };
    setDynamicFields([...dynamicFieldsClone]);
  };

  const {mutate: uploadAd, error} = useMutation({
    mutationFn: async formData => {
      console.log('function call postAd');
      setLoading(true);
      return await axiosPrivate.post(`/ads/ads`, formData);
    },
    onSuccess: res => {
      if (res?.data?.id) handleSubmitImages(res?.data?.id);
    },
    onError: err => {
      console.log('PostAds error', err);
      setLoading(false);
      Toast.error('Token expired! Login Again');
      setTimeout(() => {
        navigation.replace('SignIn');
      }, 2000);
    },
  });

  const {mutate: uploadImage} = useMutation({
    mutationFn: async formData => {
      return await axiosPrivate.post('/ads/ads_image', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
    },

    onSuccess: res => {
      console.log('PostAds Images Response', res);
      setLoading(false);
      Toast.success('Ad Posted Successfully!');
      setTimeout(() => {
        navigation.replace('MyListing');
      }, 2000);
    },
    onError: err => {
      console.log('Postads Image error', err);
      setLoading(false);
      Toast.error('Error while uploading Image');
    },
  });

  const handleSubmitImages = ads_id => {
    imageUri
      .filter(e => e)
      .forEach(img => {
        const formData = new FormData();
        formData.append('image', {
          name: img?.fileName,
          type: img?.type,
          uri:
            Platform.OS === 'ios' ? img?.uri?.replace('file://', '') : img.uri,
        });
        formData.append('ads', ads_id);
        uploadImage(formData);
      });
  };

  const handlePostAd = async () => {
    try {
      let obj = {
        ad_title: isValid('Ad title', formDetails?.ad_title),
        ad_description: isValid('Description', formDetails?.description),
        price: isValid('Price', formDetails?.price),
      };
      dynamicFields.forEach(
        e => (obj[e.field_name] = isValid(e.field_name, e.value)),
      );
      const len = imageUri.filter(e => e);
      if (len == 0) {
        obj.image = 'Please select atleast one image';
      }
      if (country == '') {
        obj.country = 'Please select country';
      }
      if (state == '') {
        obj.state = 'Please select state';
      }
      if (district == '') {
        obj.district = 'Please select district';
      }
      if (Object.values(obj).filter(e => e !== '').length > 0)
        return setErrors(obj);

      setErrors({});
      const data = {
        category: category_id,
        sub_category: subcategory_id,
        ad_title: formDetails?.ad_title,
        ad_description: formDetails?.description,
        price: formDetails?.price,
        is_sold: false,
        dynamic_field: dynamicFields,
        city: district,
        state: state,
        country: country,
      };
      uploadAd(data);
    } catch (e) {
      console.error('dasdad', e);
    }
  };

  useEffect(() => {
    fetchCountry();
    fetchState();
    fetchDistrict();
  }, []);

  const fetchCountry = async () => {
    const {data} = await axiosOpen.get('/ads/country', {
      page: 1,
      page_size: 1000,
    });
    setCountryList(data?.results);
  };
  const fetchState = async () => {
    const {data} = await axiosOpen.get('/ads/state', {
      page: 1,
      page_size: 1000,
    });
    setStateList(data?.results);
  };
  const fetchDistrict = async () => {
    const {data} = await axiosOpen.get('/ads/district', {
      page: 1,
      page_size: 1000,
    });
    setDistList(data?.results);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ToastManager duration={2000} style={{width: width * 0.8}} />
      <GobackHeader bg title={'Post Your Ads'} />
      <Loader visible={loading} />
      <KeyboardAvoidingWrapper>
        <View style={styles.inputFieldView}>
          <Text style={styles.inputFieldTitleTxt}>Ad Title</Text>
          <Input
            id={'ad_title'}
            placeholder={'Ad Title'}
            errors={errors}
            value={formDetails?.ad_title}
            onChangeText={text => handleInputChange('ad_title', text)}
            style={styles.input}
          />
          <Text style={styles.inputFieldTitleTxt}>Price</Text>
          <Input
            id={'price'}
            placeholder={'Price'}
            errors={errors}
            value={formDetails?.price}
            onChangeText={text =>
              handleInputChange('price', text?.replace(/[^0-9]/, ''))
            }
            style={styles.input}
            keyboardType="number-pad"
          />
          <Text style={styles.inputFieldTitleTxt}>Description</Text>
          <Input
            id={'ad_description'}
            placeholder={'Description'}
            errors={errors}
            value={formDetails?.description}
            onChangeText={text => handleInputChange('description', text)}
            multiline
            style={[
              styles.input,
              {height: viewHeight, minHeight: height * 0.05},
            ]}
            maxLength={250}
            onContentSizeChange={handleContentSizeChange}
          />

          {dynamicFields?.map((item, index) => {
            return (
              <PostAdDynamicFields
                key={index}
                dynamic_field={item}
                errors={errors}
                show={showDateTimeModal}
                onDateTimeFocus={onDateTimeFocus}
                selectedItems={selectedItems}
                handleSelectChange={item => handleSelectChange(item, index)}
                value={item?.value}
                onChangeDateTime={(v, type) => onDateTimeChange(v, index, type)}
                onChange={e => handlePostDFChange(e, index)}
                onChangeCountry={onChangeCountry}
              />
            );
          })}

          <Text style={styles.inputFieldTitleTxt}>Country</Text>
          <Dropdown
            style={[styles.dropdown, SHADOWS.small]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={countryList}
            maxHeight={300}
            labelField="name"
            valueField="id"
            placeholder={'Select Country'}
            value={country}
            onChange={item => {
              setCountry(item.id);
              const a = stateList.filter(e => e?.country === item?.id);
              setFilteredState(a);
            }}
          />
          {errors?.country && (
            <HelperText
              type="error"
              style={{fontSize: 14, alignSelf: 'flex-start'}}>
              {errors?.country}
            </HelperText>
          )}

          <Text style={styles.inputFieldTitleTxt}>State</Text>
          <Dropdown
            style={[styles.dropdown, SHADOWS.small]}
            disable={country === ''}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={filteredState}
            maxHeight={300}
            labelField="name"
            valueField="id"
            placeholder={'Select State'}
            value={state}
            onChange={item => {
              setState(item.id);
              const a = distList.filter(e => e?.state === item?.id);
              setFilteredDist(a);
            }}
          />
          {errors?.state && (
            <HelperText
              type="error"
              style={{fontSize: 14, alignSelf: 'flex-start'}}>
              {errors?.state}
            </HelperText>
          )}
          <Text style={styles.inputFieldTitleTxt}>District</Text>
          <Dropdown
            style={[styles.dropdown, SHADOWS.small]}
            disable={state === ''}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={filteredDist}
            maxHeight={300}
            labelField="name"
            valueField="id"
            placeholder={'Select District'}
            value={district}
            onChange={item => {
              setDistrict(item.id);
            }}
          />
          {errors?.district && (
            <HelperText
              type="error"
              style={{fontSize: 14, alignSelf: 'flex-start'}}>
              {errors?.district}
            </HelperText>
          )}

          <Text style={styles.inputFieldTitleTxt}>Upload upto 12 Images</Text>
          {errors?.image && (
            <HelperText
              type="error"
              style={{fontSize: 14, alignSelf: 'flex-start'}}>
              {errors?.image}
            </HelperText>
          )}
          <FlatList
            data={imageUri}
            renderItem={renderImageSelect}
            numColumns={3}
            scrollEnabled={false}
          />
          <Button
            text={'Post Ad'}
            onPress={handlePostAd}
            style={{width: width * 0.9, marginVertical: 15}}
          />
        </View>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
};

export default PostAdDetails;

const styles = StyleSheet.create({
  inputFieldView: {flex: 1, alignItems: 'center', marginTop: 7},
  inputFieldTitleTxt: {
    alignSelf: 'flex-start',
    marginHorizontal: width * 0.05,
    marginVertical: 5,
    fontSize: normalize(FONTSIZE.xxSmall),
    color: COLORS.black,
  },
  textInputView: {
    borderWidth: 0.9,
    borderRadius: 15,
    margin: 5,
  },
  input: {
    height: height * 0.05,
    marginVertical: 10,
  },
  inputStyle: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    margin: 0,
  },

  dropdown: {
    height: height * 0.06,
    width: width * 0.9,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginVertical: 5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: COLORS.black,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: COLORS.black,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: COLORS.black,
  },
});
