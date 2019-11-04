import React, { Component } from "react";
import { Text, View, TouchableHighlight } from "react-native";
import globalStyles from "../pages/pageStyles/GlobalStyle";
import firebase from 'firebase';
import Menu from "./Menu"

const YOUR_LISTS = "Go To Your Lists Page"
const CROWD_SOURCE = "Go To Crowd Source Page"
const SIGN_OUT = "Sign Out"

const YOUR_LISTS_PAGE = "YourListsPage";
const CROWD_SOURCE_PAGE = "CrowdSourcePage";



class HomePage extends Component {
  constructor(props) {
    super(props);
  }


  buttonListener = buttonId => {
    if (buttonId == CROWD_SOURCE) {
      this.props.navigation.navigate(CROWD_SOURCE_PAGE);
    } else if (buttonId == SIGN_OUT) {
      firebase.auth().signOut();
    } else if (buttonId == YOUR_LISTS) {
      this.props.navigation.navigate(YOUR_LISTS_PAGE);
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
            onPress={() => this.buttonListener(CROWD_SOURCE)}
          >
            <Text style={globalStyles.whiteText}>{CROWD_SOURCE}</Text>
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
