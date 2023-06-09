import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';

import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Main from '../../screens/app/Main.jsx';
import AppHeader from '../../components/AppHeader.jsx';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const CustomDrawerContent = ({navigation}) => {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.drawerText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => navigation.navigate('Account')}>
          <Text style={styles.drawerText}>Account</Text>
        </TouchableOpacity>
        {/* Add more drawer items as needed */}
      </View>
    );
  };

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{headerShown: false}}>
      <Drawer.Screen name="Main" component={Main} />
      {/* <Drawer.Screen name="Article" component={Article} /> */}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  drawerItem: {
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  drawerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
