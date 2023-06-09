import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  COLORS,
  FONTSIZE,
  SHADOWS,
  height,
  icons,
  width,
} from '../../constant/index.js';
import {useNavigation} from '@react-navigation/native';

const Bottomtab = ({callBack, tabValue}) => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState(tabValue);

  const setTab = tab => {
    if (tab == 2) {
      setSelectedTab(0);
      navigation.navigate('Postad');
      return;
    }
    setSelectedTab(tab);
    callBack(tab);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.iconView}>
        <Pressable style={[styles.pressable]} onPress={() => setTab(0)}>
          <Image
            source={icons.home}
            style={[
              styles.icons,
              selectedTab == 0 && {tintColor: COLORS.tertiary},
            ]}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab == 0 && {color: COLORS.tertiary},
            ]}>
            Home
          </Text>
        </Pressable>
        <Pressable style={styles.pressable} onPress={() => setTab(1)}>
          <Image
            source={icons.search}
            style={[
              styles.icons,
              selectedTab == 1 && {tintColor: COLORS.tertiary},
            ]}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab == 1 && {color: COLORS.tertiary},
            ]}>
            Search
          </Text>
        </Pressable>

        <Pressable style={styles.pressable} onPress={() => setTab(2)}>
          <Image
            source={icons.plus}
            style={[
              styles.icons,
              selectedTab == 2 && {tintColor: COLORS.tertiary},
            ]}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab == 2 && {color: COLORS.tertiary},
            ]}>
            Post Ad
          </Text>
        </Pressable>
        {/* <Pressable style={[styles.pressable]} onPress={() => setTab(2)}>
          <View style={[styles.postAds, SHADOWS.medium]}>
            <Image
              source={icons.plus}
              style={[styles.icons, {tintColor: COLORS.white}]}
            />
          </View>
          <Text
            style={[
              styles.tabText,
              {bottom: 12},
              selectedTab == 2 && {color: COLORS.tertiary},
            ]}>
            Post Ad
          </Text>
        </Pressable> */}
        <Pressable style={styles.pressable} onPress={() => setTab(3)}>
          <Image
            source={icons.chat}
            style={[
              styles.icons,
              selectedTab == 3 && {tintColor: COLORS.tertiary},
            ]}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab == 3 && {color: COLORS.tertiary},
            ]}>
            Chats
          </Text>
        </Pressable>
        <Pressable style={styles.pressable} onPress={() => setTab(4)}>
          <Image
            source={icons.account}
            style={[
              styles.icons,
              selectedTab == 4 && {tintColor: COLORS.tertiary},
            ]}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab == 4 && {color: COLORS.tertiary},
            ]}>
            Account
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(Bottomtab);

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height * 0.09,
    backgroundColor: COLORS.lightWhite,
    position: 'absolute',
    bottom: 0,
  },
  iconView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  postAds: {
    bottom: 15,
    // marginBottom: -10,
    width: width * 0.147,
    borderRadius: width * 0.08,
    height: height * 0.07,
    backgroundColor: COLORS.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icons: {
    width: 25,
    height: 25,
    tintColor: COLORS.gray2,
    // alignSelf: 'center',
  },
  tabText: {
    fontSize: FONTSIZE.medium,
    fontWeight: '500',
  },
});
