import React, { Component } from "react";
import { Text, View, TouchableHighlight } from "react-native";
import globalStyles from "../pages/pageStyles/GlobalStyle";
import firebase from 'firebase';
import Menu from "./Menu"

const ADD_ITEM = "Go To Add Item Page"
const YOUR_LISTS = "Go To Your Lists Page"
const MAP_CREATOR = "Go To Map Creator Page"
const SIGN_OUT = "Sign Out"
const ADDITEMPAGE = "AddItemPage";
const YOURLISTSPAGE = "YourListsPage";
const MAPCREATORPAGE = "MapCreatorPage";


class HomePage extends Component {
  constructor(props) {
    super(props);
  }


  buttonListener = buttonId => {
    if (buttonId == ADD_ITEM) {
      this.props.navigation.navigate(ADDITEMPAGE);
    } else if (buttonId == MAP_CREATOR) {
      this.props.navigation.navigate(MAPCREATORPAGE);
    } else if (buttonId == SIGN_OUT) {
      firebase.auth().signOut();
    } else if (buttonId == YOUR_LISTS) {
      this.props.navigation.navigate(YOURLISTSPAGE);
    }
  };

  render() {
    return (
      <React.Fragment>
        <Menu toggleAction={() => this.props.navigation.toggleDrawer()} />
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
            onPress={() => this.buttonListener(MAP_CREATOR)}
          >
            <Text style={globalStyles.whiteText}>{MAP_CREATOR}</Text>
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
      </React.Fragment>
    );
  }
}

export default HomePage;
