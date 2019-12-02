import React, { Component } from "react";
import { Text, View, TextInput, TouchableHighlight, Alert, Platform, KeyboardAvoidingView, StyleSheet } from "react-native";
import { Layout, Button, Input, Select, Icon, TopNavigation, TopNavigationAction } from 'react-native-ui-kitten';
import { MenuOutline } from "../assets/icons/icons.js";
import { ScrollView } from "react-native-gesture-handler";
import { dark, light } from '../assets/Themes.js';

import { Header } from "react-navigation"
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
const DEFAULT_SIZE_UNIT = ""

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
          alignment="center"
          leftControl={this.renderMenuAction()}
        />
        <KeyboardAvoidingView style={[styles.avoidingView, { backgroundColor: global.theme == light ? light["background-basic-color-1"] : dark["background-basic-color-1"] }]} behavior="padding" enabled keyboardVerticalOffset={24}>
          <ScrollView style={[styles.scrollContainer, { backgroundColor: global.theme == light ? light["background-basic-color-1"] : dark["background-basic-color-1"] }]}>
            <Layout style={styles.formOuterContainer} level='3'>
              <Layout style={styles.formInnerContainer}>
                <Input style={styles.inputRow}
                  label='Generic Name'
                  placeholder='Ex. Ketchup'
                  value={this.state.genericName}
                  onChangeText={(genericName) => this.setState({ genericName })}
                />
                <Input style={styles.inputRow}
                  label='Specific Name'
                  placeholder='Specific Name'
                  value={this.state.specificName}
                  onChangeText={(specificName) => this.setState({ specificName })}
                />
                <Layout style={styles.horizontalInnerContainer}>
                  <Input style={styles.inputLeftColumn}
                    label='Size'
                    placeholder='Size'
                    keyboardType='numeric'
                    value={this.state.size}
                    onChangeText={(size) => this.setState({ size })}
                  />
                  <Select style={styles.inputRightColumn}
                    data={units}
                    placeholder='Unit'
                    selectedOption={this.state.sizeUnit}
                    onSelect={(sizeUnit) => this.setState({ sizeUnit })}
                  />
                </Layout>
                <Button style={styles.button} onPress={this.handleRegister} >Register Item</Button>
              </Layout>
            </Layout>
          </ScrollView>
        </KeyboardAvoidingView>
      </React.Fragment >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  scrollContainer: {
    flex: 1,
  },
  avoidingView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  overflowMenu: {
    padding: 4,
    shadowColor: 'black',
    shadowOpacity: .5,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  formOuterContainer: {
    margin: 8,
    padding: 8,
    borderRadius: 10,
  },
  formInnerContainer: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  inputRow: {
    paddingVertical: 4,
  },
  horizontalInnerContainer: {
    flexDirection: 'row',
  },
  inputLeftColumn: {
    flex: 4,
    paddingVertical: 4,
  },
  inputRightColumn: {
    flex: 1,
    paddingTop: 21,
    paddingLeft: 8,
    paddingVertical: 4,
    minWidth: 60,
  },
  button: {
    flex: 1,
    marginTop: 8,
    width: '100%',
  },
});

export default RegisterItemPage;