const COLORS = {
  primary: '#191645',
  secondary: '#43C6AC',

  gray: '#83829A',
  gray2: '#C1C0C8',

  lightBlue: '#F0FAF9',

  white: '#FFFFFF',
  lightWhite: '#FAFAFC',

  black: '#000000',
};

const FONTSIZE = {
  xSmall: 10,
  small: 12,
  xxSmall: 14,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
};

const FONTFAMILY = {
  robotoRegular: 'Roboto-Regular',
  robotoItalic: 'Roboto-Italic',
};

const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};

export {COLORS, FONTSIZE, SHADOWS, FONTFAMILY};
