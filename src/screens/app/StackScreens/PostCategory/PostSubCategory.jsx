import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import GobackHeader from '../../../../components/GobackHeader.jsx';
import {COLORS, FONTSIZE} from '../../../../constant/theme.js';
import {Searchbar} from 'react-native-paper';
import {height, icons, normalize, width} from '../../../../constant/index.js';

const PostSubCategory = () => {
  const [searchValue, setSearchValue] = useState('');

  const renderFlatItems = () => {
    return (
      <TouchableOpacity
        style={{
          margin: 10,
          width: width * 0.9,
          backgroundColor: COLORS.gray2,
          borderRadius: 10,
          overflow: 'hidden',
        }}>
        <ImageBackground
          source={require('../../../../assets/bg-image.jpg')}
          style={{width: width * 0.5, height: height * 0.17}}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <GobackHeader bg title={'Post Your Ads'} />
      <Searchbar
        style={styles.searchTextInput}
        mode="bar"
        placeholder="Search..."
        placeholderTextColor={COLORS.black}
        icon={icons.search}
        iconColor={COLORS.secondary}
        // clearButtonMode="always"
        value={searchValue}
        onChangeText={v => setSearchValue(v)}
        inputStyle={{
          alignSelf: 'center',
          fontSize: normalize(FONTSIZE.xxSmall),
        }}
        loading={false}
      />

      <View style={styles.flatListMainView}>
        <FlatList
          data={new Array(10)}
          keyExtractor={(item, index) => index}
          showsVerticalScrollIndicator={false}
          renderItem={renderFlatItems}
          ListFooterComponent={() => <View style={{height: height * 0.1}} />}
        />
      </View>
    </SafeAreaView>
  );
};

export default PostSubCategory;

const styles = StyleSheet.create({
  searchTextInput: {
    // fontSize: FONTSIZE.medium,
    margin: 10,
    color: COLORS.black,
    borderRadius: 30,
    width: width * 0.95,
    height: height * 0.06,
    backgroundColor: COLORS.gray2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatListMainView: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    // borderRadius: 10,
  },
});
