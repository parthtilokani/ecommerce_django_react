import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useRef} from 'react';
import {
  COLORS,
  FONTSIZE,
  SHADOWS,
  height,
  normalize,
  width,
} from '../../../constant/index.js';
import GobackHeader from '../../../components/GobackHeader.jsx';
import ListGridAds from '../../../components/Ads/ListGridAds.jsx';

const StoreDetails = () => {
  const [showAll, setShowAll] = useState(false);
  const textRef = useRef(null);
  const maxLength = 50;

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const getTruncatedText = () => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  };
  const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
  tempor incididunt ut labore et dolore magna aliqua. Hac habitasse platea
  dictumst vestibulum rhoncus est pellentesque. Lorem dolor sed viverra
  ipsum nunc aliquet bibendum enim facilisis. Praesent tristique magna sit
  amet purus gravida quis blandit turpis. Orci eu lobortis elementum nibh.
  Ligula ullamcorper malesuada proin libero nunc consequat interdum
  varius. Sed id semper risus in hendrerit gravida rutrum quisque non.
  Orci nulla pellentesque dignissim enim sit amet venenatis urna cursus.
  Vivamus at augue eget arcu dictum. Facilisis leo vel fringilla est
  ullamcorper eget nulla facilisi. Aliquam eleifend mi in nulla posuere
  sollicitudin aliquam ultrices sagittis. Gravida dictum fusce ut placerat
  orci nulla pellentesque. Fringilla urna porttitor rhoncus dolor purus.
  Congue eu consequat ac felis.`;

  return (
    <SafeAreaView style={{flex: 1}}>
      <GobackHeader title={'Store Details'} bg />
      <ScrollView
        style={{margin: 5}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{alignItems: 'center'}}>
        <View style={[styles.detailHeaderView, SHADOWS.medium]}>
          <View style={{alignItems: 'center', height: height * 0.26}}>
            <Image
              source={require('../../../assets/background.png')}
              style={styles.bgImage}
            />
            <View style={styles.logoImageView}>
              <Image
                source={require('../../../assets/background.png')}
                style={styles.logoImage}
              />
            </View>
          </View>
          <View style={styles.detailHeaderBottomView}>
            <View style={{alignItems: 'center'}}>
              <Text style={{color: 'black'}}>Redius Theme</Text>
              <Text style={{color: 'black'}}>Member Since: 23 Aug, 2019</Text>
            </View>
            <View style={styles.seperatorView} />
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={styles.contactView}>
                {/* Contact Icon */}
                <Text style={{color: 'black'}}>Contact</Text>
              </View>
              <View style={styles.contactView}>
                {/* Contact Icon */}
                <Text style={{color: 'black'}}>Email</Text>
              </View>
              <View style={styles.contactView}>
                {/* Contact Icon */}
                <Text style={{color: 'black'}}>Website</Text>
              </View>
              {/* Social Media Icons  */}
            </View>
          </View>
        </View>

        <View style={[styles.descriptionView, SHADOWS.medium]}>
          <Text style={{color: 'black'}}>Description</Text>
          <View style={styles.seperatorView} />
          <View
            style={{
              width: width * 0.85,
            }}>
            <Text style={{color: 'black', alignSelf: 'center'}} ref={textRef}>
              {showAll ? text : getTruncatedText()}
            </Text>
            <TouchableOpacity
              onPress={toggleShowAll}
              style={{alignSelf: 'center'}}>
              <Text style={{color: 'black'}}>
                {text.length > maxLength && !showAll
                  ? 'Show More'
                  : 'Show Less'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.storeAddressView, SHADOWS.medium]}>
          <Text style={{color: 'black'}}>Store Address</Text>
          <View style={styles.seperatorView} />
          <Text style={{color: 'black'}}>Port Chester, New York</Text>
          <Text style={{color: 'black'}}>House#18, Road#07</Text>
        </View>
        <ListGridAds data={['1']} title={'Latest Ads'} />
      </ScrollView>
      <View style={styles.callAndEmailView}>
        <TouchableOpacity style={styles.touchableStyle}>
          <Text style={styles.btnText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableStyle}>
          <Text style={styles.btnText}>Email</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StoreDetails;

const styles = StyleSheet.create({
  detailHeaderView: {
    width: width * 0.9,
    height: height * 0.45,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  bgImage: {
    width: width * 0.9,
    height: height * 0.22,
    resizeMode: 'cover',
  },
  logoImageView: {
    backgroundColor: COLORS.gray2,
    height: 100,
    width: 100,
    borderRadius: width * 2,
    overflow: 'hidden',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.1232,
    position: 'absolute',
  },
  logoImage: {width: 100, height: 100, resizeMode: 'stretch'},
  descriptionView: {
    width: width * 0.9,
    padding: 10,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  detailHeaderBottomView: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  seperatorView: {
    width: width * 0.8,
    height: 1.5,
    margin: 5,
    backgroundColor: 'black',
  },
  contactView: {flexDirection: 'row', marginBottom: 5},
  storeAddressView: {
    width: width * 0.9,
    padding: 10,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  callAndEmailView: {
    position: 'absolute',
    bottom: 20,
    height: height * 0.06,
    width: width,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  touchableStyle: {
    height: height * 0.06,
    width: width * 0.3,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnText: {
    color: COLORS.white,
    fontSize: normalize(FONTSIZE.xxSmall),
  },
});
