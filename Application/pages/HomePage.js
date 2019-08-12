import React, { Component } from "react";
import { Text, View, BackHandler } from "react-native";
import styles from "../pages/pageStyles/HomePageStyle";

class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", function() {
      // Return true if you want to go back, false if want to ignore. This is for Android only.
      // return true;
      return false;
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.whiteText}>HomePage</Text>
      </View>
    );
  }
}

export default HomePage;
