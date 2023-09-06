import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, FONTSIZE, SHADOWS} from '../../../constant/theme.js';
import {
  removeUserSession,
  retrieveUserSession,
  storeUserSession,
} from '../../../utils/AsyncStorage/userSession.js';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/dist/FontAwesome5.js';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons.js';
import Ionicons from 'react-native-vector-icons/dist/Ionicons.js';
import {height, icons, normalize, width} from '../../../constant/index.js';
import CustomAlert from '../../../components/CustomAlert/CustomAlert.jsx';
import ToastManager, {Toast} from 'toastify-react-native';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate.js';
import Input from '../../../components/Inputs/Input.jsx';
import Button from '../../../components/Button/Button.jsx';
import useAuth from '../../../hooks/useAuth.js';
import Loader from '../../../components/Loader/Loader.jsx';
const Account = props => {
  const {auth, setAuth} = useAuth();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const axiosPrivate = useAxiosPrivate();
  const [customAlert, setCustomAert] = useState(false);
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('sadsad123123123', isFocused);
    getUserInfo();
    setIsLogin(auth?.access);
  }, [auth, isFocused]);

  const getUserInfo = async () => {
    try {
      setIsLoading(true);
      const userInfo = await axiosPrivate.get('/user/user/get_current_user');
      setIsLoading(false);

      setUserData(userInfo?.data);
    } catch (e) {
      setIsLoading(false);
      console.log('error userInfo', e?.response?.data);
    }
  };

  const onLogout = async () => {
    if (isLogin) {
      setCustomAert(true);
    } else {
      navigation.navigate('SignIn');
    }
  };

  const onDelete = async () => {
    try {
      if (!password) return setError('Please enter password');
      setIsLoading(true);
      const userInfo = await axiosPrivate.post(
        `/user/user/${userData?.id}/delete_user_account`,
        {password},
      );
      setIsLoading(false);
      setDeleteAccount(false);
      Toast.success('User deleted!');
      setAuth({});
      await removeUserSession('userToken');
      setTimeout(() => {
        navigation.navigate('SignIn');
      }, 3000);
    } catch (e) {
      setIsLoading(false);
      setError('');
      setDeleteAccount(false);
      Toast.error('Something went wrong! Retry');
      console.log('error while deleting account', e);
    }
  };

  const handleNavigation = async screen => {
    if (isLogin) {
      navigation.navigate(screen, {userData});
    } else {
      navigation.navigate('SignIn');
    }
  };

  return (
    <ScrollView>
      <ToastManager duration={2000} style={{width: width * 0.9}} />
      <Loader visible={isLoading} />
      <CustomAlert
        visible={customAlert}
        title={'Alert!'}
        message={'Are you sure to Logout?'}
        onOkPress={async () => {
          setCustomAert(false);
          await removeUserSession('userToken');
          setAuth({});
          navigation.navigate('SignIn');
        }}
        onCancel={() => {
          setCustomAert(false);
        }}
      />
      <CustomAlert
        visible={deleteAccount}
        title={'Alert!'}
        message={'Are you sure to Delete this account?'}
        onOkPress={async () => {
          setDeleteAccount(false);
          // await storeUserSession('userToken', {});
          await removeUserSession('userToken');
          setAuth({});
          onDelete();
          navigation.navigate('SignIn');
        }}
        onCancel={() => {
          setDeleteAccount(false);
        }}
      />

      <View style={[styles.menuListingMainContainer]}>
        {userData && (
          <>
            <View
              style={{
                backgroundColor: COLORS.white,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                ...SHADOWS.medium,
                borderRadius: 5,
                padding: 5,
                marginVertical: 10,
                marginHorizontal: 5,
              }}>
              <Text
                style={{
                  fontSize: normalize(FONTSIZE.xxSmall),
                  color: COLORS.black,
                }}>
                Remaining Credits : {userData?.remaining_credits}
              </Text>
              <Button
                style={{width: width * 0.25, height: height * 0.045}}
                text={'Upgrade'}
                onPress={() => navigation.navigate('Allplans')}
              />
            </View>
            <TouchableOpacity
              style={styles.menuListingView}
              onPress={() => {
                navigation.replace('Profile', {userData});
              }}>
              <View style={styles.menuIconView}>
                <MaterialIcons
                  name="account-box"
                  size={width * 0.08}
                  color={COLORS.primary}
                />
              </View>
              <View>
                <Text style={styles.menuListingText}>Profile</Text>
                <Text
                  style={{
                    color: COLORS.black,
                    marginLeft: 10,
                    fontSize: normalize(FONTSIZE.xxSmall),
                  }}>
                  Update and modify your profile
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={25}
                color={COLORS.primary}
                style={{position: 'absolute', right: 20}}
              />
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.menuListingView}
          onPress={() => {
            navigation.navigate('MyListing', {userData});
          }}>
          <View style={styles.menuIconView}>
            <MaterialIcons
              name="list"
              size={width * 0.08}
              color={COLORS.primary}
            />
          </View>
          <View>
            <Text style={styles.menuListingText}>My Listing</Text>
            <Text
              style={{
                color: COLORS.black,
                marginLeft: 10,
                fontSize: normalize(FONTSIZE.xxSmall),
              }}>
              View your Ads listing here
            </Text>
          </View>
          <MaterialIcons
            name="chevron-right"
            size={25}
            color={COLORS.primary}
            style={{position: 'absolute', right: 20}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuListingView}
          onPress={() => {
            if (!isLogin) return navigation.navigate('SignIn');
            navigation.navigate('Membership', {
              userInfo: userData || null,
            });
          }}>
          <View style={styles.menuIconView}>
            <MaterialIcons
              name="wallet-membership"
              size={width * 0.08}
              color={COLORS.primary}
            />
          </View>
          <View>
            <Text style={styles.menuListingText}>My Membership</Text>
            <Text
              style={{
                color: COLORS.black,
                marginLeft: 10,
                fontSize: normalize(FONTSIZE.xxSmall),
              }}>
              Check your Membership
            </Text>
          </View>
          <MaterialIcons
            name="chevron-right"
            size={25}
            color={COLORS.primary}
            style={{position: 'absolute', right: 20}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuListingView}
          onPress={() => {
            if (!isLogin) return navigation.navigate('SignIn');
            navigation.navigate('Transaction');
          }}>
          <View style={styles.menuIconView}>
            <Image
              source={icons.transaction}
              style={{width: 30, height: 30, tintColor: COLORS.primary}}
            />
          </View>
          <View>
            <Text style={styles.menuListingText}>Transactions</Text>
            <Text
              style={{
                color: COLORS.black,
                marginLeft: 10,
                fontSize: normalize(FONTSIZE.xxSmall),
              }}>
              Check your Transactions
            </Text>
          </View>

          <MaterialIcons
            name="chevron-right"
            size={25}
            color={COLORS.primary}
            style={{position: 'absolute', right: 20}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuListingView}
          onPress={() => {
            navigation.navigate('Allplans');
          }}>
          <View style={styles.menuIconView}>
            <Image
              source={icons.buy}
              style={{width: 30, height: 30, tintColor: COLORS.primary}}
            />
          </View>
          <View>
            <Text style={styles.menuListingText}>All Plans</Text>
            <Text
              style={{
                color: COLORS.black,
                marginLeft: 10,
                fontSize: normalize(FONTSIZE.xxSmall),
              }}>
              Checkout our plans
            </Text>
          </View>
          <MaterialIcons
            name="chevron-right"
            size={25}
            color={COLORS.primary}
            style={{position: 'absolute', right: 20}}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuListingView} onPress={onLogout}>
          <View style={styles.menuIconView}>
            <MaterialIcons
              name="logout"
              size={width * 0.08}
              color={COLORS.primary}
            />
          </View>
          <View>
            <Text style={styles.menuListingText}>
              {!isLogin ? 'Login' : 'LogOut'}
            </Text>
            {isLogin && (
              <Text
                style={{
                  color: COLORS.black,
                  marginLeft: 10,
                  fontSize: normalize(FONTSIZE.xxSmall),
                }}>
                {'Logout from this device'}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        {isLogin && (
          <TouchableOpacity
            style={styles.menuListingView}
            onPress={() => setDeleteAccount(true)}>
            <View style={styles.menuIconView}>
              <MaterialIcons
                name="delete"
                size={width * 0.08}
                color={COLORS.primary}
              />
            </View>
            <View>
              <Text style={styles.menuListingText}>Delete Account</Text>
              <Text
                style={{
                  color: COLORS.black,
                  marginLeft: 10,
                  fontSize: normalize(FONTSIZE.xxSmall),
                }}>
                Delete account permenantaly
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={deleteAccount}
        transparent
        onRequestClose={() => {
          setError('');
          setDeleteAccount(false);
        }}>
        <View style={styles.container}>
          <View style={styles.alert}>
            {/* <TextInput
              placeholder="Enter Password"
              style={{width: '95%', borderWidth: 0.5}}
              onChangeText={e => setPassword(e)}
            /> */}
            <Input
              id={'password'}
              placeholder={'Enter Password'}
              errors={{}}
              onChangeText={e => setPassword(e)}
              isPassword
              style={{width: width * 0.8}}
            />
            {error && (
              <Text
                style={{
                  color: 'red',
                  fontSize: normalize(FONTSIZE.small),
                  alignSelf: 'flex-start',
                  marginLeft: 10,
                }}>
                {error}
              </Text>
            )}
            <View style={{flexDirection: 'row'}}>
              <Button style={styles.button} text={'Done'} onPress={onDelete} />
              <Button
                style={styles.button}
                text={'Close'}
                onPress={() => {
                  setError('');
                  setDeleteAccount(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Account;

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
    width: '90%',
    alignItems: 'center',
  },
  input: {
    marginVertical: 10,
  },
  button: {
    width: width * 0.3,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  profileMainContainer: {
    backgroundColor: 'white',
    width: width * 0.95,
    margin: 10,
    padding: 2,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  profileView: {
    aspectRatio: 1,
    // width: width * 0.26,
    // height: height * 0.12,
    borderRadius: width * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray2,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  profileImage: {
    width: width * 0.2,
    height: height * 0.02,
    borderRadius: width * 0.1,
    margin: 2,
    aspectRatio: 1,
  },
  name_usernameView: {
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  menuListingMainContainer: {
    marginTop: 10,
    width: width * 0.95,
    // height: height * 0.5,
    borderRadius: 10,
    marginBottom: height * 0.05,
    // backgroundColor: 'white',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  menuListingView: {
    height: height * 0.08,
    padding: 10,
    margin: 5,
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    ...SHADOWS.medium,
    backgroundColor: 'white',
  },
  menuIconView: {
    aspectRatio: 1,
    width: width * 0.1,
    height: height * 0.06,
    // backgroundColor: COLORS.secondary,
    borderRadius: width * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuListingText: {
    marginHorizontal: 10,
    color: 'black',
    fontSize: normalize(FONTSIZE.medium),
    fontWeight: '500',
  },
});
