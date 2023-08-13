import {
  Alert,
  FlatList,
  Keyboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
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
import ToastManager, {Toast} from 'toastify-react-native';

import Loader from '../../../../components/Loader/Loader.jsx';
import {useMutation, useQuery} from '@tanstack/react-query';
import {HelperText} from 'react-native-paper';
import {baseURL} from '../../../../utils/Api.js';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate.js';

const EditAdDetails = () => {
  const axiosPrivate = useAxiosPrivate();
  const {
    params: {data},
  } = useRoute();
  const navigation = useNavigation();

  const [imageUri, setImageUri] = useState(new Array(12).fill(null));
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [viewHeight, setViewHeight] = useState();
  const [showDateTimeModal, setShowDateTimeModal] = useState({
    date: false,
    time: false,
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formDetails, setFormDetails] = useState({
    ad_title: data?.ad_title || '',
    price: data?.price || '',
    description: data?.ad_description || '',
  });
  const [errors, setErrors] = useState({});
  const [dynamicFields, setDynamicFields] = useState([
    ...(data?.dynamic_field || []),
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

  useEffect(() => {
    const image = data?.images;
    const newImages = [
      ...image.map(e => {
        e['uri'] = baseURL.replace('/api', e?.image);
        return e;
      }),
    ];
    console.log(newImages);
    setImageUri([...newImages, ...new Array(12 - newImages.length).fill(null)]);
  }, []);

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

  // const handleDelete = idx => {
  //   const imageToDelete = imageUri.find((e, i) => i === idx);
  //   if (imageToDelete?.id) {
  //     deleteImage(imageToDelete.id).then(_ => {
  //       setImageUri(prev => [...prev.filter((_, i) => i !== idx), null]);
  //     });
  //   } else setImageUri(prev => [...prev.filter((_, i) => i !== idx), null]);
  // };

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
        imageURL={item?.uri}
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
      setLoading(true);
      return await axiosPrivate.patch(`/ads/ads/${data?.id}`, formData);
    },
    onSuccess: res => {
      console.log('sada');
      if (res?.data?.id) handleSubmitImages(res?.data?.id);
    },
    onError: err => {
      console.log('PostAds error', err);
      setLoading(false);
      Toast.error('Error while uploading Ad');
    },
  });

  const {mutate: uploadImage} = useMutation({
    mutationFn: async formData => {
      return await axiosPrivate.post(`/ads/ads_image`, formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
    },
    onSuccess: res => {
      console.log('PostAds Images Response', res);
      setLoading(false);
      Toast.success('Ad updated Successfully!');
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
    ]);
  };

  const handleUpdateAd = async () => {
    try {
      let obj = {
        ad_title: isValid('Ad title', formDetails?.ad_title),
        ad_description: isValid('Description', formDetails?.description),
        price: isValid('Price', formDetails?.price),
      };
      console.log('post', dynamicFields);

      dynamicFields?.forEach(
        e => (obj[e?.field_name] = isValid(e?.field_name, e?.value)),
      );

      const len = imageUri.filter(e => e);
      if (len == 0) {
        obj.image = 'Please select atleast one image';
      }
      if (Object.values(obj).filter(e => e !== '').length > 0) {
        console.log(obj);
        return setErrors(obj);
      }

      setErrors({});
      const data = {
        category: data?.category_id,
        sub_category: data?.subcategory_id,
        ad_title: formDetails?.ad_title,
        ad_description: formDetails?.description,
        price: formDetails?.price,
        is_sold: false,
        dynamic_field: dynamicFields,
      };
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
              handleInputChange('price', text.replace(/[^0-9]/, ''))
            }
            style={styles.input}
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

          <Text style={styles.inputFieldTitleTxt}>Upload upto 12 Images</Text>
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
  inputFieldView: {flex: 1, alignItems: 'center'},
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
});
