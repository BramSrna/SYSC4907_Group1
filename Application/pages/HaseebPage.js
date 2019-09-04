import React, { Component } from "react";
import { Text, View } from "react-native";
import styles from "./pageStyles/HaseebPageStyle";
import globalStyles from "../pages/pageStyles/GlobalStyle";

class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={globalStyles.defaultContainer}>
        <Text style={globalStyles.whiteText}>HaseebPage</Text>
      </View>
    );
  }
}

export default HomePage;
