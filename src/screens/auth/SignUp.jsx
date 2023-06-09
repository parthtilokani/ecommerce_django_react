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
import {SignupFields} from '../../constant/signupFields';
import Checkbox from '../../components/Checkbox/Checkbox';

const SignUp = ({navigation}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={{flex: 1}}>
        <GobackHeader navigation={navigation} />
        <View style={styles.mainContainer}>
          <Text style={styles.logo}>CLASSIMA</Text>
          <Text style={styles.pageName}>Sign Up</Text>
        </View>

        {/* TextInput View */}
        <View
          style={{
            alignItems: 'center',
            marginTop: height * 0.05,
          }}>
          <Input
            placeholder={'First Name'}
            value={firstName}
            onChangeText={v => setFirstName(v)}
            leftIcon={icons.user}
            style={styles.input}
          />
          <Input
            placeholder={'Last Name'}
            value={lastName}
            onChangeText={v => setLastName(v)}
            leftIcon={icons.user}
            style={styles.input}
          />
          <Input
            placeholder={'Username'}
            value={username}
            onChangeText={v => setUsername(v)}
            leftIcon={icons.user}
            style={styles.input}
          />
          <Input
            placeholder={'Email'}
            value={email}
            onChangeText={v => setEmail(v)}
            leftIcon={icons.email}
            style={styles.input}
          />
          <Input
            placeholder={'Phone Number'}
            value={phoneNumber}
            onChangeText={v => setPhoneNumber(v)}
            leftIcon={icons.phone}
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

          {/* {SignupFields.map(({placeholder, value, setValue, lefticon}) => (
            <Input
              placeholder={placeholder}
              value={value}
              onChangeText={v => setValue(v)}
              leftIcon={lefticon}
              style={styles.input}
            />
          ))} */}
        </View>
        <View style={styles.checkboxView}>
          <Checkbox
            text={'I have read and agree to the website Terms and Conditions'}
            // secondTxt={' Terms and Conditions'}
          />
        </View>
        <Button text={'Sign Up'} style={styles.signInbtn} />

        {/* Create account view */}
        <View style={styles.createAccountView}>
          <Text style={{color: COLORS.gray}}>Already have an account? </Text>
          <Text
            style={{color: COLORS.tertiary}}
            onPress={() => navigation.navigate('SignIn')}>
            Sign In
          </Text>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
};

export default SignUp;

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
    marginBottom: 10,
  },
  pageName: {
    fontSize: FONTSIZE.large,
    fontWeight: '500',
    color: COLORS.black,
  },
  input: {
    height: height * 0.0634,
    marginVertical: 5,
  },
  signInbtn: {
    marginVertical: 5,
    alignSelf: 'center',
  },
  checkboxView: {
    margin: 10,
    flexShrink: 1,
  },

  createAccountView: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: height * 0.1,
  },
});
