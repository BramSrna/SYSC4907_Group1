import React, { Component } from "react";
import { Text, View, FlatList, Alert, BackHandler } from "react-native";
import styles from "./pageStyles/CurrentListPageStyle";

class CurrentList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listTitles: []
    };
  }
  GoBackToYourLists() {
    this.props.navigation.navigate("Your Lists");
  }

  componentDidMount() {
    this.setState({ listTitles: ["List One", "List Two", "List Three"] });
    BackHandler.addEventListener("hardwareBackPress", function() {
      // Return true if you want to go back, false if want to ignore. This is for Android only.
      // return true;
      return false;
    });
  }

  render() {
    return (
      <View style={styles.ListContainer}>
        <Text
          style={styles.backButton}
          onPress={this.GoBackToYourLists.bind(this)}
        >
          {"<<--Your Lists"}
        </Text>
      </View>
    );
  }
}

export default CurrentList;
