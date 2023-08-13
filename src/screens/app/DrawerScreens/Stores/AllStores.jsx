import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import GobackHeader from '../../../../components/GobackHeader.jsx';
import {Searchbar} from 'react-native-paper';
import {
  COLORS,
  FONTSIZE,
  SHADOWS,
  height,
  normalize,
  width,
  icons,
} from '../../../../constant/index.js';

const AllStores = ({navigation}) => {
  const [searchValue, setSearchValue] = useState('');

  const renderFlatItems = () => {
    return (
      <TouchableOpacity
        style={[styles.flatItemsMainContainer, SHADOWS.small]}
        onPress={() => navigation.navigate('StoreDetails')}>
        <Image
          source={require('../../../../assets/bg-image.jpg')}
          style={{width: 85, height: 90, resizeMode: 'contain'}}
        />
        <Text
          style={{color: COLORS.black, fontSize: normalize(FONTSIZE.small)}}>
          TITLE
        </Text>
        <Text
          style={{color: COLORS.black, fontSize: normalize(FONTSIZE.small)}}>
          ADs
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <GobackHeader bg title={'All Stores'} />
      <View style={[{margin: 10}, SHADOWS.medium]}>
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
          }}
          loading={false}
          value={searchValue}
          onChangeText={text => setSearchValue(text)}
          onSubmitEditing={() => onSearchLocation(searchValue)}
        />
      </View>
      <View style={{alignSelf: 'center'}}>
        <FlatList
          data={new Array(13).fill(null)}
          renderItem={renderFlatItems}
          numColumns={3}
          ListFooterComponent={() => <View style={{height: 120}} />}
        />
      </View>
    </SafeAreaView>
  );
};

export default AllStores;

const styles = StyleSheet.create({
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
  flatItemsMainContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    maxWidth: '30%',
    width: width * 0.28,
    height: height * 0.2,
    margin: 10,
    borderRadius: 10,
    padding: 5,
  },
});
