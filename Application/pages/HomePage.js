import React, { Component } from "react";
import { Text, View, TouchableHighlight } from "react-native";
import globalStyles from "../pages/pageStyles/GlobalStyle";
import firebase from 'firebase';

const ADD_ITEM_PAGE = "AddItemPage"
const MAP_CREATOR_PAGE = "MapCreatorPage"
const SIGN_OUT = "Sign Out"

class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  buttonListener = buttonId => {
    if (buttonId == ADD_ITEM_PAGE) {
      this.props.navigation.navigate("AddItemPage");
    } else if (buttonId == MAP_CREATOR_PAGE) {
      this.props.navigation.navigate("MapCreatorPage");
    } else if (buttonId == SIGN_OUT) {
      firebase.auth().signOut();
    }
  };

  render() {
    return (
      <View style={globalStyles.defaultContainer}>
        <Text style={globalStyles.whiteText}>HomePage</Text>

        <TouchableHighlight
          style={[globalStyles.defaultButtonContainer, globalStyles.defaultButton]}
          onPress={() => this.buttonListener(ADD_ITEM_PAGE)}
        >
          <Text style={globalStyles.whiteText}>{"Go To Add Item Page"}</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={[globalStyles.defaultButtonContainer, globalStyles.defaultButton]}
          onPress={() => this.buttonListener(MAP_CREATOR_PAGE)}
        >
          <Text style={globalStyles.whiteText}>{"Go To Map Creator Page"}</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={[globalStyles.defaultButtonContainer, globalStyles.defaultButton]}
          onPress={() => this.buttonListener(SIGN_OUT)}
        >
          <Text style={globalStyles.whiteText}>{SIGN_OUT}</Text>
        </TouchableHighlight>

      </View>
    );
  }
}

export default HomePage;
