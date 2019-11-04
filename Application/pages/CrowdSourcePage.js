import React, { Component } from "react";
import { Text, View, TouchableHighlight } from "react-native";
import globalStyles from "../pages/pageStyles/GlobalStyle";
import Menu from "./Menu"

// Text to display on the buttons
const REGISTER_ITEM = "Go To Register Item Page"
const ADD_ITEM_LOCATION = "Go To Add Item Location Page"
const MAP_CREATOR = "Go To Map Creator Page"

// Strings for controlling navigation
const REGISTER_ITEM_PAGE = "RegisterItemPage";
const ADD_ITEM_LOCATION_PAGE = "AddItemLocationPage";
const MAP_CREATOR_PAGE = "MapCreatorPage";

class CrowdSourcePage extends Component {
  constructor(props) {
    super(props);
  }

  /**
   * buttonListener
   * 
   * The listener for button presses.
   * Navigates to the new screen corresponding
   * to the button that was pressed.
   * 
   * @param {String}  buttonId  The ID of the button pressed
   * 
   * @returns None
   */
  buttonListener = buttonId => {
    if (buttonId == REGISTER_ITEM) {
      this.props.navigation.navigate(REGISTER_ITEM_PAGE);
    } else if (buttonId == MAP_CREATOR) {
      this.props.navigation.navigate(MAP_CREATOR_PAGE);
    } else if (buttonId == ADD_ITEM_LOCATION) {
      this.props.navigation.navigate(ADD_ITEM_LOCATION_PAGE);
    }
  };

  render() {
    return (
      <React.Fragment>
        <Menu toggleAction={() => this.props.navigation.toggleDrawer()} />
        <View style={globalStyles.defaultContainer}>
          <Text style={globalStyles.whiteText}>Crowd Sourcing Options</Text>

          <TouchableHighlight
            style={[globalStyles.defaultButtonContainer, globalStyles.defaultButton]}
            onPress={() => this.buttonListener(REGISTER_ITEM)}
          >
            <Text style={globalStyles.whiteText}>{REGISTER_ITEM}</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={[globalStyles.defaultButtonContainer, globalStyles.defaultButton]}
            onPress={() => this.buttonListener(ADD_ITEM_LOCATION)}
          >
            <Text style={globalStyles.whiteText}>{ADD_ITEM_LOCATION}</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={[globalStyles.defaultButtonContainer, globalStyles.defaultButton]}
            onPress={() => this.buttonListener(MAP_CREATOR)}
          >
            <Text style={globalStyles.whiteText}>{MAP_CREATOR}</Text>
          </TouchableHighlight>

        </View>
      </React.Fragment>
    );
  }
}

export default CrowdSourcePage;