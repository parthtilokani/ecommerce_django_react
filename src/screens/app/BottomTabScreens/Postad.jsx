import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, {useState} from 'react';
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
import {postAdData} from '../../../../data/data.js';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

const Postad = ({navigation}) => {
  const [state, setState] = useState({isVisible: false, visibleId: 0});
  const dropdownHeight = useSharedValue(0);

  const handlePress = idx => {
    setState(prevState => ({
      isVisible: !prevState.isVisible,
      visibleId: idx,
    }));

    dropdownHeight.value = withTiming(state.isVisible ? 0 : height * 0.03, {
      duration: 200,
      easing: Easing.inOut(Easing.ease),
    });
  };

  const dropdownStyle = useAnimatedStyle(() => {
    return {
      height: dropdownHeight.value,
    };
  });

  const renderFlatItems = ({item, index}) => {
    return (
      <View style={[styles.categoryMainContainer, SHADOWS.small]}>
        <TouchableOpacity
          key={index}
          style={styles.categoryView}
          onPress={() => handlePress(index)}>
          <View style={styles.categoryInnerView}>
            <Image source={icons.home} style={styles.icon} />
            <Text numberOfLines={1} style={styles.categoryText}>
              {item?.category}
            </Text>
          </View>

          <Image
            source={
              state.isVisible && state.visibleId == index
                ? icons.minus
                : icons.plus
            }
            style={styles.rightIcon}
          />
        </TouchableOpacity>
        {item?.subCategory?.map((item, idx) => {
          return (
            <Animated.View
              key={idx}
              style={[
                {
                  display:
                    state.isVisible && state.visibleId == index
                      ? 'flex'
                      : 'none',
                },
                styles.dropDownView,
                dropdownStyle,
              ]}>
              <TouchableOpacity
                onPress={() => {
                  // setState({isVisible: false, visibleId: 0});
                  navigation.navigate('PostAdDetails');
                }}>
                <Text style={styles.subCategoryTitle}>{item?.title}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
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
          }}>
          Choose Category
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <GobackHeader bg resetBack title={'Post Your Ads'} />
      <View style={styles.flatListMainView}>
        <FlatList
          data={postAdData}
          keyExtractor={(item, index) => index}
          // removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
          renderItem={renderFlatItems}
          ListHeaderComponent={flatHeader}
          ListHeaderComponentStyle={{
            backgroundColor: COLORS.lightWhite,
            padding: 10,
          }}
          stickyHeaderIndices={[0]}
          ListFooterComponent={() => <View style={{height: height * 0.1}} />}
        />
      </View>
    </SafeAreaView>
  );
};

export default Postad;

const styles = StyleSheet.create({
  flatListMainView: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    // borderRadius: 10,
  },
  categoryMainContainer: {
    backgroundColor: COLORS.lightWhite,
    justifyContent: 'center',
    width: width * 0.85,
    padding: 5,
    paddingVertical: 7,
    margin: 10,
    borderRadius: 10,
  },
  categoryView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryInnerView: {flexDirection: 'row', alignItems: 'center', padding: 10},
  icon: {
    marginHorizontal: 5,
    width: width * 0.06,
    height: height * 0.03,
    resizeMode: 'contain',
    tintColor: COLORS.black,
  },
  rightIcon: {
    marginRight: 20,
    width: width * 0.035,
    height: height * 0.035,
    resizeMode: 'contain',
    tintColor: COLORS.black,
  },
  searchTextInput: {
    // fontSize: FONTSIZE.medium,
    color: COLORS.black,
    borderRadius: 10,
    width: width * 0.64,
    height: height * 0.054,
    backgroundColor: COLORS.gray2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropDownView: {
    backgroundColor: COLORS.lightWhite,
    justifyContent: 'center',
    marginVertical: 5,
  },
  categoryText: {
    fontSize: normalize(FONTSIZE.xxSmall),
    color: COLORS.black,
    marginLeft: 10,
    fontWeight: '500',
    width: width * 0.55,
  },
  subCategoryTitle: {
    fontSize: normalize(FONTSIZE.xxSmall),
    color: COLORS.black,
    marginLeft: 15,
  },
});
