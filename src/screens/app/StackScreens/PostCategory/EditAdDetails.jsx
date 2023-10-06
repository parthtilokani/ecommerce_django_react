import {
  Alert,
  FlatList,
  Keyboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
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
import {Dropdown} from 'react-native-element-dropdown';
import Button from '../../../../components/Button/Button.jsx';
import {CheckPermission} from '../../../../utils/Permission.js';
import {useNavigation, useRoute} from '@react-navigation/native';
import {PostAdDynamicFields} from './PostAdDynamicFields.js';
import {isValid} from '../../../../utils/supportFunctions.js';
import ToastManager, {Toast} from 'toastify-react-native';

import Loader from '../../../../components/Loader/Loader.jsx';
import {useMutation, useQuery} from '@tanstack/react-query';
import {HelperText} from 'react-native-paper';
import {baseURL} from '../../../../utils/Api.js';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate.js';
import {axiosOpen} from '../../../../utils/axios.js';
import Geolocation from 'react-native-geolocation-service';
import {Getlocation} from '../../../../utils/Getlocation.js';

const EditAdDetails = () => {
  const axiosPrivate = useAxiosPrivate();
  const {
    params: {data},
  } = useRoute();
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [viewHeight, setViewHeight] = useState();
  const [showDateTimeModal, setShowDateTimeModal] = useState({
    date: false,
    time: false,
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formDetails, setFormDetails] = useState({
    category: data?.category,
    subcategory: data?.sub_category,
    ad_title: data?.ad_title || '',
    location: data?.location || '',
    description: data?.ad_description || '',
    latitude: data?.latitude,
    longitude: data?.longitude,
    place_id: '',
  });
  const [errors, setErrors] = useState({});
  const [dynamicFields, setDynamicFields] = useState([
    ...(data?.dynamic_field || []),
  ]);

  const [categoryList, setCategoryList] = useState([]);
  const [categorySelected, setCategorySelected] = useState(false);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [filteredSubCategoryList, setFilteredSubCategoryList] = useState([]);
  const [numberOfImages, setNumberOfImages] = useState(12);

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

  useEffect(() => {
    (async () => {
      const category = await axiosOpen('/ads/category');
      const subCategory = await axiosOpen('/ads/subcategory');
      setCategoryList(category?.data);
      setSubCategoryList(subCategory?.data);

      if (formDetails?.subcategory != '') {
        const getImageLength = subCategory?.data
          ?.filter(e => e?.category === formDetails?.category)
          ?.filter(e => e?.id === formDetails?.subcategory);
        setNumberOfImages(getImageLength[0]?.no_of_images);

        for (let i = 0; i < dynamicFields.length; i++) {
          if (getImageLength[0]?.dynamic_field[i]?.field_type === 'Select') {
            dynamicFields[i].options =
              getImageLength[0]?.dynamic_field[i]?.options;
          }
        }
        // );
        const image = data?.images;
        const newImages = [
          ...image?.map(e => {
            e['uri'] = baseURL.replace('/api', e?.image);
            return e;
          }),
        ];
        setImageUri([
          ...newImages,
          ...new Array(getImageLength[0]?.no_of_images - newImages.length).fill(
            null,
          ),
        ]);
      }
    })();
  }, [formDetails?.subcategory]);

  /////////////// location code ////////////////////////
  const [searchValue, setSearchValue] = useState(null);
  const [addressList, setAddressList] = useState([]);

  useEffect(() => {
    checkLocationPermission();
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

  const checkLocationPermission = async forceFetch => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const isPermissionGranted = await CheckPermission(permission);
    if (!isPermissionGranted) return false;
    setLoading(true);
    if (forceFetch) {
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
          setLoading(false);
        });
    }
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
      selectionLimit: numberOfImages,
      includeBase64: false,
    };
    await launchImageLibrary(options)
      .then(res => {
        if (res?.assets) {
          const image = res?.assets.filter(item => {
            if (item?.fileSize > 1000000 * 4) {
              Toast.error('Image Size Exceeds Limit');
            }
            return item?.fileSize < 1000000 * 4 && item;
          });
          const newImages = [...imageUri.filter(e => e), ...image].slice(
            0,
            numberOfImages,
          );
          setImageUri([
            ...newImages,
            ...new Array(numberOfImages - newImages.length).fill(null),
          ]);
        } else if (res?.didCancel) {
        } else if (res?.errorMessage) {
          console.log('sdsadsa23123', res);
        }
      })
      .catch(err => console.log('adsdasd', err));
  };

  const handleDelete = idx => {
    const imageToDelete = imageUri.find((e, i) => i === idx);
    if (imageToDelete?.id) {
      setImagesToDelete(prev => [...prev, imageToDelete]);
    }
    setImageUri(prev => [...prev.filter((_, i) => i !== idx), null]);
  };

  const renderImageSelect = ({item, index}) => {
    return (
      <AdImage
        handleDelete={() => handleDelete(index)}
        key={index}
        imageURL={item?.image || item?.uri}
        handleImage={checkLibraryPermission}
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

  const {mutate: uploadAd} = useMutation({
    mutationFn: async formData => {
      console.log('function call postAd');
      // setLoading(true);
      return await axiosPrivate.patch(`/ads/ads/${data?.id}`, formData);
    },
    onSuccess: res => {
      console.log('sada');
      if (res?.data?.id) handleSubmitImages(res?.data?.id);
    },
    onError: err => {
      console.log('PostAds error', err?.response?.data);
      setLoading(false);
      Toast.error('Error while uploading Ad');
    },
  });

  const {mutate: uploadImage} = useMutation({
    mutationFn: async formData => {
      setLoading(true);
      return await axiosPrivate.post(`/ads/ads_image`, formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
    },
    onSuccess: res => {
      console.log('PostAds Images Response', res);
      setLoading(false);
    },
    onError: err => {
      console.log('Postads Image error', err);
      setLoading(false);
      // Toast.error('Error while uploading Image');
    },
  });

  const {mutateAsync: deleteImage} = useMutation({
    mutationFn: async imgId => {
      return await axiosPrivate.delete(`/ads/ads_image/${imgId}`);
    },
  });

  const handleSubmitImages = ads_id => {
    if (imageUri.filter(e => e).filter(e => !e?.id).length === 0) {
      Toast.success('Ad Post updated!');
      setTimeout(() => {
        navigation.replace('MyListing');
      }, 2000);
    }
    Promise.all([
      imageUri
        .filter(e => e)
        .filter(e => !e?.id)
        .forEach(img => {
          const formData = new FormData();
          formData.append('image', {
            name: img?.fileName || '',
            type: img?.type || 'image/jpg',
            uri:
              Platform.OS === 'ios'
                ? img?.uri?.replace('file://', '')
                : img.uri,
          });
          formData.append('ads', ads_id);
          return uploadImage(formData);
        }),
      ...imagesToDelete.map(img => deleteImage(img?.id)),
    ]).finally(() => {
      setLoading(false);
      Toast.success('Ad updated Successfully!');
      setTimeout(() => {
        navigation.replace('MyListing');
      }, 2000);
    });
  };

  const handleUpdateAd = async () => {
    try {
      let obj = {
        ad_title: isValid('Ad title', formDetails?.ad_title),
        ad_description: isValid('Description', formDetails?.description),
        location: isValid('Location', formDetails?.location),
        subCategory: isValid(
          'SubCategory',
          formDetails?.subcategory?.toString(),
        ),
      };
      dynamicFields?.forEach(
        e =>
          e?.is_required &&
          (obj[e.field_name] = isValid(e.field_name, e.value)),
      );

      const len = imageUri.filter(e => e);
      if (len == 0) {
        obj.image = 'Please select atleast one image';
      }
      if (Object.values(obj).filter(e => e !== '').length > 0) {
        return setErrors(obj);
      }

      setErrors({});
      const data = {
        category: formDetails?.category,
        sub_category: formDetails?.subcategory,
        ad_title: formDetails?.ad_title,
        ad_description: formDetails?.description,
        location: formDetails?.location,
        latitude: formDetails?.latitude,
        longitude: formDetails?.longitude,
        is_sold: false,
        dynamic_field: dynamicFields
          ?.filter(df => df?.value?.trim() !== '')
          ?.map(df => ({
            field_name: df?.field_name,
            field_type: df?.field_type,
            value: df?.value,
          })),
        place_id: formDetails?.place_id,
      };
      setCategorySelected(false);
      uploadAd(data);
    } catch (e) {
      console.error('dasdad', e);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ToastManager duration={2000} style={{width: width * 0.9}} />
      <GobackHeader bg title={'Post Your Ads'} />
      <Loader visible={loading} />
      <KeyboardAvoidingWrapper>
        <View style={styles.inputFieldView}>
          <Text style={styles.inputFieldTitleTxt}>
            Category <Text style={{color: 'red'}}>*</Text>
          </Text>
          <Dropdown
            style={[styles.dropdown, {...SHADOWS.medium}]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            itemTextStyle={{color: COLORS.black}}
            iconStyle={styles.iconStyle}
            data={categoryList}
            maxHeight={300}
            labelField="name"
            valueField="id"
            placeholder={'Select category'}
            value={formDetails.category}
            onChange={item => {
              setCategorySelected(true);
              const sub = subCategoryList?.filter(
                e => e?.category === item?.id,
              );
              setFormDetails(prev => ({...prev, subcategory: ''}));
              setFilteredSubCategoryList(sub);
              setFormDetails(prev => ({...prev, category: item?.id}));
            }}
          />
          <Text style={styles.inputFieldTitleTxt}>
            SubCategory <Text style={{color: 'red'}}>*</Text>
          </Text>
          <Dropdown
            style={[styles.dropdown, {...SHADOWS.medium}]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            itemTextStyle={{color: COLORS.black}}
            iconStyle={styles.iconStyle}
            data={
              categorySelected
                ? filteredSubCategoryList
                : subCategoryList.filter(
                    e => e?.category === formDetails.category,
                  )
            }
            maxHeight={300}
            labelField="name"
            valueField="id"
            placeholder={'Select subcategory'}
            value={formDetails?.subcategory}
            onChange={item => {
              setNumberOfImages(item.no_of_images);
              setFormDetails(prev => ({...prev, subcategory: item?.id}));
            }}
            // disable={!categorySelected}
          />
          {errors?.subCategory && (
            <HelperText
              type="error"
              style={{fontSize: 14, alignSelf: 'flex-start'}}>
              {errors?.subCategory}
            </HelperText>
          )}

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
            onLeftIconPress={() => checkLocationPermission(true)}
            onContentSizeChange={handleContentSizeChange}
            locationIcon={icons.gps}
            loading={loading}
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
            {`Upload upto ${numberOfImages} Images`} (Max size limit:4MB)
          </Text>
          <HelperText
            type="error"
            style={{fontSize: 14, alignSelf: 'flex-start'}}>
            {errors?.image}
          </HelperText>
          <FlatList
            data={imageUri}
            renderItem={renderImageSelect}
            numColumns={3}
            scrollEnabled={false}
          />
          <Button
            text={'Update Ad'}
            onPress={handleUpdateAd}
            style={{width: width * 0.9, marginVertical: 15}}
          />
        </View>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
};

export default EditAdDetails;

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
    height: height * 0.05,
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
