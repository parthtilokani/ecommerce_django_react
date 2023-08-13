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
} from 'react-native';
import GobackHeader from '../GobackHeader.jsx';
import {COLORS, width} from '../../constant/index.js';

const ShowAdsDetails = () => {
  const data = [
    {id: '1', imageUrl: 'https://source.unsplash.com/user/c_v_r/1900x800'},
    {id: '2', imageUrl: 'https://source.unsplash.com/user/c_v_r/100x100'},
    {
      id: '3',
      imageUrl:
        'https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200',
    },
    {
      id: '4',
      imageUrl:
        'https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200',
    },
    {
      id: '5',
      imageUrl:
        'https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200',
    },
    {
      id: '6',
      imageUrl:
        'https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200',
    },
    {
      id: '7',
      imageUrl:
        'https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200',
    },
    {
      id: '8',
      imageUrl:
        'https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200',
    },
    {
      id: '9',
      imageUrl:
        'https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200',
    },
    {
      id: '10',
      imageUrl:
        'https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200',
    },
    {
      id: '11',
      imageUrl:
        'https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200',
    },
    {
      id: '12',
      imageUrl:
        'https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200',
    },
    // Add more image objects as needed
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const scrollX = useRef(new Animated.Value(0)).current;
  const onViewRef = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });
  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});

  const renderItem = ({item}) => (
    <View style={styles.imageContainer}>
      {loading && (
        <ActivityIndicator style={styles.loadingIndicator} color={'black'} />
      )}
      <Image
        source={{uri: item.imageUrl}}
        style={styles.image}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
    </View>
  );

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
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

  const flatListRef = useRef(null);
  return (
    <SafeAreaView>
      <GobackHeader bg title={'Ad Details'} />
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={data}
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
        <TouchableOpacity
          style={styles.buttonPrev}
          onPress={handlePrev}
          disabled={currentIndex == 0}>
          <Text style={styles.buttonText}>Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonNext}
          onPress={handleNext}
          disabled={currentIndex === data.length - 1}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.indicatorContainer}>
        {data.map((_, index) => {
          const indicatorStyle =
            index === currentIndex
              ? styles.activeIndicator
              : styles.inactiveIndicator;
          return (
            <Animated.View
              key={index}
              style={[styles.indicator, indicatorStyle]}
            />
          );
        })}
      </View>
      <View style={{marginHorizontal: 10}}>
        <Text>Title</Text>
        <Text>Soosad</Text>
      </View>
      <View
        style={{
          width: width * 0.9,
          height: 1,
          backgroundColor: COLORS.gray,
          marginVertical: 10,
          alignSelf: 'center',
        }}
      />
      <View style={{marginHorizontal: 10}}>
        <Text>Listed By : </Text>
        <Text>Steve</Text>
      </View>
      <View
        style={{
          width: width * 0.9,
          height: 1,
          backgroundColor: COLORS.gray,
          marginVertical: 10,
          alignSelf: 'center',
        }}
      />
      <View style={{marginHorizontal: 10}}>
        <Text>Location : </Text>
        <Text>Mumbai</Text>
      </View>
      <View
        style={{
          width: width * 0.9,
          height: 1,
          backgroundColor: COLORS.gray,
          marginVertical: 10,
          alignSelf: 'center',
        }}
      />
      <View style={{marginHorizontal: 10}}>
        <Text>Description : </Text>
        <Text>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    position: 'relative',
  },
  imageContainer: {
    width: Dimensions.get('window').width,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
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
