import React, { Component } from "react";
import { Text, View } from "react-native";
import styles from "./pageStyles/RegisterPageStyle";

class RegisterPage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.whiteText}>RegisterPage</Text>
      </View>
    );
  }
}

export default RegisterPage;
