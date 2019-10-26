import React, { Component } from "react";
import { Text, View, TouchableHighlight } from "react-native";
import globalStyles from "../pages/pageStyles/GlobalStyle";
import firebase from 'firebase';

const ADD_ITEM = "Go To Add Item Page"
const YOUR_LISTS = "Go To Your Lists Page"
const SIGN_OUT = "Sign Out"

const ADDITEMPAGE = "AddItemPage";
const YOURLISTSPAGE = "YourListsPage";


class HomePage extends Component {
  constructor(props) {
    super(props);
  }


  buttonListener = buttonId => {
    if (buttonId == ADD_ITEM) {
      this.props.navigation.navigate(ADDITEMPAGE);
    } else if (buttonId == SIGN_OUT) {
      firebase.auth().signOut();
    } else if (buttonId == YOUR_LISTS) {
      this.props.navigation.navigate(YOURLISTSPAGE);
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
          onPress={() => this.buttonListener(YOUR_LISTS)}
        >
          <Text style={globalStyles.whiteText}>{YOUR_LISTS}</Text>
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
