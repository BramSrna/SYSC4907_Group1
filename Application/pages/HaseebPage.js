import React, { Component } from "react";
import { Text, View } from "react-native";
import styles from "./pageStyles/HaseebPageStyle";

class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.whiteText}>HaseebPage</Text>
      </View>
    );
  }
}

export default HomePage;
