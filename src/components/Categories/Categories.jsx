import {
  FlatList,
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS, FONTSIZE} from '../../constant/theme.js';
import {height, normalize, width} from '../../constant/index.js';
import {itemData} from '../../../data/data.js';
import {useNavigation} from '@react-navigation/native';

const Categories = ({scrollEnabled}) => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const Item = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate('SubCategory', {item: item, category: true})
        }>
        <Image source={{uri: item.image}} style={styles.imageStyle} />
        <Text style={styles.titleStyle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Categories</Text>
      <FlatList
        data={itemData}
        numColumns={3}
        renderItem={Item}
        scrollEnabled={scrollEnabled}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default Categories;

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
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 8,
  },
  imageStyle: {
    width: 50,
    height: 50,
  },
  titleStyle: {
    color: COLORS.black,
    fontSize: normalize(FONTSIZE.small),
    fontWeight: '500',
    textAlign: 'center',
  },
});
