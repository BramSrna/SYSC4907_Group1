import React, { Component } from "react";
import { Alert, KeyboardAvoidingView } from "react-native";
import { Layout, Button, Input, Select, TopNavigation, TopNavigationAction } from 'react-native-ui-kitten';
import { MenuOutline } from "../assets/icons/icons.js";
import { ScrollView } from "react-native-gesture-handler";
import { dark, light } from '../assets/Themes.js';
import { departments } from "../DepartmentList";
import NotificationPopup from 'react-native-push-notification-popup';
import nm from '../pages/Functions/NotificationManager.js';
import * as dbi from "./Functions/DBInterface";
import styles from "./pageStyles/AddItemLocationPageStyle"

const PAGE_TITLE = "Add Item Location";

// These are the default values for all of the input boxes
const DEFAULT_GENERIC_NAME = "";
const DEFAULT_SPECIFIC_NAME = "";
const DEFAULT_ITEM_DEPARTMENT = "Please select the department...";
const DEFAULT_STORE_NAME = "";
const DEFAULT_AISLE_NUM = "";
const DEFAULT_ADDRESS = "";

class AddItemLocationPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      genericName: DEFAULT_GENERIC_NAME,
      specificName: DEFAULT_SPECIFIC_NAME,
      itemDepartment: departments[0],
      storeName: DEFAULT_STORE_NAME,
      aisleNum: DEFAULT_AISLE_NUM,
      address: DEFAULT_ADDRESS
    };

    this.handleChangeDepartment = this.handleChangeDepartment.bind(this);
  }

  componentWillUnmount() {
    this.focusListener.remove();
    this._isMounted = false;
  }

  /**
   * componentWillMount
   * 
   * Function to call when the page is mounted. Sets
   * the value of "that" for the notification manager.
   * 
   * @param None
   * 
   * @returns None
   */
  componentWillMount() {
    this.focusListener = this.props.navigation.addListener(
      "willFocus",
      () => {
        this._isMounted = true;
        nm.setThat(this)
      }
    );
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
  handleChangeDepartment(val) {
    if (val != DEFAULT_ITEM_DEPARTMENT) {
      if (this._isMounted) this.setState({ itemDepartment: val });
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
  checkReqFields() {
    // Check the generic name field
    if (this.state.genericName == DEFAULT_GENERIC_NAME) {
      Alert.alert("Please enter a value for the generic name.");
      return (false);
    }

    // Check the store name field
    if (this.state.storeName == DEFAULT_STORE_NAME) {
      Alert.alert("Please enter a value for the store name.");
      return (false);
    }

    // Check the address field
    if (this.state.address == DEFAULT_ADDRESS) {
      Alert.alert("Please enter a value for the address.");
      return (false);
    }

    // Check the department field
    if (this.state.itemDepartment == DEFAULT_ITEM_DEPARTMENT) {
      Alert.alert("Please enter a value for the department.");
      return (false);
    }

    // Check the aisle number field
    if (this.state.aisleNum == DEFAULT_AISLE_NUM) {
      Alert.alert("Please enter a value for the aisle number.");
      return (false);
    }

    return (true);
  }

  /**
   * handleAdd
   * 
   * Handler for the add item location button.
   * Checks if all required data has been given and if so,
   * saves all of the information to the database.
   * 
   * @param None
   * 
   * @returns None
   */
  handleAdd = () => {
    // Check the required fields
    if (!this.checkReqFields()) {
      return;
    }

    // Set the specific name
    var tempSpecificName = this.state.specificName === DEFAULT_SPECIFIC_NAME ? null : this.state.specificName;

    // Add the value to the database
    dbi.addItemLoc(this.state.genericName,
      tempSpecificName,
      this.state.storeName,
      this.state.address,
      this.state.aisleNum,
      this.state.itemDepartment.value);

    Alert.alert("Item saved successfully");
  };

  /**
   * renderMenuAction
   * 
   * Handles the menu toggle being pressed.
   * Displays the menu to the user.
   * 
   * @param None
   * 
   * @returns None
   */
  renderMenuAction = () => (
    <TopNavigationAction
      icon={MenuOutline}
      onPress={() => this.props.navigation.toggleDrawer()}
    />
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
                  onChangeText={(genericName) => this._isMounted && this.setState({ genericName })}
                />
                <Input style={styles.inputRow}
                  label='Specific Name'
                  placeholder='Enter a specific name'
                  value={this.state.specificName}
                  onChangeText={(specificName) => this._isMounted && this.setState({ specificName })}
                />
                <Input style={styles.inputRow}
                  label='Store Name'
                  placeholder='Enter the store name'
                  value={this.state.storeName}
                  onChangeText={(storeName) => this._isMounted && this.setState({ storeName })}
                />
                <Input style={styles.inputRow}
                  label='Address'
                  placeholder='Enter the address'
                  value={this.state.address}
                  onChangeText={(address) => this._isMounted && this.setState({ address })}
                />
                <Select style={styles.selectBox}
                  label='Item Department'
                  data={departments}
                  placeholder='Select a department'
                  selectedOption={this.state.itemDepartment}
                  onSelect={(itemDepartment) => this._isMounted && this.setState({ itemDepartment })}
                />
                <Input style={styles.inputRow}
                  label='Aisle Number'
                  placeholder='Enter the aisle number'
                  keyboardType="numeric"
                  value={this.state.aisleNum}
                  onChangeText={(aisleNum) => this._isMounted && this.setState({ aisleNum })}
                />
                <Button style={styles.button} onPress={this.handleAdd} >Add Item Location</Button>
              </Layout>
            </Layout>
          </ScrollView>
        </KeyboardAvoidingView>
        <NotificationPopup ref={ref => this.popup = ref} />
      </React.Fragment>
    );
  }
}

export default AddItemLocationPage;