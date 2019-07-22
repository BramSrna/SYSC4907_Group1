import React, { Component } from "react";
import { Text, View } from "react-native";
import styles from "../pages/pageStyles/HomePageStyle";

class HomePage extends Component {
  constructor(props) {
    super(props);
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
