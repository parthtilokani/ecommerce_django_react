import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import GobackHeader from '../../components/GobackHeader';
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';
import {COLORS, FONTSIZE, height, icons, width} from '../../constant';
import Input from '../../components/Inputs/Input';
import Button from '../../components/Button/Button';

const SignIn = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={{flex: 1}}>
        <GobackHeader navigation={navigation} />
        <View style={styles.mainContainer}>
          <Text style={styles.logo}>CLASSIMA</Text>
          <Text style={styles.pageName}>Sign In</Text>
        </View>

        {/* TextInput View */}
        <View
          style={{
            alignItems: 'center',
            marginTop: height * 0.1,
          }}>
          <Input
            placeholder={'Username'}
            value={username}
            onChangeText={v => setUsername(v)}
            leftIcon={icons.user}
            style={styles.input}
          />
          <Input
            placeholder={'Password'}
            value={password}
            onChangeText={v => setPassword(v)}
            leftIcon={icons.lock}
            isPassword={true}
            style={styles.input}
          />
          <Text style={styles.forgotPasswordTxt}>Forgot Password?</Text>
          <Button
            text={'Sign In'}
            style={styles.signInbtn}
            onPress={() => navigation.navigate('Main')}
          />
        </View>

        {/* Login Optional View */}
        <View style={styles.loginOptionalView}>
          <View style={styles.horizontalView} />
          <Text style={{color: COLORS.gray}}>Or Login With</Text>
          <View style={styles.horizontalView} />
        </View>

        {/* Login Optional Button View */}
        <View style={styles.optionalLoginBtnView}>
          <Button
            text={'Facebook'}
            icon={icons.facebook}
            style={[styles.optionalLoginBtn, {backgroundColor: '#1976D2'}]}
          />
          <Button
            text={'Google'}
            icon={icons.google}
            textStyle={styles.optionalLoginBtnText}
            style={[styles.optionalLoginBtn, {backgroundColor: 'white'}]}
          />
        </View>
        {/* Create account view */}
        <View style={styles.createAccountView}>
          <Text style={{color: COLORS.gray}}>Don't have account? </Text>
          <Text
            style={{color: COLORS.tertiary}}
            onPress={() => navigation.navigate('SignUp')}>
            Create Account
          </Text>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  logo: {
    fontSize: FONTSIZE.xxLarge,
    fontWeight: 'bold',
    color: COLORS.tertiary,
    marginBottom: 20,
  },
  pageName: {
    fontSize: FONTSIZE.large,
    fontWeight: '500',
    color: COLORS.black,
  },
  input: {
    marginVertical: 10,
  },
  forgotPasswordTxt: {
    fontSize: FONTSIZE.medium,
    color: COLORS.gray,
    margin: 15,
    alignSelf: 'flex-end',
  },
  signInbtn: {},
  loginOptionalView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  horizontalView: {
    width: width * 0.2,
    height: 0.5,
    backgroundColor: '#000',
    marginHorizontal: 5,
  },
  optionalLoginBtnView: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginVertical: 15,
  },
  optionalLoginBtnText: {
    color: COLORS.black,
  },
  optionalLoginBtn: {
    width: width * 0.4,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  createAccountView: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: height * 0.18,
  },
});
