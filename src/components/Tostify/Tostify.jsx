import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import ToastManager, {Toast} from 'toastify-react-native';

const Tostify = ({message}) => {
  //   const showToasts = () => {
  //     Toast.info(message);
  //   };

  return (
    <View style={styles.container}>
      <ToastManager />
      <TouchableOpacity
        onPress={showToasts}
        style={{
          backgroundColor: 'white',
          borderColor: 'green',
          borderWidth: 1,
          padding: 10,
        }}>
        <Text>SHOW SOME AWESOMENESS!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Tostify;
