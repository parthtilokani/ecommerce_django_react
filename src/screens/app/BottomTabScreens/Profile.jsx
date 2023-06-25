import {View, Image, Text, TouchableOpacity, SafeAreaView} from 'react-native';
import React from 'react';
import GobackHeader from '../../../components/GobackHeader.jsx';
import {COLORS} from '../../../constant/theme.js';

const Profile = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <GobackHeader bg title={'Profile'} />
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            //   backgroundColor: 'red',
            width: '90%',
            padding: 10,
          }}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey',
            }}>
            <Image
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_xdDre4lqxczG2sdZ73IGUPaQlA4B0p9RhQdgkRbnCg&s',
              }}
              style={{width: 95, height: 95, borderRadius: 50, margin: 5}}
            />
          </View>
          <Text style={{color: 'black'}}>Username</Text>
          <Text style={{color: 'black'}}>Email</Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            padding: 15,
            borderRadius: 15,
          }}>
          <Text style={{color: 'white', fontSize: 16}}>Update Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
