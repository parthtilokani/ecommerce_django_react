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
  normalize,
  width,
} from '../../constant/index.js';
import {useNavigation} from '@react-navigation/native';
import {FONTFAMILY} from '../../constant/theme.js';
import {retrieveUserSession} from '../../utils/AsyncStorage/userSession.js';

const Bottomtab = ({callBack, tabValue}) => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState(tabValue);

  const setTab = async tab => {
    if (tab == 2) {
      setSelectedTab(0);
      navigation.navigate('Postad');
      return;
    }
    if (tab == 4) {
      // setSelectedTab(4);
      const userToken = await retrieveUserSession('userToken');
      if (!userToken?.access || !userToken?.refresh)
        return navigation.navigate('SignIn');
    }
    setSelectedTab(tab);
    callBack(tab);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.iconView}>
        <Pressable
          style={[
            styles.pressable,
            selectedTab == 0 && {backgroundColor: COLORS.secondary},
          ]}
          onPress={() => setTab(0)}>
          <Image
            source={icons.home}
            style={[
              styles.icons,
              selectedTab == 0 && {tintColor: COLORS.primary},
            ]}
          />
          {selectedTab == 0 ? null : (
            <Text
              style={[
                styles.tabText,
                selectedTab == 0 && {color: COLORS.primary},
              ]}>
              Home
            </Text>
          )}
        </Pressable>
        {/* <Pressable style={styles.pressable} onPress={() => setTab(1)}>
          <Image
            source={icons.search}
            style={[
              styles.icons,
              selectedTab == 1 && {tintColor: COLORS.primary},
            ]}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab == 1 && {color: COLORS.primary},
            ]}>
            Search
          </Text>
        </Pressable> */}

        <Pressable
          style={[
            styles.pressable,
            selectedTab == 2 && {backgroundColor: COLORS.secondary},
          ]}
          onPress={() => setTab(2)}>
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
              selectedTab == 2 && {color: COLORS.primary},
            ]}>
            {selectedTab == 2 ? '' : 'Post Ad'}
          </Text>
        </Pressable>
        {/* <Pressable style={styles.pressable} onPress={() => setTab(3)}>
          <Image
            source={icons.chat}
            style={[
              styles.icons,
              selectedTab == 3 && {tintColor: COLORS.primary},
            ]}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab == 3 && {color: COLORS.primary},
            ]}>
            Chats
          </Text>
        </Pressable> */}
        <Pressable
          style={[
            styles.pressable,
            selectedTab == 4 && {backgroundColor: COLORS.secondary},
          ]}
          onPress={() => setTab(4)}>
          <Image
            source={icons.account}
            style={[
              styles.icons,
              selectedTab == 4 && {tintColor: COLORS.primary},
            ]}
          />
          {selectedTab == 4 ? null : (
            <Text
              style={[
                styles.tabText,
                selectedTab == 4 && {color: COLORS.primary},
              ]}>
              Account
            </Text>
          )}
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
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.2,
    height: height * 0.067,
    borderRadius: 30,
  },
  postAds: {
    bottom: 12,
    padding: 13,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icons: {
    width: 25,
    height: 25,
    tintColor: COLORS.gray2,
  },
  tabText: {
    fontFamily: FONTFAMILY.robotoRegular,
    fontSize: normalize(FONTSIZE.xxSmall),
    color: COLORS.black,
    fontWeight: '500',
  },
});
