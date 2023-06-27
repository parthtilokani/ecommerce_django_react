import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import {COLORS, FONTSIZE} from '../../constant/theme.js';
import {normalize, width} from '../../constant/index.js';
import OTPTextView from 'react-native-otp-textinput';
import Button from '../Button/Button.jsx';

const CustomAlert = ({
  visible,
  title,
  message,
  onCancel,
  onOkPress,
  isOtpModal,
}) => {
  return (
    <Modal visible={visible} transparent>
      <View style={styles.container}>
        <View style={styles.alert}>
          {isOtpModal ? (
            <View>
              <View>
                <Text
                  style={{
                    color: COLORS.black,
                    fontWeight: '700',
                    textAlign: 'center',
                    fontSize: normalize(FONTSIZE.medium),
                  }}>
                  Enter OPT
                </Text>
                <OTPTextView
                  tintColor={COLORS.primary}
                  offTintColor={COLORS.secondary}
                  containerStyle={styles.textInputContainer}
                  textInputStyle={styles.otpTextInputStyle}
                  // handleTextChange={text => this.setState({otpInput: text})}
                  inputCount={6}
                  keyboardType="numeric"
                  autoFocus={true}
                />
                <Button
                  text={'Submit'}
                  style={styles.otpSubmitButton}
                  onPress={onOkPress}
                />

                <Text
                  style={{
                    color: COLORS.black,
                    fontWeight: '700',
                    textAlign: 'center',
                  }}>
                  Resend OPT
                </Text>
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
              <View style={styles.buttonView}>
                <TouchableOpacity style={styles.button} onPress={onCancel}>
                  <Text style={styles.buttonText}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onOkPress}>
                  <Text style={styles.buttonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
  },
  title: {
    fontSize: normalize(FONTSIZE.medium),
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
    alignSelf: 'flex-end',
  },
  button: {
    // backgroundColor: ,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: normalize(FONTSIZE.xxSmall),
    fontWeight: 'bold',
    color: COLORS.black,
  },

  textInputContainer: {
    // width: 20,
    // backgroundColor: 'red',
  },
  otpSubmitButton: {
    width: width * 0.35,
    alignSelf: 'center',
    margin: 5,
  },
  otpTextInputStyle: {
    fontSize: normalize(FONTSIZE.medium),
    width: 35,
  },
});

export default CustomAlert;
