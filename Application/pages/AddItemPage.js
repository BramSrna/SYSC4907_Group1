import React, { Component } from "react";
import { Text, View } from "react-native";
import styles from "./pageStyles/AddItemPageStyle";

class AddItemPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.whiteText}>AddItemPage</Text>
      </View>
    );
  }
}

export default AddItemPage;
