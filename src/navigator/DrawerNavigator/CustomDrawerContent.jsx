import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  FlatList,
  Share,
} from 'react-native';
import {COLORS, FONTSIZE} from '../../constant/theme.js';
import {
  appName,
  height,
  icons,
  normalize,
  width,
} from '../../constant/index.js';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import {drawerItemList} from '../../../data/data.js';

const DrawerItems = ({onPress, leftIcon, title}) => {
  return (
    <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
      <Image
        source={leftIcon}
        style={{
          width: 25,
          height: 25,
          marginRight: 10,
          tintColor: COLORS.white,
        }}
      />
      <Text style={styles.drawerText}>{title}</Text>
      <Image
        source={icons.next}
        style={{width: 20, height: 20, position: 'absolute', right: 10}}
      />
    </TouchableOpacity>
  );
};

const CustomDrawerContent = () => {
  const navigation = useNavigation();

  const onShare = async () => {
    await Share.share({
      url: 'https://googleplay-store.com',
      title: 'Share app With friends',
      message:
        'React Native | A framework for building native apps using React',
    });
  };

  const renderFlatItems = ({item}) => {
    return (
      <DrawerItems
        title={item?.title}
        leftIcon={item?.icon}
        onPress={() => {
          if (item?.screen == 'ShareApp') {
            onShare();
          } else {
            navigation.navigate(item?.screen);
          }
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}>
          <Image
            source={icons.close}
            style={{
              width: 20,
              height: 20,
              tintColor: COLORS.secondary,
              margin: 20,
              // position: 'absolute',
            }}
          />
        </Pressable>
        {/* <Image
          source={require('../../assets/logo-ecommerce.png')}
          style={{width: width * 0.5, height: 50, resizeMode: 'stretch'}}
        /> */}
        {/* <Text style={styles.title}>Classified Ads</Text> */}
      </View>
      <FlatList
        data={drawerItemList}
        renderItem={renderFlatItems}
        ListFooterComponent={<View style={{height: 10}} />}
      />
      <Text style={styles.copyRightTxt}>
        2023 © All right reserved by {appName}
      </Text>
    </View>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContent: {
    // alignItems: 'flex-start',
    // justifyContent: 'space-evenly',
    height: height * 0.08,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: COLORS.secondary,
  },
  drawerText: {
    fontSize: normalize(FONTSIZE.xxSmall),
    color: COLORS.black,
    fontWeight: 'bold',
  },
  copyRightTxt: {
    color: COLORS.black,
    fontSize: normalize(FONTSIZE.xxSmall),
    margin: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: normalize(FONTSIZE.xxLarge),
    color: COLORS.white,
    fontWeight: '700',
    textAlign: 'center',
  },
});
