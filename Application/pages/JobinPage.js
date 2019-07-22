import React, { Component } from "react";
import { Text, View } from "react-native";
import styles from "../pages/pageStyles/JobinPageStyle";

class JobinPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.whiteText}>JobinPage</Text>
      </View>
    );
  }
}

export default JobinPage;
