import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, FONTSIZE, SHADOWS} from '../../../constant/theme.js';
import {
  removeUserSession,
  retrieveUserSession,
} from '../../../utils/AsyncStorage/userSession.js';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/dist/FontAwesome5.js';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons.js';
import Ionicons from 'react-native-vector-icons/dist/Ionicons.js';
import {height, normalize, width} from '../../../constant/index.js';
import CustomAlert from '../../../components/CustomAlert/CustomAlert.jsx';
import ToastManager, {Toast} from 'toastify-react-native';
const Account = () => {
  const navigation = useNavigation();
  const [customAlert, setCustomAert] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await retrieveUserSession('userToken');
      setIsLogin(token);
    })();
  }, []);

  const onLogout = async () => {
    if (isLogin) {
      setCustomAert(true);
    } else {
      navigation.navigate('SignIn');
    }
  };
  const handleNavigation = async screen => {
    if (isLogin) {
      navigation.navigate(screen);
    } else {
      navigation.navigate('SignIn');
    }
  };
  return (
    <ScrollView>
      <ToastManager duration={2000} />
      <CustomAlert
        visible={customAlert}
        title={'Alert!'}
        message={'Are you sure to Logout?'}
        onOkPress={async () => {
          setCustomAert(false);
          await removeUserSession('userToken');
          navigation.navigate('SignIn');
        }}
        onCancel={() => {
          setCustomAert(false);
        }}
      />
      {/* <View style={[styles.profileMainContainer, SHADOWS.small]}>
        <View style={styles.profileView}>
          <Image
            source={{
              uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_xdDre4lqxczG2sdZ73IGUPaQlA4B0p9RhQdgkRbnCg&s',
            }}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.name_usernameView}>
          <View>
            <Text style={{color: 'black'}}>First name and Last name</Text>
            <Text style={{color: 'black'}}>UserName</Text>
          </View>
        </View>
        <Pressable
          style={{
            marginHorizontal: 20,
            position: 'absolute',
            right: 10,
          }}
          onPress={() => handleNavigation('Profile')}>
          <Icon name="edit" size={width * 0.06} color={COLORS.primary} />
        </Pressable>
      </View> */}

      <View style={[styles.menuListingMainContainer, SHADOWS.small]}>
        <TouchableOpacity
          style={styles.menuListingView}
          onPress={() => {
            handleNavigation('MyListing');
            // navigation.navigate('MyListing')
          }}>
          <View style={styles.menuIconView}>
            <MaterialIcons
              name="list"
              size={width * 0.08}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.menuListingText}>My Listing</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuListingView}
          onPress={() => navigation.navigate('Membership')}>
          <View style={styles.menuIconView}>
            <MaterialIcons
              name="wallet-membership"
              size={width * 0.08}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.menuListingText}>My Membership</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.menuListingView}>
          <View style={styles.menuIconView}>
            <Ionicons
              name="ios-documents"
              size={width * 0.08}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.menuListingText}>My Documents</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.menuListingView} onPress={onLogout}>
          <View style={styles.menuIconView}>
            <MaterialIcons
              name="logout"
              size={width * 0.08}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.menuListingText}>
            {!isLogin ? 'Login' : 'LogOut'}
          </Text>
        </TouchableOpacity>
        {isLogin && (
          <TouchableOpacity style={styles.menuListingView}>
            <View style={styles.menuIconView}>
              <MaterialIcons
                name="delete"
                size={width * 0.08}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.menuListingText}>Delete Account</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default Account;

const styles = StyleSheet.create({
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
    backgroundColor: 'white',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  menuListingView: {
    padding: 10,
    margin: 5,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
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
    fontSize: normalize(FONTSIZE.xxSmall),
  },
});
