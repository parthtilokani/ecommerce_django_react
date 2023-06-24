import {FlatList, Pressable, StyleSheet, Text, View, Image} from 'react-native';
import React, {useState} from 'react';
import GridFlatAds from './GridFlatAds.jsx';
import ListFlatAds from './ListFlatAds.jsx';
import {COLORS, FONTSIZE, SHADOWS} from '../../constant/theme.js';
import icons from '../../constant/icons.js';
import {normalize, width} from '../../constant/index.js';

const ListGridAds = ({
  data,
  title,
  isChange,
  onChnagePress,
  changeLayoutStyle,
}) => {
  const [isGrid, setIsGrid] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.secondContainer}>
        <View style={styles.titleView}>
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
          {isChange && (
            <Text style={styles.changeText} onPress={onChnagePress}>
              Change
            </Text>
          )}
        </View>

        {changeLayoutStyle && (
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
        scrollEnabled={false}
        data={data}
        numColumns={isGrid ? 2 : 1}
        renderItem={() => (isGrid ? <GridFlatAds /> : <ListFlatAds />)}
        ListEmptyComponent={() => (
          <Text style={styles.flatListEmptyComponent}>
            Sorry, this store has no listing yet!
          </Text>
        )}
      />
    </View>
  );
};

export default ListGridAds;

const styles = StyleSheet.create({
  container: {marginBottom: 50, alignSelf: 'center'},
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
    padding: 5,
    borderRadius: 5,
  },
  icon: {
    width: 20,
    height: 20,
  },
  flatListEmptyComponent: {
    alignSelf: 'center',
    fontSize: normalize(FONTSIZE.small),
    color: COLORS.black,
  },
});
