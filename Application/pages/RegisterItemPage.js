import React, { Component } from "react";
import { Alert, KeyboardAvoidingView } from "react-native";
import { Layout, Button, Input, Select, TopNavigation, TopNavigationAction } from 'react-native-ui-kitten';
import { MenuOutline } from "../assets/icons/icons.js";
import { ScrollView } from "react-native-gesture-handler";
import { dark, light } from '../assets/Themes.js';
import { units } from "../UnitList";
import NotificationPopup from 'react-native-push-notification-popup';
import nm from '../pages/Functions/NotificationManager.js';
import * as dbi from "./DBInterface";
import { styles } from "./pageStyles/RegisterItemPageStyle";

const PAGE_TITLE = "Register Item";

// The default value for all input fields
const DEFAULT_GENERIC_NAME = ""
const DEFAULT_SPECIFIC_NAME = ""
const DEFAULT_SIZE = ""
const DEFAULT_SIZE_UNIT = ""
const DEFAULT_PRICE = ""

class RegisterItemPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      genericName: DEFAULT_GENERIC_NAME,
      specificName: DEFAULT_SPECIFIC_NAME,
      size: DEFAULT_SIZE,
      sizeUnit: units[0],
      price: DEFAULT_PRICE
    };
  }

  /**
   * componentDidMount
   * 
   * Function called when the component has mounted.
   * Sets the context of the notification manager.
   * 
   * @param None
   * 
   * @returns None
   */
  componentDidMount() {
    nm.setThat(this)

  }

  /**
   * handleRegister
   * 
   * Handler for the register item button.
   * Checks that all necessary data has been given.
   * Saves all of the information to the database.
   * 
   * @param None
   * 
   * @returns None
  */
  handleRegister = () => {
    // Check that all required information has been given
    if (!this.checkReqFields()){
      return;
    }

    // Set all of the optional data
    var tempSpecificName = this.state.specificName === DEFAULT_SPECIFIC_NAME ? null : this.state.specificName;
    var tempSize = this.state.size === DEFAULT_SIZE ? null : this.state.size;
    var tempSizeUnit = this.state.sizeUnit.value;
    var tempPrice = this.state.price === DEFAULT_PRICE ? null : this.state.price;

    // Register the item
    dbi.registerItem(this.state.genericName,
                      tempSpecificName,
                      tempSize,
                      tempSizeUnit,
                      tempPrice);

    Alert.alert("Item saved successfully");
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

    return (true);
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
                <Input style={styles.inputRow}
                  label='Price'
                  placeholder='Price'
                  keyboardType='numeric'
                  value={this.state.price}
                  onChangeText={(price) => this.setState({ price })}
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
        <NotificationPopup ref={ref => this.popup = ref} />
      </React.Fragment >
    );
  }
}

export default RegisterItemPage;