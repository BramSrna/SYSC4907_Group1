import React, { Component } from "react";
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
import {styles, pickerStyle} from "./pageStyles/RegisterItemPageStyle";
import globalStyles from "../pages/pageStyles/GlobalStyle";
import * as firebase from "firebase";
import RNPickerSelect from 'react-native-picker-select';
import {units} from "../UnitList";

const keyboardVerticalOffset = Platform.OS === 'ios' ? (Header.HEIGHT + 64) : (Header.HEIGHT + 0)
const keyboardAvoidingViewBehavior = Platform.OS === 'ios' ? "padding" : "padding"

const DEFAULT_GENERIC_NAME = ""
const DEFAULT_SPECIFIC_NAME = ""
const DEFAULT_SIZE = ""
const DEFAULT_SIZE_UNIT = "Please select the size unit..."
const DEFAULT_QUANTITY = ""

class RegisterItemPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      genericName: DEFAULT_GENERIC_NAME,
      specificName: DEFAULT_SPECIFIC_NAME,
      size: DEFAULT_SIZE,
      sizeUnit: DEFAULT_SIZE_UNIT,
      quantity: DEFAULT_QUANTITY,
    };
  }

  handleRegister = () => {
    var retVal = this.checkReqFields();

    if (retVal){
      firebase.database().ref("/items").push({
        genericName: this.state.genericName,
        specificName: this.state.specificName,
        size: this.state.size,
        sizeUnit: this.state.sizeUnit,
        quantity: this.state.quantity,
      });

      Alert.alert("Item saved successfully");
    }
  };

  checkReqFields(){
    if (this.state.genericName == DEFAULT_GENERIC_NAME) {
      Alert.alert("Please enter a value for the generic name.");
      return(false);
    }

    if (this.state.specificName == DEFAULT_SPECIFIC_NAME) {
      Alert.alert("Please enter a value for the specific name.");
      return(false);
    }

    return(true);
  }

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
          <Text style={styles.whiteHeaderText}>Register Item:</Text>
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

            <View style={{flex: 0.1}}/>

            <View style={{ flex: 1 }}>
              <RNPickerSelect
                    value={this.state.sizeUnit}
                    items={units}
                    style={pickerStyle}
                    useNativeAndroidPickerStyle={false}
                    placeholder={{}}
                    onValueChange={(sizeUnit) => this.setState({ sizeUnit })}/>
            </View>
          </View>

          <View style={styles.rowSorter}>
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.whiteText}>Quantity: </Text>
            </View>

            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.textInput}
                placeholder="Quantity"
                keyboardType="numeric"
                onChangeText={(quantity) => this.setState({ quantity })}
                value={this.state.quantity}
              />
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
    );
  }
}

export default RegisterItemPage;