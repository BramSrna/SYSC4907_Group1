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

export default class HomePage extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.whiteText}>HomePage</Text>
      </View>
    );
  }
}