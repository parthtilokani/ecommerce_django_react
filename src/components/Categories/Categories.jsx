import {FlatList, StyleSheet, Image, View, Text} from 'react-native';
import React from 'react';
import {COLORS, FONTSIZE} from '../../constant/theme.js';
import {height, width} from '../../constant/index.js';
import {itemData} from '../../../data/data.js';

const Categories = ({scrollEnabled}) => {
  const Item = ({item}) => {
    return (
      <View style={styles.item}>
        <Image source={{uri: item.image}} style={styles.imageStyle} />
        <Text style={styles.titleStyle}>{item.title}</Text>
      </View>
    );
  };

  return (
    <View>
      <Text>Categories</Text>
      <FlatList
        data={itemData}
        numColumns={3}
        renderItem={Item}
        scrollEnabled={scrollEnabled}
        // ListFooterComponent={<View style={{height: 100}} />}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  app: {
    flex: 4, // the number of columns you want to devide the screen into
    marginHorizontal: 'auto',
    width: 400,
  },
  item: {
    flex: 1,
    maxWidth: width * 0.3, // 100% devided by the number of rows you want
    // width: width * 0.07,
    height: height * 0.15,
    alignItems: 'center',
    justifyContent: 'center',

    // my visual styles; not important for the grid
    // padding: 10,
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
    fontSize: FONTSIZE.small,
    fontWeight: '500',
    textAlign: 'center',
    // flexShrink: 1,
  },
});
