import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import {COLORS, FONTSIZE} from '../../constant/theme.js';
import {normalize, width} from '../../constant/index.js';
import OTPTextView from 'react-native-otp-textinput';
import Button from '../Button/Button.jsx';

const CustomAlert = ({visible, title, message, onCancel, onOkPress}) => {
  return (
    <Modal visible={visible} transparent>
      <View style={styles.container}>
        <View style={styles.alert}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonView}>
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <Text style={styles.buttonText}>NO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: 'red'}]}
              onPress={onOkPress}>
              <Text style={styles.buttonText}>YES</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alert: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: normalize(FONTSIZE.large),
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.black,
  },
  message: {
    fontSize: normalize(FONTSIZE.xxSmall),
    marginBottom: 20,
    color: COLORS.black,
  },
  buttonView: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignSelf: 'flex-end',
  },
  button: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    width: width * 0.3,
    paddingVertical: 10,
    marginHorizontal: 20,
    borderRadius: 5,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: normalize(FONTSIZE.xxSmall),
    fontWeight: 'bold',
    color: COLORS.white,
  },
});

export default CustomAlert;
