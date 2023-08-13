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
import {useNavigation} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import {getCategory} from '../../utils/customHook/backEndCalls.js';
import {axiosOpen} from '../../utils/axios.js';
import Loader from '../Loader/Loader.jsx';

const Categories = ({scrollEnabled}) => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchQueries, setFetchedQueries] = useState([false]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const {data: categories, error: error} = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      setLoading(true);
      const data = await axiosOpen('ads/category');
      setFetchedQueries(prev => {
        prev[0] = true;
        return [...prev];
      });
      setLoading(false);
      return data?.data || [];
    },
    enabled: !fetchQueries[0],
  });

  const Item = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.item}
        // onPress={() => navigation.navigate('Category', {item: item})}
      >
        <Image source={{uri: item.icon}} style={styles.imageStyle} />
        <Text style={styles.titleStyle}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  console.log(categories);

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
          {categories?.length >= 1 ? 'Category' : 'Category Data not found'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Loader visible={loading} />
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
