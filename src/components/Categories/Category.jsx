import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ListGridAds from '../Ads/ListGridAds.jsx';
import Header from '../Header/Header.jsx';
import AppHeader from '../AppHeader.jsx';
import GobackHeader from '../GobackHeader.jsx';

const Category = ({route, navigation}) => {
  const item = route?.params?.item;
  return (
    <View style={styles.container}>
      <GobackHeader title={'Selected Category'} bg />
      <View style={styles.listGirdView}>
        <ListGridAds
          isChange
          title={item?.title}
          data={['1', '2', '3']}
          onChnagePress={() => navigation.navigate('AllCategories')}
          changeLayoutStyle
        />
      </View>
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listGirdView: {
    marginVertical: 10,
  },
});
