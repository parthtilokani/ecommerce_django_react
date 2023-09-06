import {
  FlatList,
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS, FONTSIZE} from '../../constant/theme.js';
import {height, normalize, width} from '../../constant/index.js';
import {useNavigation} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import {getCategory} from '../../utils/customHook/backEndCalls.js';
import {axiosOpen} from '../../utils/axios.js';
import {baseURL} from '../../utils/Api.js';

const Categories = ({
  scrollEnabled,
  categories = [],
  title,
  nav,
  isLoading,
}) => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const Item = ({item}) => {
    console.log(item?.category?.icon);
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => !nav && navigation.navigate('Category', {item: item})}>
        <Image
          source={{
            uri:
              item.icon ||
              item?.category?.icon ||
              baseURL.replace('/api', item?.category?.icon),
          }}
          style={styles.imageStyle}
        />
        <Text style={styles.titleStyle}>
          {item.name || item.category?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const flatHeader = () => {
    return (
      <View>
        <Text
          style={{
            fontSize: normalize(FONTSIZE.medium),
            color: COLORS.black,
            fontWeight: 'bold',
            alignSelf: 'center',
          }}>
          {categories?.length >= 1 ? title : 'Category Data not found'}
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <ActivityIndicator
        size={'large'}
        color={COLORS.primary}
        style={{alignSelf: 'center', marginTop: 10}}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.titleText}>Categories</Text> */}
      <FlatList
        data={categories}
        numColumns={3}
        renderItem={Item}
        scrollEnabled={scrollEnabled}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={flatHeader}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default React.memo(Categories);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
    // marginBottom: 90,
  },
  titleText: {
    marginLeft: 10,
    fontSize: normalize(FONTSIZE.xxSmall),
    fontWeight: 'bold',
    color: COLORS.black,
  },
  item: {
    flex: 1,
    maxWidth: width * 0.3,
    height: height * 0.15,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 8,
  },
  imageStyle: {
    width: width * 0.15,
    height: height * 0.1,
    resizeMode: 'contain',
  },
  titleStyle: {
    color: COLORS.black,
    fontSize: normalize(FONTSIZE.small),
    fontWeight: '500',
    textAlign: 'center',
  },
});
