import React, { Component } from "react";
import { Text, Alert, KeyboardAvoidingView, StyleSheet } from "react-native";
import { Layout, Button, Input, Select, TopNavigation, TopNavigationAction } from 'react-native-ui-kitten';
import { MenuOutline } from "../assets/icons/icons.js";
import { ScrollView } from "react-native-gesture-handler";
import { dark, light } from '../assets/Themes.js';
import globalStyles from "./pageStyles/GlobalStyle";
import { departments } from "../DepartmentList";
import NotificationPopup from 'react-native-push-notification-popup';
import nm from '../pages/Functions/NotificationManager.js';
import * as dbi from "./DBInterface";

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
      itemDepartment: departments[0].value,
      storeName: DEFAULT_STORE_NAME,
      aisleNum: DEFAULT_AISLE_NUM,
      address: DEFAULT_ADDRESS
    };

    this.handleChangeDepartment = this.handleChangeDepartment.bind(this);
  }

  componentDidMount() {
    nm.setThat(this)
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
      this.setState({ itemDepartment: val });
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
   * Saves all of the information to the database.
   * 
   * @param None
   * 
   * @returns None
   */
  handleAdd = () => {
    if (!this.checkReqFields()){
      return;
    }

    var tempSpecificName = this.state.specificName === DEFAULT_SPECIFIC_NAME ? null : this.state.specificName;

    dbi.addItemLoc(this.state.genericName,
                   tempSpecificName,
                   this.state.storeName,
                   this.state.address,
                   this.state.aisleNum,
                   this.state.itemDepartment);

    Alert.alert("Item saved successfully");
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
                  placeholder='Enter a specific name'
                  value={this.state.specificName}
                  onChangeText={(specificName) => this.setState({ specificName })}
                />
                <Input style={styles.inputRow}
                  label='Store Name'
                  placeholder='Enter the store name'
                  value={this.state.storeName}
                  onChangeText={(storeName) => this.setState({ storeName })}
                />
                <Input style={styles.inputRow}
                  label='Address'
                  placeholder='Enter the address'
                  value={this.state.address}
                  onChangeText={(address) => this.setState({ address })}
                />
                <Select style={styles.selectBox}
                  label='Item Department'
                  data={departments}
                  placeholder='Select a department'
                  selectedOption={this.state.itemDepartment}
                  onSelect={(itemDepartment) => this.setState({ itemDepartment })}
                />
                <Input style={styles.inputRow}
                  label='Aisle Number'
                  placeholder='Enter the aisle number'
                  keyboardType="numeric"
                  value={this.state.aisleNum}
                  onChangeText={(aisleNum) => this.setState({ aisleNum })}
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
  selectBox: {
    width: '100%',
  },
  button: {
    flex: 1,
    marginTop: 8,
    width: '100%',
  },
});

export default AddItemLocationPage;