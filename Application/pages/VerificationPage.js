import React, { Component } from "react";
import { Text, View } from "react-native";
import styles from "./pageStyles/VerificationPageStyle";
import globalStyles from "./pageStyles/GlobalStyle";

class VerificationPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={globalStyles.defaultContainer}>
        <Text style={globalStyles.whiteText}>JobinPage</Text>
      </View>
    );
  }
}

export default VerificationPage;
