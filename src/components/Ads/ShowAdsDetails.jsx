import React, {useRef, useState} from 'react';
import {
  View,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Linking,
} from 'react-native';
import GobackHeader from '../GobackHeader.jsx';
import {
  COLORS,
  FONTSIZE,
  height,
  icons,
  normalize,
  width,
} from '../../constant/index.js';
import {useRoute} from '@react-navigation/native';
import {baseURL} from '../../utils/Api.js';
import {getPostAge} from '../../utils/supportFunctions.js';
import Ionicons from 'react-native-vector-icons/Ionicons.js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons.js';
import {measure} from 'react-native-reanimated';

const ShowAdsDetails = () => {
  const {
    params: {data, isMyAds},
  } = useRoute();
  // const data = [
  //   {id: '1', imageUrl: 'https://source.unsplash.com/user/c_v_r/1900x800'},
  //   {id: '2', imageUrl: 'https://source.unsplash.com/user/c_v_r/100x100'},
  //   {
  //     id: '3',
  //     imageUrl:
  //       'https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200',
  //   },
  //   {
  //     id: '4',
  //     imageUrl:
  //       'https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200',
  //   },
  //   {
  //     id: '5',
  //     imageUrl:
  //       'https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200',
  //   },
  //   {
  //     id: '6',
  //     imageUrl:
  //       'https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200',
  //   },
  //   {
  //     id: '7',
  //     imageUrl:
  //       'https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200',
  //   },
  //   {
  //     id: '8',
  //     imageUrl:
  //       'https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200',
  //   },
  //   {
  //     id: '9',
  //     imageUrl:
  //       'https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200',
  //   },
  //   {
  //     id: '10',
  //     imageUrl:
  //       'https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200',
  //   },
  //   {
  //     id: '11',
  //     imageUrl:
  //       'https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200',
  //   },
  //   {
  //     id: '12',
  //     imageUrl:
  //       'https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200',
  //   },
  //   // Add more image objects as needed
  // ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileNumber, setMobileNumber] = useState('');
  const [whatsAppMsg, setWhatsAppMsg] = useState(
    'Hi, I am interested in your ad posting',
  );
  const scrollX = useRef(new Animated.Value(0)).current;
  const onViewRef = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });
  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});

  const renderItem = ({item}) => {
    const imageUri = item?.image;
    // let imageUri;
    // if (data?.ads_image[0].image.includes(baseURL.replace('/api', ''))) {
    //   imageUri = data?.ads_image[0]?.image;
    // } else {
    //   imageUri = `${baseURL.replace('/api', data?.ads_image[0]?.image)}`;
    // }
    // console.log(imageUri);
    return (
      <View style={styles.imageContainer}>
        {loading && (
          <ActivityIndicator style={styles.loadingIndicator} color={'black'} />
        )}
        <Image
          source={{uri: imageUri}}
          style={styles.image}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
      </View>
    );
  };
  const handleNext = () => {
    if (currentIndex < data?.ads_image?.length - 1) {
      setCurrentIndex(currentIndex + 1);
      flatListRef.current.scrollToIndex({index: currentIndex + 1});
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      flatListRef.current.scrollToIndex({index: currentIndex - 1});
    }
  };

  const initiateWhatsApp = () => {
    if (!data?.create_user?.phone_no)
      return alert('The ad owner has not provided his phone number');
    let url =
      'whatsapp://send?text=' +
      whatsAppMsg +
      '&phone=91' +
      data?.create_user?.phone_no;
    Linking.openURL(url)
      .then(data => {
        console.log('WhatsApp Opened');
      })
      .catch(() => {
        alert('Make sure Whatsapp installed on your device');
      });
  };

  const flatListRef = useRef(null);
  return (
    <SafeAreaView style={{flex: 1}}>
      <GobackHeader bg title={'Ad Details'} />
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={data?.ads_image}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={Dimensions.get('window').width}
          snapToAlignment="start"
          decelerationRate="fast"
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: false},
          )}
        />
        {data?.ads_image.length > 1 && (
          <>
            <TouchableOpacity
              style={styles.buttonPrev}
              onPress={handlePrev}
              disabled={currentIndex == 0}>
              <Text style={styles.buttonText}>Prev</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonNext}
              onPress={handleNext}
              disabled={currentIndex === data?.ads_image.length - 1}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <View style={styles.indicatorContainer}>
        <Text style={{color: COLORS.black}}>
          {currentIndex + 1}/
          {data?.ads_image.length > 0 ? data?.ads_image.length : '1'}
        </Text>
      </View>
      <ScrollView style={{flex: 1, marginBottom: 55}}>
        <View style={{marginHorizontal: 10, marginTop: 10}}>
          <Text
            style={{
              color: COLORS.black,
              fontSize: normalize(17),
              fontWeight: '700',
              marginLeft: 10,
            }}>
            {data?.ad_title}
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                marginLeft: 10,
                width: width * 0.65,
                fontWeight: '500',
                color: COLORS.black,
                // backgroundColor: 'red',
                // textAlign: 'right',
              }}
              numberOfLines={1}>
              {data?.location || 'No Loaction'}
            </Text>
            <Text
              style={{
                fontWeight: '500',
                color: COLORS.black,
                textAlign: 'right',
              }}>
              {getPostAge(data?.posted_on)}
            </Text>
          </View>
        </View>
        <View
          style={{
            width: width * 0.95,
            height: 1,
            backgroundColor: COLORS.gray,
            marginVertical: 10,
            alignSelf: 'center',
          }}
        />

        <View style={{marginHorizontal: 10, marginVertical: 10}}>
          <View style={{flexDirection: 'row'}}>
            <MaterialIcons name="category" size={20} color={COLORS.black} />

            <Text
              style={{
                color: COLORS.black,
                fontSize: normalize(FONTSIZE.xxSmall),
                fontWeight: '500',
                marginLeft: 5,
              }}>
              Category
            </Text>
          </View>
          <Text
            style={{
              color: COLORS.black,
              fontSize: normalize(FONTSIZE.xxSmall),
              marginLeft: 25,
            }}>
            {data?.category_name}
          </Text>
        </View>

        <View style={{marginHorizontal: 10, marginVertical: 10}}>
          <View style={{flexDirection: 'row'}}>
            <MaterialIcons name="category" size={20} color={COLORS.black} />

            <Text
              style={{
                color: COLORS.black,
                fontSize: normalize(FONTSIZE.xxSmall),
                fontWeight: '500',
                marginLeft: 5,
              }}>
              Sub Category
            </Text>
          </View>
          <Text
            style={{
              color: COLORS.black,
              fontSize: normalize(FONTSIZE.xxSmall),
              marginLeft: 25,
            }}>
            {data?.sub_category_name}
          </Text>
        </View>

        {data?.create_user?.name && (
          <View style={{marginHorizontal: 10, marginVertical: 10}}>
            <View style={{flexDirection: 'row'}}>
              <Image source={icons.owner} style={{width: 20, height: 20}} />
              <Text
                style={{
                  color: COLORS.black,
                  fontSize: normalize(FONTSIZE.xxSmall),
                  fontWeight: '500',
                  marginLeft: 5,
                }}>
                Created User
              </Text>
            </View>
            <Text
              style={{
                color: COLORS.black,
                fontSize: normalize(FONTSIZE.xxSmall),
                marginLeft: 25,
              }}>
              {data?.create_user?.name}
            </Text>
          </View>
        )}

        <View style={{marginHorizontal: 10}}>
          <View style={{flexDirection: 'row'}}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={COLORS.black}
            />

            <Text
              style={{
                color: COLORS.black,
                fontSize: normalize(FONTSIZE.xxSmall),
                fontWeight: '500',
                marginLeft: 5,
              }}>
              About the Product
            </Text>
          </View>
          <Text
            style={{
              color: COLORS.black,
              fontSize: normalize(FONTSIZE.xxSmall),
              marginLeft: 25,
            }}>
            {data?.ad_description}
          </Text>
        </View>
      </ScrollView>
      {!isMyAds && (
        <View
          style={{
            backgroundColor: COLORS.white,
            height: 65,
            width: width,
            justifyContent: 'center',
            position: 'absolute',
            bottom: 0,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: 30,
            }}>
            <Text
              style={{
                fontWeight: '700',
                fontSize: normalize(17),
                color: COLORS.black,
              }}>
              {data?.create_user?.phone_no}
            </Text>
            <TouchableOpacity
              style={{
                width: width * 0.3,
                height: height * 0.05,
                borderRadius: 10,
                backgroundColor: 'green',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                alignSelf: 'center',
                flexDirection: 'row',
              }}
              onPress={initiateWhatsApp}>
              <Ionicons name="logo-whatsapp" size={20} color={COLORS.white} />
              <Text
                style={{
                  color: COLORS.white,
                  fontWeight: '700',
                  fontSize: normalize(FONTSIZE.medium),
                  marginRight: 5,
                }}>
                Chat
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    position: 'relative',
  },
  imageContainer: {
    width: width,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray2,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  indicatorContainer: {
    marginTop: 10,
    width: 40,
    height: 40,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    position: 'absolute',
    top: height * 0.3,
    left: width * 0.8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: 'gray',
  },
  activeIndicator: {
    backgroundColor: 'blue',
  },
  inactiveIndicator: {
    backgroundColor: 'lightgray',
  },
  buttonPrev: {
    position: 'absolute',
    top: '45%',
    left: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  buttonNext: {
    position: 'absolute',
    top: '45%',
    right: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingIndicator: {
    position: 'absolute',
  },
});

export default ShowAdsDetails;
