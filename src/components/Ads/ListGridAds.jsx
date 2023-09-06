import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import GridFlatAds from './GridFlatAds.jsx';
import ListFlatAds from './ListFlatAds.jsx';
import {COLORS, FONTSIZE, SHADOWS} from '../../constant/theme.js';
import icons from '../../constant/icons.js';
import {height, normalize, width} from '../../constant/index.js';
import GobackHeader from '../GobackHeader.jsx';
import Button from '../Button/Button.jsx';

const ListGridAds = ({
  data,
  title,
  isChange,
  onChnagePress,
  changeLayoutStyle,
  scrollEnabled,
  pagination,
  nextPage,
  prevPage,
  onNextPress,
  onPrevPress,
  editDelete,
  deleteAds,
  isLoading,
}) => {
  const [isGrid, setIsGrid] = useState(false);
  const renderFooter = () => {
    if (data && pagination) {
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 15,
            marginVertical: 10,
            marginBottom: height * 0.05,
          }}>
          <Button
            text={'Prev'}
            style={{width: width * 0.3}}
            onPress={onPrevPress}
            disable={nextPage}
          />
          <Button
            text={'Next'}
            style={{width: width * 0.3}}
            onPress={onNextPress}
            disable={prevPage}
          />
        </View>
      );
    } else {
      return (
        <View
          style={{
            height: Platform.OS == 'android' ? height * 0.1 : 0,
          }}
        />
      );
    }
  };
  console.log(isLoading);

  if (isLoading)
    return (
      <ActivityIndicator
        size={'large'}
        color={COLORS.primary}
        style={{alignSelf: 'center', marginTop: 30}}
      />
    );

  return (
    <SafeAreaView>
      {/* <GobackHeader bg title={'Ads'} /> */}
      <View style={styles.container}>
        <View style={styles.secondContainer}>
          <View style={styles.titleView}>
            <Text style={styles.titleText} numberOfLines={1}>
              {title}
            </Text>
            {/* {isChange && (
            <Text style={styles.changeText} onPress={onChnagePress}>
              Change
            </Text>
          )} */}
          </View>

          {changeLayoutStyle && data?.length >= 1 && (
            <View style={{flexDirection: 'row'}}>
              <Pressable
                onPress={() => setIsGrid(true)}
                style={[
                  styles.iconView,
                  SHADOWS.small,
                  {
                    backgroundColor: isGrid
                      ? COLORS.secondary
                      : COLORS.lightWhite,
                  },
                ]}>
                <Image
                  source={icons.grid_view}
                  style={[
                    styles.icon,
                    {tintColor: isGrid ? COLORS.white : COLORS.gray},
                  ]}
                />
              </Pressable>
              <Pressable
                onPress={() => setIsGrid(false)}
                style={[
                  styles.iconView,
                  SHADOWS.small,
                  {
                    backgroundColor: !isGrid
                      ? COLORS.secondary
                      : COLORS.lightWhite,
                  },
                ]}>
                <Image
                  source={icons.list_view}
                  style={[
                    styles.icon,
                    {tintColor: !isGrid ? COLORS.white : COLORS.gray},
                  ]}
                />
              </Pressable>
            </View>
          )}
        </View>
        <FlatList
          key={isGrid ? 1 : 2}
          scrollEnabled={scrollEnabled}
          data={data}
          numColumns={isGrid ? 2 : 1}
          renderItem={({item, index}) => {
            return isGrid ? (
              <GridFlatAds
                data={item}
                index={index}
                deleteAds={deleteAds}
                editDelete={editDelete}
                isMyAds={title === 'My Ads'}
              />
            ) : (
              <ListFlatAds
                data={item}
                index={index}
                deleteAds={deleteAds}
                editDelete={editDelete}
                isMyAds={title === 'My Ads'}
              />
            );
          }}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={() => (
            <Text style={styles.flatListEmptyComponent}>
              Sorry, there has no listing yet!
            </Text>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default ListGridAds;

const styles = StyleSheet.create({
  container: {marginBottom: 90, alignSelf: 'center'},
  secondContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width * 0.95,
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  titleText: {
    maxWidth: width * 0.45,
    fontSize: normalize(FONTSIZE.xxSmall),
    fontWeight: 'bold',
    color: COLORS.black,
  },
  changeText: {
    marginHorizontal: 10,
    fontSize: normalize(FONTSIZE.xxSmall),
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  iconView: {
    marginHorizontal: 10,
    padding: 7,
    borderRadius: 5,
  },
  icon: {
    width: width * 0.05,
    height: height * 0.027,
    resizeMode: 'contain',
  },
  flatListEmptyComponent: {
    alignSelf: 'center',
    marginVertical: 10,
    fontSize: normalize(FONTSIZE.small),
    color: COLORS.black,
  },
});
