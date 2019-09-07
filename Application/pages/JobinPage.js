import React, { Component } from "react";
import { Text, View } from "react-native";
import styles from "../pages/pageStyles/JobinPageStyle";
import globalStyles from "../pages/pageStyles/GlobalStyle";

class JobinPage extends Component {
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

export default JobinPage;
