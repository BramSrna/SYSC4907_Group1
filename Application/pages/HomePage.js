import React, { Component } from "react";
import { Text, View, TouchableHighlight } from "react-native";
import globalStyles from "../pages/pageStyles/GlobalStyle";
import firebase from 'firebase';

const ADD_ITEM = "Go To Add Item Page"
const SIGN_OUT = "Sign Out"

const ADDITEMPAGE = "AddItemPage";


class HomePage extends Component {
  constructor(props) {
    super(props);
  }


  buttonListener = buttonId => {
    if (buttonId == ADD_ITEM) {
      this.props.navigation.navigate(ADDITEMPAGE);
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
          onPress={() => this.buttonListener(ADD_ITEM)}
        >
          <Text style={globalStyles.whiteText}>{ADD_ITEM}</Text>
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
