// import {useEffect} from 'react';
// import {StatusBar} from 'react-native';

// export function useStatusBarColor(color, barStyle = 'dark-content') {
//   useEffect(() => {
//     StatusBar.setBackgroundColor(color);
//     StatusBar.setBarStyle(barStyle);

//     return () => {
//       // Reset the status bar color and style when the component unmounts
//       StatusBar.setBackgroundColor(null);
//       StatusBar.setBarStyle('dark-content');
//     };
//   }, [color, barStyle]);
// }


import * as React from 'react';
import {  View,StatusBar } from 'react-native';
import { useSafeAreaInsets} from 'react-native-safe-area-context';


export  const CustomStatusBar = (
  {
    backgroundColor,
    barStyle = "dark-content",
  }
) => { 
   
   const insets = useSafeAreaInsets();

   return (
     <View style={{ height: insets.top, backgroundColor }}>
        <StatusBar
          animated={true}
          backgroundColor={backgroundColor}
          barStyle={barStyle} />
     </View>
   );
}


