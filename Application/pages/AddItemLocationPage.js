import React, { Component, Fragment } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Header } from "react-navigation"
import { styles, pickerStyle } from "./pageStyles/AddItemLocationPageStyle";
import globalStyles from "./pageStyles/GlobalStyle";
import * as firebase from "firebase";
import RNPickerSelect from 'react-native-picker-select';
import {departments} from "../DepartmentList";

const keyboardVerticalOffset = Platform.OS === 'ios' ? (Header.HEIGHT + 64) : (Header.HEIGHT + 0)
const keyboardAvoidingViewBehavior = Platform.OS === 'ios' ? "padding" : "padding"

// These are the default values for all of the input boxes
const DEFAULT_GENERIC_NAME = ""
const DEFAULT_SPECIFIC_NAME = ""
const DEFAULT_ITEM_DEPARTMENT = "Please select the department..."
const DEFAULT_STORE_NAME = ""
const DEFAULT_AISLE_NUM = ""

class AddItemLocationPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      genericName: DEFAULT_GENERIC_NAME,
      specificName: DEFAULT_SPECIFIC_NAME,
      itemDepartment: DEFAULT_ITEM_DEPARTMENT,
      storeName: DEFAULT_STORE_NAME,
      aisleNum: DEFAULT_AISLE_NUM,
    };

    this.handleChangeDepartment = this.handleChangeDepartment.bind(this);
  }

  /**
   * handleChangeDepartment
   * 
   * Handles the department being changed in the
   * department selector. Updates the current
   * department value.
   * 
   * @param {String} val  The new department value
   * 
   * @returns None
   */
  handleChangeDepartment(val){
    if (val != DEFAULT_ITEM_DEPARTMENT){
      this.setState({itemDepartment: val});
    }
  }

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
  checkReqFields(){
    // Check the generic name field
    if (this.state.genericName == DEFAULT_GENERIC_NAME) {
      Alert.alert("Please enter a value for the generic name.");
      return(false);
    }

    // Check the department field
    if (this.state.itemDepartment == DEFAULT_ITEM_DEPARTMENT) {
      Alert.alert("Please enter a value for the item department.");
      return(false);
    }

    // Check the store name field
    if (this.state.storeName == DEFAULT_STORE_NAME) {
      Alert.alert("Please enter a value for the store name.");
      return(false);
    }

    // Check the aisle number field
    if (this.state.aisleNum == DEFAULT_AISLE_NUM) {
      Alert.alert("Please enter a value for the aisle number.");
      return(false);
    }

    return(true);
  }

  /**
   * handleAdd
   * 
   * Handler for the add item location button.
   * Saves all of the information to the database.
   * 
   * @param None
   * 
   * @returns None
   */
  handleAdd = () => {
    var retVal = this.checkReqFields();

    if (retVal == true){
      firebase.database().ref("/itemLocs").push({
        genericName: this.state.genericName,
        specificName: this.state.specificName,
        department: this.state.itemDepartment,
        store: this.state.storeName,
        aisleNum: this.state.aisleNum,
      });

      Alert.alert("Item saved successfully");
    }
  };

  /**
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
    return(
      <Text style={globalStyles.whiteText}>
        {bodyText}
        <Text style={globalStyles.requiredHighlight}>
          {reqText}
        </Text>
      </Text>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.whiteHeaderText}>Add Item Location:</Text>
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
                placeholder="Generic Name"
                onChangeText={(genericName) => this.setState({ genericName })}
                value={this.state.genericName}
              />
            </View>
          </View>

          <View style={styles.rowSorter}>
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.whiteText}>Specific Name: </Text>
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
              {this.renderRequiredText("Item Department: ")}
            </View>

            <View style={{ flex: 1 }}>
              <RNPickerSelect
                    value={this.state.itemDepartment}
                    items={departments}
                    style={pickerStyle}
                    useNativeAndroidPickerStyle={false}
                    placeholder={{}}
                    onValueChange={(itemDepartment) => this.setState({itemDepartment})}/>
            </View>
          </View>

          <View style={styles.rowSorter}>
            <View style={{ flex: 1 }}>
              {this.renderRequiredText("Store Name: ")}
            </View>

            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.textInput}
                placeholder="Store Name"
                onChangeText={(storeName) => this.setState({ storeName })}
                value={this.state.storeName}
              />
            </View>
          </View>

          <View style={styles.rowSorter}>
            <View style={{ flex: 1 }}>
              {this.renderRequiredText("Aisle Number: ")}
            </View>

            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.textInput}
                placeholder="Aisle Number"
                keyboardType="numeric"
                onChangeText={(aisleNum) => this.setState({ aisleNum })}
                value={this.state.aisleNum}
              />
            </View>
          </View>
        </KeyboardAvoidingView>

        <View style={styles.botContainer}>
          <TouchableHighlight
            style={[globalStyles.defaultButtonContainer, globalStyles.defaultButton]}
            onPress={this.handleAdd}
          >
            <Text style={globalStyles.whiteText}>{"Add Item Location"}</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

export default AddItemLocationPage;