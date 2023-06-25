import {Pressable, StyleSheet, Text, View, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import GobackHeader from '../../../components/GobackHeader.jsx';
import Button from '../../../components/Button/Button.jsx';
import {
  COLORS,
  FONTSIZE,
  SHADOWS,
  height,
  icons,
  normalize,
  width,
} from '../../../constant/index.js';
import {CheckPermission} from '../../../utils/Permission.js';
import {Getlocation} from '../../../utils/Getlocation.js';
import {PERMISSIONS} from 'react-native-permissions';
import Loader from '../../../components/Loader/Loader.jsx';
import useLocation from '../../../hooks/useLocation.js';
import Input from '../../../components/Inputs/Input.jsx';
import {Searchbar} from 'react-native-paper';

const LocationScreen = ({navigation}) => {
  const [error, setError] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const {location, setLocation} = useLocation();

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const isPermissionGranted = await CheckPermission(permission);
    if (isPermissionGranted) {
      setLoading(true);
      const position = await Getlocation();
      setAddressList(position);
      setLoading(false);
    }
  };

  onSearchLocation = async () => {
    try {
      if (searchValue.trim() === '') return;
      setLoading(true);

      const apiKey = 'AIzaSyBTzu7NKnoo9HvEkqGh2ehrcOIcRp05Z70';
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchValue}&location_type=APPROXIMATE&result_type=street_address|route|intersection|locality|sublocality|premise&key=${apiKey}`;

      const res = await fetch(url, {method: 'GET'});

      const data = await res.json();
      if (data.status === 'OK') {
        setError('');
        setAddressList([...data.results]);
      } else if (data.status === 'ZERO_RESULTS') {
        setError('Unable to fetch your location');
        setAddressList([]);
      } else {
        setAddressList([]);
        setError('Unable to fetch location data');
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setAddressList([]);
      setError('Unable to retrieve your location');
      setLoading(false);
    }
  };

  const renderFaltitems = ({item}) => {
    return (
      <Pressable
        onPress={() => {
          setLocation(item?.formatted_address);
          navigation.navigate('Drawer');
        }}
        style={[styles.locationListContainer]}>
        <Text style={{color: COLORS.black, fontSize: 16}}>
          {item?.formatted_address}
          {/* {item?.name},{item?.city || item?.state} */}
        </Text>
      </Pressable>
    );
  };

  return (
    <View>
      <Loader visible={loading} />
      <GobackHeader bg title={'Select Location'} />
      <Text
        style={{
          color: 'black',
          fontSize: normalize(FONTSIZE.medium),
          fontWeight: '700',
          margin: 5,
          textAlign: 'center',
        }}>
        Selected Location : {location}
      </Text>
      <View style={{margin: 10}}>
        <Searchbar
          style={[styles.searchTextInput, SHADOWS.small]}
          mode="bar"
          placeholder="Search..."
          placeholderTextColor={COLORS.black}
          icon={icons.search}
          iconColor={COLORS.secondary}
          // clearButtonMode="always"
          inputStyle={{
            alignSelf: 'center',
          }}
          loading={false}
          value={searchValue}
          onChangeText={v => setSearchValue(v)}
          onSubmitEditing={onSearchLocation}
        />
      </View>
      <FlatList
        data={addressList}
        renderItem={renderFaltitems}
        ListEmptyComponent={() => (
          <Text style={styles.flatEmptyText}>{error}</Text>
        )}
      />
    </View>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  showAllBtn: {
    width: width * 0.94,
    height: height * 0.04,
    alignSelf: 'center',
    margin: 10,
  },
  searchTextInput: {
    fontSize: normalize(FONTSIZE.medium),
    color: COLORS.black,
    borderRadius: 10,
    width: width * 0.97,
    height: height * 0.054,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  locationListContainer: {
    backgroundColor: COLORS.white,
    margin: 5,
    padding: 10,
    borderRadius: 5,
  },
  flatEmptyText: {
    alignSelf: 'center',
    color: COLORS.black,
    fontSize: normalize(FONTSIZE.xxSmall),
  },
});
