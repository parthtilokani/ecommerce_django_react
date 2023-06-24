module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./src/assets/fonts/'],
  /*To avoid When using auto linking, it will automatically add all fonts to the Build Phases, 
   Copy Pods Resources. Which will end up in your bundle. */
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null,
      },
    },
  },
};
