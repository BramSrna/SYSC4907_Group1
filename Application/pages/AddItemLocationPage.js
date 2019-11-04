import React, { Component, Fragment } from "react";
import {
  Text,
  View,
  TextInput,
  Picker,
  Button,
  Image,
  TouchableHighlight,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Header } from "react-navigation"
import { styles, pickerStyle } from "./pageStyles/AddItemLocationPageStyle";
import globalStyles from "./pageStyles/GlobalStyle";
import * as firebase from "firebase";
import RNPickerSelect from 'react-native-picker-select';
import {departments} from "../DepartmentList";

const keyboardVerticalOffset = Platform.OS === 'ios' ? (Header.HEIGHT + 64) : (Header.HEIGHT + 0)
const keyboardAvoidingViewBehavior = Platform.OS === 'ios' ? "padding" : "padding"

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

  handleChangeDepartment(val){
    if (val != DEFAULT_ITEM_DEPARTMENT){
      this.setState({itemDepartment: val});
    }
  }

  checkReqFields(){
    if (this.state.genericName == DEFAULT_GENERIC_NAME) {
      Alert.alert("Please enter a value for the generic name.");
      return(false);
    }

    if (this.state.itemDepartment == DEFAULT_ITEM_DEPARTMENT) {
      Alert.alert("Please enter a value for the item department.");
      return(false);
    }

    if (this.state.storeName == DEFAULT_STORE_NAME) {
      Alert.alert("Please enter a value for the store name.");
      return(false);
    }

    if (this.state.aisleNum == DEFAULT_AISLE_NUM) {
      Alert.alert("Please enter a value for the aisle number.");
      return(false);
    }

    return(true);
  }

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