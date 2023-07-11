import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {
  COLORS,
  FONTSIZE,
  SHADOWS,
  height,
  normalize,
  width,
} from '../../constant/index.js';
import defaultImage from '../../assets/select.png';

const AdImage = ({imageURL, handleImage, handleDelete}) => {
  return (
    <View style={styles.container}>
      {imageURL ? (
        <>
          <Text
            onPress={handleDelete}
            style={[styles.deleteBtnText, SHADOWS.medium]}>
            X
          </Text>
          {/* <TouchableOpacity> */}
          <Image source={{uri: imageURL}} style={styles.selectedImage} />
          {/* </TouchableOpacity> */}
        </>
      ) : (
        <TouchableOpacity onPress={handleImage} style={{overflow: 'hidden'}}>
          <Image source={defaultImage} style={styles.defaultImage} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default React.memo(AdImage);

const styles = StyleSheet.create({
  container: {
    width: width * 0.29,
    maxWidth: '35%',
    height: height * 0.1,
    margin: 3,
    backgroundColor: COLORS.gray2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  selectedImage: {
    resizeMode: 'contain',
    width: width * 0.25,
    height: height * 0.1,
  },
  defaultImage: {
    resizeMode: 'contain',
    width: width * 0.3,
    height: height * 0.2,
  },
  deleteBtnText: {
    alignSelf: 'flex-end',
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: 'red',
    position: 'absolute',
    top: 1,
    zIndex: 1,
    padding: 3,
    width: width * 0.07,
    borderRadius: 20,
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: normalize(FONTSIZE.xxSmall),
  },
});

// 7410166924
