import React from 'react';
import {View, ActivityIndicator, StyleSheet, Modal} from 'react-native';
import {COLORS} from '../../constant/theme.js';
import {height, width} from '../../constant/index.js';

const Loader = ({visible}) => {
  return (
    <Modal visible={visible} transparent>
      <View style={styles.container}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loaderContainer: {
    backgroundColor: '#FFFFFF',
    width: width * 0.8,
    height: height * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
  },
});

export default React.memo(Loader);
