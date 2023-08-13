import {Pressable, StyleSheet, Text, View, FlatList, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import GobackHeader from '../../../components/GobackHeader.jsx';
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

  let debounceTimeout;

  useEffect(() => {
    debounceSearch();

    // Clean up the debounce timeout
    return () => clearTimeout(debounceTimeout);
  }, [searchValue]);

  const debounceSearch = () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      onSearchLocation(searchValue);
    }, 500);
  };

  const checkPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const isPermissionGranted = await CheckPermission(permission);
    if (!isPermissionGranted) return false;
    setLoading(true);
    Getlocation()
      .then(e => setAddressList(e))
      .catch(err => console.log(err));
    setLoading(false);
  };

  const onSearchLocation = async text => {
    try {
      if (searchValue.trim() === '') return;

      const apiKey = 'AIzaSyBTzu7NKnoo9HvEkqGh2ehrcOIcRp05Z70';
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${text}&location_type=APPROXIMATE&result_type=street_address|route|intersection|locality|sublocality|premise&key=${apiKey}`;

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
      setAddressList([]);
      setError('Unable to retrieve your location');
      setLoading(false);
    }
  };

  const renderFlatItems = ({item}) => {
    return (
      <Pressable
        onPress={() => {
          setLocation(item?.formatted_address);
          navigation.navigate('Drawer');
        }}
        style={[styles.locationListContainer]}>
        <Image style={styles.locationIcon} source={icons.location} />
        <Text style={{color: COLORS.black, fontSize: 16, width: width * 0.8}}>
          {item?.formatted_address}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={{flex: 1}}>
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
      <View style={[{margin: 10}, SHADOWS.small]}>
        <Searchbar
          style={[styles.searchTextInput]}
          mode="bar"
          placeholder="Search..."
          placeholderTextColor={COLORS.black}
          icon={icons.search}
          iconColor={COLORS.secondary}
          inputStyle={{
            alignSelf: 'center',
            fontSize: normalize(FONTSIZE.small),
          }}
          onClearIconPress={() => {
            setSearchValue('');
            setAddressList([]);
          }}
          loading={false}
          value={searchValue}
          onChangeText={text => setSearchValue(text)}
          onSubmitEditing={() => onSearchLocation(searchValue)}
        />
      </View>
      <FlatList
        data={addressList}
        renderItem={renderFlatItems}
        ListEmptyComponent={() => (
          <Text style={styles.flatEmptyText}>{error}</Text>
        )}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 0.7,
              backgroundColor: COLORS.gray,
              marginHorizontal: 10,
            }}
          />
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
  locationIcon: {
    width: 25,
    height: 25,
    tintColor: COLORS.secondary,
    marginRight: 5,
  },
  locationListContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: 10,
    padding: 13,
    flexDirection: 'row',
    // borderRadius: 5,
  },
  flatEmptyText: {
    alignSelf: 'center',
    color: COLORS.black,
    fontSize: normalize(FONTSIZE.xxSmall),
  },
});
