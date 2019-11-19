import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Layout, Button, Input, Icon, TopNavigation, TopNavigationAction } from 'react-native-ui-kitten';
import { MenuOutline } from "../assets/icons/icons.js";

import { Header } from "react-navigation"
import { styles, pickerStyle } from "./pageStyles/RegisterItemPageStyle";
import globalStyles from "../pages/pageStyles/GlobalStyle";
import * as firebase from "firebase";
import RNPickerSelect from 'react-native-picker-select';
import { units } from "../UnitList";

const keyboardVerticalOffset = Platform.OS === 'ios' ? (Header.HEIGHT + 64) : (Header.HEIGHT + 0)
const keyboardAvoidingViewBehavior = Platform.OS === 'ios' ? "padding" : "padding"

const PAGE_TITLE = "Register Item";

// The default value for all input fields
const DEFAULT_GENERIC_NAME = ""
const DEFAULT_SPECIFIC_NAME = ""
const DEFAULT_SIZE = ""
const DEFAULT_SIZE_UNIT = "Please select the size unit..."

class RegisterItemPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      genericName: DEFAULT_GENERIC_NAME,
      specificName: DEFAULT_SPECIFIC_NAME,
      size: DEFAULT_SIZE,
      sizeUnit: DEFAULT_SIZE_UNIT,
    };
  }

  /**
   * handleRegister
   * 
   * Handler for the register item button.
   * Saves all of the information to the database.
   * 
   * @param None
   * 
   * @returns None
  */
  handleRegister = () => {
    // Check the required fields
    var retVal = this.checkReqFields();

    // Saves the data if all required fields have values
    if (retVal) {
      firebase.database().ref("/items").push({
        genericName: this.state.genericName,
        specificName: this.state.specificName,
        size: this.state.size,
        sizeUnit: this.state.sizeUnit,
      });

      Alert.alert("Item saved successfully");
    }
  };

  /**
   * checkReqFields
   * 
   * Checks that the user has inputted values for
   * all mandatory fields. Determines if the user
   * has inputted a value by comparing the default
   * to the current value to see if they match. If
   * the current value matches the default value,
   * then the user has not entered a value.
   * 
   * @param None
   * 
   * @returns Boolean True if the user has inputted a value for all valid fields
   *                  False otherwise
   */
  checkReqFields() {
    // Check the generic name field
    if (this.state.genericName == DEFAULT_GENERIC_NAME) {
      Alert.alert("Please enter a value for the generic name.");
      return (false);
    }

    // Check the specific name field
    if (this.state.specificName == DEFAULT_SPECIFIC_NAME) {
      Alert.alert("Please enter a value for the specific name.");
      return (false);
    }

    return (true);
  }
  /**
   * 
   * renderRequiredText
   * 
   * Renders a required text Text fields.
   * Prints the body of the text field with
   * the required text marker.
   * 
   * @param {String}  bodyText  The text of the Text field
   * @param {String}  reqText   The text to signify it is required text (Default = (*))
   * 
   * @returns None
   */
  renderRequiredText(bodyText, reqText = "(*)") {
    return (
      <Text style={globalStyles.whiteText}>
        {bodyText}
        <Text style={globalStyles.requiredHighlight}>
          {reqText}
        </Text>
      </Text>
    );
  }

  renderMenuAction = () => (
    <TopNavigationAction icon={MenuOutline} onPress={() => this.props.navigation.toggleDrawer()} />
  );

  render() {
    return (
      <React.Fragment>
        <TopNavigation
          title={PAGE_TITLE}
          leftControl={this.renderMenuAction()}
        />
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <Text style={styles.whiteHeaderText}>Register Item</Text>
          </View>

          <KeyboardAvoidingView
            style={styles.midContainer}
            keyboardVerticalOffset={keyboardVerticalOffset}
            behavior={keyboardAvoidingViewBehavior}>
            <View style={styles.rowSorter}>
              <View style={{ flex: 1 }}>
                {this.renderRequiredText("Generic Name: ")}
              </View>

              <View style={{ flex: 1 }}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Generic Name Ex. Ketchup"
                  onChangeText={(genericName) => this.setState({ genericName })}
                  value={this.state.genericName}
                />
              </View>
            </View>

            <View style={styles.rowSorter}>
              <View style={{ flex: 1 }}>
                {this.renderRequiredText("Specific Name: ")}
              </View>

              <View style={{ flex: 1 }}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Specific Name"
                  onChangeText={(specificName) => this.setState({ specificName })}
                  value={this.state.specificName}
                />
              </View>
            </View>

            <View style={styles.rowSorter}>
              <View style={{ flex: 1 }}>
                <Text style={globalStyles.whiteText}>Size: </Text>
              </View>

              <View style={{ flex: 1 }}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Size"
                  keyboardType="numeric"
                  onChangeText={(size) => this.setState({ size })}
                  value={this.state.size}
                />
              </View>

              <View style={{ flex: 0.1 }} />

              <View style={{ flex: 1 }}>
                <RNPickerSelect
                  value={this.state.sizeUnit}
                  items={units}
                  style={pickerStyle}
                  useNativeAndroidPickerStyle={false}
                  placeholder={{}}
                  onValueChange={(sizeUnit) => this.setState({ sizeUnit })} />
              </View>
            </View>
          </KeyboardAvoidingView>

          <View style={styles.botContainer}>
            <TouchableHighlight
              style={[globalStyles.defaultButtonContainer, globalStyles.defaultButton]}
              onPress={this.handleRegister}
            >
              <Text style={globalStyles.whiteText}>{"Register Item"}</Text>
            </TouchableHighlight>
          </View>
        </View>
      </React.Fragment>
    );
  }
}

export default RegisterItemPage;