import {
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
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

const PostAdDetails = () => {
  const [imageUri, setImageUri] = useState(new Array(12).fill(null));
  const [viewHeight, setViewHeight] = useState();

  const handleContentSizeChange = event => {
    const {height} = event.nativeEvent.contentSize + 0.02;
    setViewHeight(height);
  };

  const checkLibraryPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

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
          const image = res?.assets.map(item => item?.uri);
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

  const renderFlatItems = ({item, index}) => {
    return (
      <AdImage
        handleDelete={() => handleDelete(index)}
        key={index}
        imageURL={item}
        handleImage={checkLibraryPermission}
      />
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <GobackHeader bg title={'Post Your Ad'} />
      <KeyboardAvoidingWrapper>
        <View style={styles.inputFieldView}>
          <Text style={styles.inputFieldTitleTxt}>Ad Title</Text>
          <Input placeholder={'Ad Title'} errors={{}} style={styles.input} />
          <Text style={styles.inputFieldTitleTxt}>Ad Description</Text>
          <Input
            placeholder={'Ad Description'}
            multiline
            inputStyle={styles.inputStyle}
            style={[
              styles.input,
              {height: viewHeight, minHeight: height * 0.05},
            ]}
            maxLength={250}
            errors={{}}
            onContentSizeChange={handleContentSizeChange}
          />
          <Text style={styles.inputFieldTitleTxt}>Ad Price</Text>
          <Input placeholder={'Ad Price'} errors={{}} style={styles.input} />

          {new Array(10).fill(null).map((_, idx) => {
            return (
              <View key={idx}>
                <Text style={styles.inputFieldTitleTxt}>Ad Price</Text>
                <Input
                  placeholder={'Ad Price'}
                  errors={{}}
                  style={styles.input}
                />
              </View>
            );
          })}

          <Text style={styles.inputFieldTitleTxt}>Upload upto 12 Images</Text>
          <FlatList
            data={imageUri}
            renderItem={renderFlatItems}
            numColumns={3}
            scrollEnabled={false}
          />
          <Button
            text={'Post Ad'}
            style={{width: width * 0.9, marginVertical: 15}}
          />
        </View>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
};

export default PostAdDetails;

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
