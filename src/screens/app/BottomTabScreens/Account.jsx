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
import GobackHeader from '../../../components/GobackHeader.jsx';
import {COLORS} from '../../../constant/theme.js';
import {removeUserSession} from '../../../utils/AsyncStorage/userSession.js';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/dist/FontAwesome5.js';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons.js';
import Ionicons from 'react-native-vector-icons/dist/Ionicons.js';
import {height} from '../../../constant/index.js';

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
      <View
        style={{
          backgroundColor: 'white',
          margin: 10,
          padding: 2,
          borderRadius: 5,
          flexDirection: 'row',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
        }}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'grey',
            flexDirection: 'row',
            overflow: 'hidden',
          }}>
          <Image
            source={{
              uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_xdDre4lqxczG2sdZ73IGUPaQlA4B0p9RhQdgkRbnCg&s',
            }}
            style={{width: 95, height: 95, borderRadius: 50, margin: 5}}
          />
        </View>
        <View
          style={{
            marginLeft: 10,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>
          <View>
            <Text style={{color: 'black'}}>First name and Last name</Text>
            <Text style={{color: 'black'}}>UserName</Text>
          </View>
          <Pressable
            style={{
              marginHorizontal: 30,
            }}
            onPress={() => navigation.navigate('Profile')}>
            <Icon name="edit" size={25} color={COLORS.primary} />
            {/* <Text>Edit</Text> */}
          </Pressable>
        </View>
      </View>

      <View
        style={{
          width: '95%',
          borderRadius: 10,
          marginBottom: height * 0.07,
          backgroundColor: 'white',
          alignSelf: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
        }}>
        <TouchableOpacity style={styles.mainCategory}>
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor: COLORS.secondary,
              borderRadius: 25,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MaterialIcons name="list" size={25} color={COLORS.primary} />
          </View>
          <Text style={{marginHorizontal: 10, color: 'black'}}>My Listing</Text>
          {/* <Icon
            name="angle-right"
            style={{position: 'absolute', right: 15}}
            size={25}
            color={COLORS.black}
          /> */}
        </TouchableOpacity>
        <TouchableOpacity style={styles.mainCategory}>
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor: COLORS.secondary,
              borderRadius: 25,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {/* <Image
              source={{
                uri: 'https://w7.pngwing.com/pngs/570/1019/png-transparent-computer-icons-heart-filled-love-heart-black.png',
              }}
              style={{width: 27, height: 27, resizeMode: 'contain'}}
            /> */}
            <MaterialIcons name="favorite" size={25} color={COLORS.primary} />
          </View>
          <Text style={{marginHorizontal: 10, color: 'black'}}>Favorites</Text>
          {/* <Icon
            name="angle-right"
            style={{position: 'absolute', right: 15}}
            size={25}
            color={COLORS.black}
          /> */}
        </TouchableOpacity>
        <TouchableOpacity style={styles.mainCategory}>
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor: COLORS.secondary,
              borderRadius: 25,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {/* <Image
              source={{
                uri: 'https://w7.pngwing.com/pngs/570/1019/png-transparent-computer-icons-heart-filled-love-heart-black.png',
              }}
              style={{width: 27, height: 27, resizeMode: 'contain'}}
            /> */}
            <MaterialIcons
              name="wallet-membership"
              size={25}
              color={COLORS.primary}
            />
          </View>
          <Text style={{marginHorizontal: 10, color: 'black'}}>
            My Membership
          </Text>
          {/* <Icon
            name="angle-right"
            style={{position: 'absolute', right: 15}}
            size={25}
            color={COLORS.black}
          /> */}
        </TouchableOpacity>
        <TouchableOpacity style={styles.mainCategory}>
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor: COLORS.secondary,
              borderRadius: 25,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {/* <Image
              source={{
                uri: 'https://w7.pngwing.com/pngs/570/1019/png-transparent-computer-icons-heart-filled-love-heart-black.png',
              }}
              style={{width: 27, height: 27, resizeMode: 'contain'}}
            /> */}
            <Ionicons name="ios-documents" size={25} color={COLORS.primary} />
          </View>
          <Text style={{marginHorizontal: 10, color: 'black'}}>
            My Documents
          </Text>
          {/* <Icon
            name="angle-right"
            style={{position: 'absolute', right: 15}}
            size={25}
            color={COLORS.black}
          /> */}
        </TouchableOpacity>

        <TouchableOpacity style={styles.mainCategory} onPress={onLogout}>
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor: COLORS.secondary,
              borderRadius: 25,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {/* <Image
              source={{
                uri: 'https://w7.pngwing.com/pngs/570/1019/png-transparent-computer-icons-heart-filled-love-heart-black.png',
              }}
              style={{width: 27, height: 27, resizeMode: 'contain'}}
            /> */}
            <MaterialIcons name="logout" size={25} color={COLORS.primary} />
          </View>
          <Text style={{marginHorizontal: 10, color: 'black'}}>LogOut</Text>
          {/* <Icon
            name="angle-right"
            style={{position: 'absolute', right: 15}}
            size={25} 
            color={COLORS.black}
          /> */}
        </TouchableOpacity>
        <TouchableOpacity style={styles.mainCategory}>
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor: COLORS.secondary,
              borderRadius: 25,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {/* <Image
              source={{
                uri: 'https://w7.pngwing.com/pngs/570/1019/png-transparent-computer-icons-heart-filled-love-heart-black.png',
              }}
              style={{width: 27, height: 27, resizeMode: 'contain'}}
            /> */}
            <MaterialIcons name="delete" size={25} color={COLORS.primary} />
          </View>
          <Text style={{marginHorizontal: 10, color: 'black'}}>
            Delete Account
          </Text>
          {/* <Icon
            name="angle-right"
            style={{position: 'absolute', right: 15}}
            size={25}
            color={COLORS.black}
          /> */}
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          marginVertical: 25,
        }}>
        {/* <TouchableOpacity
          onPress={onLogout}
          style={{
            backgroundColor: COLORS.primary,
            padding: 15,
            borderRadius: 15,
          }}>
          <Text style={{color: 'white', fontSize: 16}}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            padding: 15,
            borderRadius: 15,
          }}>
          <Text style={{color: 'white', fontSize: 16}}>Delete Account</Text>
        </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
};

export default Account;

const styles = StyleSheet.create({
  mainCategory: {
    padding: 10,
    margin: 5,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
});
