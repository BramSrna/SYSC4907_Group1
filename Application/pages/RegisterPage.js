import React, { Component } from "react";
import { Text, View } from "react-native";
import styles from "./pageStyles/RegisterPageStyle";
import globalStyles from "../pages/pageStyles/GlobalStyle";

class RegisterPage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={globalStyles.defaultContainer}>
        <Text style={globalStyles.whiteText}>RegisterPage</Text>
      </View>
    );
  }
}

export default RegisterPage;
