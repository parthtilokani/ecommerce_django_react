import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {HelperText} from 'react-native-paper';
import React, {useState} from 'react';
import {
  COLORS,
  FONTSIZE,
  SHADOWS,
  height,
  icons,
  normalize,
  width,
} from '../../constant';
import PhoneInput from 'react-native-phone-number-input';
const Input = ({
  id,
  errors,
  placeholder,
  leftIcon,
  value,
  isPassword,
  onChangeText,
  inputStyle,
  style,
  placeholderTextColor = 'gray',
  maxLength,
  keyboardType = 'default',
  onFocus,
  onBlur,
  showSoftInputOnFocus = true,
  onChangeCountry,
  multiline,
  onContentSizeChange,
  editable = true,
  onLeftIconPress,
  locationIcon,
  loading,
}) => {
  const [secure, setSecure] = useState(true);
  return (
    <>
      <View style={[styles.container, SHADOWS.small, style]}>
        {leftIcon && (
          <TouchableOpacity>
            <Image source={leftIcon} style={styles.icon} />
          </TouchableOpacity>
        )}
        {id == 'phoneNumber' ? (
          <PhoneInput
            defaultCode="IN"
            containerStyle={styles.phoneContainer}
            codeTextStyle={styles.countryCodeTextStyle}
            flagButtonStyle={styles.phoneFlagBtn}
            textInputStyle={{alignSelf: 'center'}}
            textContainerStyle={styles.phoneTextContainer}
            value={value}
            disabled={!editable}
            disableArrowIcon
            textInputProps={{
              onChangeText: onChangeText,
              value: value,
              maxLength: maxLength,
              placeholder: placeholder,
              onFocus: onFocus,
              style: [styles.phoneInput, inputStyle],
              keyboardType: keyboardType,
              placeholderTextColor: 'grey',
            }}
            onChangeCountry={onChangeCountry}
          />
        ) : (
          <TextInput
            id={id}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            style={[styles.input, inputStyle]}
            secureTextEntry={secure && isPassword}
            autoCapitalize="none"
            value={value}
            onChangeText={onChangeText}
            maxLength={maxLength}
            multiline={multiline}
            keyboardType={keyboardType}
            onFocus={onFocus}
            onBlur={onBlur}
            showSoftInputOnFocus={showSoftInputOnFocus}
            onContentSizeChange={onContentSizeChange}
            editable={editable}
          />
        )}

        {id === 'location' && loading ? (
          <ActivityIndicator
            size={'small'}
            color={COLORS.primary}
            style={{marginLeft: 20}}
          />
        ) : (
          id === 'location' &&
          !loading && (
            <TouchableOpacity onPress={onLeftIconPress}>
              <Image
                source={locationIcon}
                style={[styles.icon, {marginLeft: 20}]}
              />
            </TouchableOpacity>
          )
        )}
        {isPassword && (
          <Pressable
            style={styles.rightIconView}
            onPress={() => setSecure(!secure)}>
            <Image
              source={secure ? icons.eye_view : icons.eye_hide}
              style={styles.icon}
            />
          </Pressable>
        )}
      </View>

      {errors[id] && (
        <HelperText
          type="error"
          style={{fontSize: 14, alignSelf: 'flex-start'}}>
          {errors[id]}
        </HelperText>
      )}
    </>
  );
};

export default React.memo(Input);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.9,
    height: height * 0.07,
    borderRadius: 10,
    paddingHorizontal: 5,
    backgroundColor: COLORS.lightWhite,
  },
  icon: {
    width: width * 0.06,
    height: height * 0.03,
    margin: 5,
    resizeMode: 'contain',
  },
  input: {
    fontSize: normalize(FONTSIZE.xxSmall),
    width: width * 0.7,
    color: COLORS.black,
  },
  phoneInput: {
    fontSize: normalize(FONTSIZE.xxSmall),
    width: width * 0.56,
    color: COLORS.black,
  },
  phoneTextContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    color: COLORS.black,
    paddingVertical: 0,
  },
  phoneFlagBtn: {
    left: 0,
    borderRadius: 10,
    width: width * 0.15,
    height: height * 0.05,
  },
  countryCodeTextStyle: {
    fontSize: normalize(FONTSIZE.small),
    // color: COLORS.black,
    bottom: Platform.OS == 'android' ? 15 : 0,
    textAlignVertical: 'center',
  },
  phoneContainer: {
    backgroundColor: COLORS.lightWhite,
    color: 'black',
    alignItems: 'center',
    borderRadius: 10,
  },
  rightIconView: {
    right: 15,
  },
});
