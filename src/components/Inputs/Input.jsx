import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS, FONTSIZE, SHADOWS, height, icons, width} from '../../constant';

const Input = ({
  placeholder,
  leftIcon,
  value,
  isPassword,
  onChangeText,
  style,
  isSearch,
}) => {
  const [secure, setSecure] = useState(true);
  return (
    <View style={[styles.container, SHADOWS.small, style]}>
      <Image source={leftIcon} style={styles.icon} />
      <TextInput
        placeholder={placeholder}
        style={styles.input}
        secureTextEntry={secure && isPassword}
        autoCapitalize="none"
        value={value}
        onChangeText={onChangeText}
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
      {isSearch && (
        <Pressable style={styles.rightIconView}>
          <Image source={icons.email} style={styles.icon} />
        </Pressable>
      )}
    </View>
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
    width: 25,
    height: 25,
  },
  input: {
    fontSize: FONTSIZE.medium,
    marginHorizontal: 10,
    width: width * 0.7,
  },
  rightIconView: {
    right: 15,
  },
});
