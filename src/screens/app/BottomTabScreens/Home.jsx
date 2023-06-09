import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../components/Header/Header.jsx';
import Categories from '../../../components/Categories/Categories.jsx';
import Button from '../../../components/Button/Button.jsx';
import {useNavigation} from '@react-navigation/native';
import Ads from '../../../components/Ads/Ads.jsx';
// import AppHeader from '../../../components/AppHeader';
// import Bottomtab from '../../../components/BottomTab/Bottomtab.jsx';
// import Category from './Category.jsx';

const Home = () => {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1}}>
      <Header isSearchInput />
      <ScrollView style={{marginBottom: 90}}>
        <Categories scrollEnabled={false} />
        <Button
          style={styles.viewAllCategoriesBtn}
          text={'View All Categories'}
          onPress={() => navigation.navigate('AllCategories')}
        />
        <Ads />
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  viewAllCategoriesBtn: {
    alignSelf: 'center',
    marginVertical: 15,
  },
});
