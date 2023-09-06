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
          width: width * 0.05,
          height: height * 0.025,
          marginRight: 10,
          tintColor: COLORS.white,
          resizeMode: 'contain',
        }}
      />
      <Text style={styles.drawerText}>{title}</Text>
      <Image
        source={icons.next}
        style={{
          width: width * 0.05,
          height: height * 0.025,
          position: 'absolute',
          right: 10,
        }}
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
          style={{
            width: width * 0.06,
            height: height * 0.03,
            margin: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}>
          <Image
            source={icons.close}
            style={{
              width: width * 0.05,
              height: height * 0.025,
              tintColor: COLORS.secondary,
              // position: 'absolute',
            }}
          />
        </Pressable>
      </View>
      <FlatList
        data={drawerItemList}
        renderItem={renderFlatItems}
        ListFooterComponent={<View style={{height: 10}} />}
      />
      <Text style={styles.copyRightTxt}>© All right reserved by {appName}</Text>
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
