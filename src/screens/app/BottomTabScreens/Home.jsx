import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  RefreshControl,
} from 'react-native';
import React, {useRef, useState} from 'react';
import Header from '../../../components/Header/Header.jsx';
import Categories from '../../../components/Categories/Categories.jsx';
import Button from '../../../components/Button/Button.jsx';
import {useNavigation} from '@react-navigation/native';
import ListFlatAds from '../../../components/Ads/ListFlatAds.jsx';
import {COLORS, FONTSIZE, SHADOWS} from '../../../constant/theme.js';
import GridFlatAds from '../../../components/Ads/GridFlatAds.jsx';
import icons from '../../../constant/icons.js';
import ListGridAds from '../../../components/Ads/ListGridAds.jsx';

const Home = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef();
  const [refreshing, setRefreshing] = useState(false);

  const data = ['1', '2', '3', '4', '5'];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  const handleScrollToTop = () => {
    scrollViewRef.current.scrollTo({y: 0, animated: true});
  };
  return (
    <View style={{flex: 1}}>
      <Header isSearchInput />
      <ScrollView
        ref={scrollViewRef}
        style={{marginBottom: 10}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        <Categories scrollEnabled={false} />
        <Button
          style={styles.viewAllCategoriesBtn}
          text={'View All Categories'}
          onPress={() => navigation.navigate('AllCategories')}
        />
        <ListGridAds data={data} title={'Latest Ads'} changeLayoutStyle />
        {/* <Button
          title="Scroll to Top"
          onPress={handleScrollToTop}
          style={styles.button}
          icon={icons.back}
        /> */}
        <Pressable
          style={[styles.button, SHADOWS.medium]}
          onPress={handleScrollToTop}>
          <Image
            source={icons.back}
            style={{
              width: 25,
              height: 25,
              tintColor: COLORS.white,
              transform: [{rotate: '90deg'}],
            }}
          />
        </Pressable>
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
  contentContainer: {
    paddingVertical: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: COLORS.secondary,
    bottom: 80,
    borderRadius: 30,
    right: 20,
    zIndex: 1,
    width: 40,
    height: 40,
  },
});
