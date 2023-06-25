import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
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

const Input = ({
  id,
  errors,
  placeholder,
  leftIcon,
  value,
  isPassword,
  onChangeText,
  style,
  isSearch,
  placeholderTextColor = 'gray',
  maxLength,
  keyboardType = 'default',
}) => {
  const [secure, setSecure] = useState(true);
  return (
    <>
      <View style={[styles.container, SHADOWS.small, style]}>
        <Image source={leftIcon} style={styles.icon} />
        <TextInput
          id={id}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          style={styles.input}
          secureTextEntry={secure && isPassword}
          autoCapitalize="none"
          value={value}
          onChangeText={onChangeText}
          maxLength={maxLength}
          keyboardType={keyboardType}
        />
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
        {/* {isSearch && (
        <Pressable style={styles.rightIconView}>
          <Image source={icons.email} style={styles.icon} />
        </Pressable>
      )} */}
      </View>
      {/* {errors?.find(e => e.id === id) && (
        <HelperText
          type="error"
          style={{fontSize: 14, alignSelf: 'flex-start'}}>
          {errors.find(e => e.id === id)?.error}
        </HelperText>
      )} */}
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

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.9,
    height: height * 0.07,
    borderRadius: 10,
    padding: 3,
    backgroundColor: COLORS.lightWhite,
  },
  icon: {
    width: 27,
    height: 27,
    margin: 5,
    // tintColor: COLORS.black,
  },
  input: {
    fontSize: normalize(FONTSIZE.xxSmall),
    width: width * 0.7,
    color: COLORS.black,
  },
  rightIconView: {
    right: 15,
  },
});
