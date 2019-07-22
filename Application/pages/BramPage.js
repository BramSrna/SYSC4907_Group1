import React, { Component } from "react";
import { Text, View } from "react-native";
import styles from "../pages/pageStyles/BramPageStyle";

class BramPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.whiteText}>BramPage</Text>
      </View>
    );
  }
}

export default BramPage;
