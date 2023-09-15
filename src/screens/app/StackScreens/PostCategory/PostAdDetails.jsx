import {
  FlatList,
  Keyboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
  icons,
  normalize,
  width,
} from '../../../../constant/index.js';
import AdImage from '../../../../components/PostAdImage/AdImage.jsx';
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
import {Getlocation} from '../../../../utils/Getlocation.js';
import Geolocation from 'react-native-geolocation-service';
import {axiosOpen} from '../../../../utils/axios.js';

const PostAdDetails = () => {
  const {
    params: {dynamic_field, category_id, subcategory_id, no_of_images},
  } = useRoute();
  const navigation = useNavigation();
  const axiosPrivate = useAxiosPrivate();

  const [imageUri, setImageUri] = useState(new Array(no_of_images).fill(null));
  const [viewHeight, setViewHeight] = useState();
  const [loading, setLoading] = useState(false);
  const [showDateTimeModal, setShowDateTimeModal] = useState({
    date: false,
    time: false,
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [formDetails, setFormDetails] = useState({
    ad_title: '',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    place_id: '',
  });
  const [errors, setErrors] = useState({});
  const [dynamicFields, setDynamicFields] = useState([
    ...(dynamic_field || []),
  ]);

  /////////////// location code ////////////////////////

  const [searchValue, setSearchValue] = useState(null);
  const [addressList, setAddressList] = useState([]);

  useEffect(() => {
    checkLocationPermission();
    // Geolocation.getCurrentPosition(
    //   async position => {
    //     console.log('position:----', position);
    //     setFormDetails(prev => ({
    //       ...prev,
    //       latitude: position?.coords?.latitude,
    //       longitude: position?.coords?.longitude,
    //     }));
    //   },
    //   error => {
    //     console.log('sadasdasdaq2e312', error.code, error.message);
    //     reject(error);
    //   },
    //   {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    // );
  }, []);

  let debounceTimeout;

  useEffect(() => {
    debounceSearch();

    // Clean up the debounce timeout
    return () => clearTimeout(debounceTimeout);
  }, [formDetails?.location]);

  const debounceSearch = () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      onSearchLocation(formDetails.location);
    }, 500);
  };

  const checkLocationPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const isPermissionGranted = await CheckPermission(permission);
    if (!isPermissionGranted) return false;
    setLoading(true);
    Getlocation()
      .then(e => {
        setLoading(false);
        setFormDetails(prev => ({
          ...prev,
          location: e[0]?.formatted_address,
          latitude: e[0]?.geometry?.location?.lat,
          longitude: e[0]?.geometry?.location?.lng,
          place_id: e[0]?.place_id,
        }));
        setAddressList(e);
      })
      .catch(err => {
        console.log('err,err');
        setLoading(false);
      });
  };

  const onSearchLocation = async text => {
    try {
      if (formDetails?.location.trim() === '') return;

      // const apiKey = 'AIzaSyBTzu7NKnoo9HvEkqGh2ehrcOIcRp05Z70';
      // const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${text}&location_type=APPROXIMATE&result_type=street_address|route|intersection|locality|sublocality|premise&key=${apiKey}`;

      // const res = await fetch(url, {method: 'GET'});
      const res = await axiosOpen.get('/ads/ads/get_place_id_from_address', {
        params: {address: text},
      });

      const data = res;
      if (data.status === 200) {
        console.log(JSON.stringify(data));
        setAddressList([...data?.data?.results]);
      } else if (data.status === 'ZERO_RESULTS') {
        setAddressList([]);
      } else {
        setAddressList([]);
      }
      setLoading(false);
    } catch (error) {
      setAddressList([]);
      setLoading(false);
    }
  };

  /////////////// location code ////////////////////////

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

  function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = [
      'Bytes',
      'KiB',
      'MiB',
      'GiB',
      'TiB',
      'PiB',
      'EiB',
      'ZiB',
      'YiB',
    ];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  const handleImageLibrary = async () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: no_of_images,
      includeBase64: false,
    };
    await launchImageLibrary(options)
      .then(res => {
        if (res?.assets) {
          const image = res?.assets.filter(item => {
            if (item?.fileSize > 1000000 * 4) {
              Toast.error('Image Size Exceeds Limit');
            }
            return item?.fileSize < 4000000 && item;
          });

          const newImages = [...imageUri.filter(e => e), ...image].slice(
            0,
            no_of_images,
          );
          setImageUri([
            ...newImages,
            ...new Array(no_of_images - newImages.length).fill(null),
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
      // setLoading(true);
      return await axiosPrivate.post(`/ads/ads`, formData);
    },
    onSuccess: res => {
      if (res?.data?.id) handleSubmitImages(res?.data?.id);
    },
    onError: err => {
      console.log('PostAds error', err);
      setLoading(false);
      Toast.error(err?.response?.data?.detail || 'Something went wrong!');
    },
  });

  const {mutate: uploadImage} = useMutation({
    mutationFn: async formData => {
      setLoading(true);
      return await axiosPrivate.post('/ads/ads_image', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
    },

    onSuccess: res => {
      console.log('PostAds Images Response', res);
      setLoading(false);
    },
    onError: err => {
      console.log('Postads Image error', err?.response);
      setLoading(false);
    },
  });

  const handleSubmitImages = ads_id => {
    Promise.all(
      imageUri
        .filter(e => e)
        .map(img => {
          let formData = new FormData();
          formData.append('image', {
            name: img?.fileName,
            type: img?.type,
            uri:
              Platform.OS === 'ios'
                ? img?.uri?.replace('file://', '')
                : img.uri,
          });
          formData.append('ads', ads_id);
          return uploadImage(formData);
        }),
    ).finally(() => {
      setLoading(false);
      Toast.success('Ad Posted Successfully!');
      setTimeout(() => {
        navigation.replace('MyListing');
      }, 2000);
    });
    // imageUri
    //   .filter(e => e)
    //   .map(img => {
    //     let formData = new FormData();
    //     formData.append('image', {
    //       name: img?.fileName,
    //       type: img?.type,
    //       uri:
    //         Platform.OS === 'ios'
    //           ? img?.uri?.replace('file://', '')
    //           : img.uri,
    //     });
    //     formData.append('ads', ads_id);
    //     return uploadImage(formData);
    //   })

    // ).finally(() => {
    //   Toast.success('Ad Posted Successfully!');
    //   setTimeout(() => {
    //     navigation.replace('MyListing');
    //   }, 2000);
    // });
  };

  const handlePostAd = async () => {
    try {
      let obj = {
        ad_title: isValid('Ad title', formDetails?.ad_title),
        ad_description: isValid('Description', formDetails?.description),
        location: isValid('Location', formDetails?.location),
      };
      dynamicFields.forEach(
        e =>
          e?.is_required &&
          (obj[e.field_name] = isValid(e.field_name, e.value)),
      );
      if (formDetails?.description.length < 25) {
        obj.ad_description = 'Please enter atleast 25 Character';
      }
      const len = imageUri.filter(e => e);
      if (len == 0) {
        obj.image = 'Please select atleast one image';
      }
      if (Object.values(obj).filter(e => e !== '').length > 0)
        return setErrors(obj);

      setErrors({});
      const data = {
        category: category_id,
        sub_category: subcategory_id,
        ad_title: formDetails?.ad_title,
        ad_description: formDetails?.description,
        location: formDetails?.location,
        latitude: formDetails?.latitude,
        longitude: formDetails?.longitude,
        is_sold: false,
        dynamic_field: dynamicFields
          .filter(df => df?.value?.trim() !== '')
          .map(df => ({
            field_name: df?.field_name,
            field_type: df?.field_type,
            value: df?.value,
          })),
        place_id: formDetails?.place_id,
      };
      uploadAd(data);
    } catch (e) {
      console.error('dasdad', e);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ToastManager duration={2000} style={{width: width * 0.8}} />
      <GobackHeader bg title={'Post Your Ads'} />
      <Loader visible={loading} />

      <KeyboardAvoidingWrapper>
        <View style={styles.inputFieldView}>
          <Text style={styles.inputFieldTitleTxt}>
            Ad Title <Text style={{color: 'red'}}>*</Text>
          </Text>
          <Input
            id={'ad_title'}
            placeholder={'Ad Title'}
            errors={errors}
            value={formDetails?.ad_title}
            onChangeText={text => handleInputChange('ad_title', text)}
            style={styles.input}
          />
          <Text style={styles.inputFieldTitleTxt}>
            Description <Text style={{color: 'red'}}>*</Text>
          </Text>
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

          <Text style={styles.inputFieldTitleTxt}>
            Location <Text style={{color: 'red'}}>*</Text>
          </Text>
          <Input
            id={'location'}
            placeholder={'Press icon to fetch current location'}
            errors={errors}
            value={formDetails?.location}
            onChangeText={text => {
              setSearchValue(text);
              handleInputChange('location', text);
            }}
            // multiline
            style={[
              styles.input,
              {height: viewHeight, minHeight: height * 0.05},
            ]}
            onFocus={() => setFormDetails(prev => ({...prev, location: ''}))}
            onBlur={() => setSearchValue('')}
            maxLength={250}
            onLeftIconPress={() => checkLocationPermission()}
            onContentSizeChange={handleContentSizeChange}
            loading={loading}
            locationIcon={icons.gps}
          />
          {addressList.length > 0 && searchValue && (
            <View
              style={[
                {
                  alignSelf: 'center',
                  // position: 'absolute',
                  // top: height * 0.435,
                  padding: 10,
                  width: width * 0.9,
                  height: height * 0.2,
                  backgroundColor: 'white',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,

                  elevation: 5,
                  zIndex: 999,
                  minHeight: '20%',
                },
                // {display: true},
              ]}>
              <FlatList
                data={addressList}
                scrollEnabled={false}
                renderItem={({item}) => {
                  console.log('latitude', item?.geometry?.location?.lat);
                  return (
                    <TouchableOpacity
                      style={{marginVertical: 10}}
                      onPress={() => {
                        console.log(item?.place_id);
                        setAddressList([]);
                        setSearchValue('');
                        setFormDetails(prev => ({
                          ...prev,
                          location:
                            item?.description || item?.formatted_address,
                          latitude: item?.geometry?.location?.lat,
                          longitude: item?.geometry?.location?.lng,
                          place_id: item?.place_id,
                        }));
                      }}>
                      <Text style={{color: COLORS.black}}>
                        {item?.description || item?.formatted_address}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}

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

          <Text style={styles.inputFieldTitleTxt}>
            {`Upload upto ${imageUri.length} Images`} (Max size limit:4MB)
          </Text>
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

  container: {
    backgroundColor: 'white',
    padding: 16,
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
