import {COLORS, FONTSIZE, SHADOWS} from './theme';
import {Dimensions, PixelRatio, Platform} from 'react-native';
import icons from './icons';

const appName = 'Classified Ads';
const {width, height} = Dimensions.get('window');

// based on iphone 5s's scale
const scale = width / 320;

function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

export {icons, COLORS, FONTSIZE, SHADOWS, width, height, normalize, appName};
