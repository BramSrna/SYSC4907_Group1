import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert
} from 'react-native';
import styles from '../pages/pageStyles/HomePageStyle';


const HomePage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.whiteText}>HomePage</Text>
    </View>
  );
}

export default HomePage