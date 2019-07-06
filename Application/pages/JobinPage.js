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
import styles from '../pages/pageStyles/JobinPageStyle';

export default class JobinPage extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.whiteText}>JobinPage</Text>
      </View>
    );
  }
}