import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  Pressable,
} from 'react-native';
import React from 'react';
import {COLORS, FONTSIZE, SHADOWS} from '../../../constant/theme.js';
import {removeUserSession} from '../../../utils/AsyncStorage/userSession.js';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/dist/FontAwesome5.js';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons.js';
import Ionicons from 'react-native-vector-icons/dist/Ionicons.js';
import {height, normalize, width} from '../../../constant/index.js';

const Account = () => {
  const navigation = useNavigation();

  const onLogout = async () => {
    Alert.alert(
      'ALERT!',
      'Are you sure to Logout?',
      [
        {
          text: 'Yes',
          onPress: async () => {
            await removeUserSession('userToken');
            navigation.navigate('SignIn');
          },
        },
        {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
      ],
      {cancelable: false},
      //on clicking out side, Alert will not dismiss
    );
  };
  return (
    <ScrollView>
      <View style={[styles.profileMainContainer, SHADOWS.small]}>
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
          onPress={() => navigation.navigate('Profile')}>
          <Icon name="edit" size={width * 0.06} color={COLORS.primary} />
        </Pressable>
      </View>

      <View style={[styles.menuListingMainContainer, SHADOWS.small]}>
        <TouchableOpacity style={styles.menuListingView}>
          <View style={styles.menuIconView}>
            <MaterialIcons
              name="list"
              size={width * 0.06}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.menuListingText}>My Listing</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuListingView}>
          <View style={styles.menuIconView}>
            <MaterialIcons
              name="favorite"
              size={width * 0.06}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.menuListingText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuListingView}>
          <View style={styles.menuIconView}>
            <MaterialIcons
              name="wallet-membership"
              size={width * 0.06}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.menuListingText}>My Membership</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuListingView}>
          <View style={styles.menuIconView}>
            <Ionicons
              name="ios-documents"
              size={width * 0.06}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.menuListingText}>My Documents</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuListingView} onPress={onLogout}>
          <View style={styles.menuIconView}>
            <MaterialIcons
              name="logout"
              size={width * 0.06}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.menuListingText}>LogOut</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuListingView}>
          <View style={styles.menuIconView}>
            <MaterialIcons
              name="delete"
              size={width * 0.06}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.menuListingText}>Delete Account</Text>
        </TouchableOpacity>
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
    backgroundColor: COLORS.secondary,
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
