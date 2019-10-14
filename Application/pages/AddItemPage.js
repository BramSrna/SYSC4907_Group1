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
  KeyboardAvoidingView
} from "react-native";
import { Header } from "react-navigation"
import styles from "./pageStyles/AddItemPageStyle";
import globalStyles from "../pages/pageStyles/GlobalStyle";
import * as firebase from "firebase";
import {departments} from "../DepartmentList";

const keyboardVerticalOffset = Platform.OS === 'ios' ? (Header.HEIGHT + 64) : (Header.HEIGHT + 0)
const keyboardAvoidingViewBehavior = Platform.OS === 'ios' ? "padding" : "padding"

class AddItemPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemName: "",
      itemDepartment: "BAKERY",
      storeName: "",
      aisleNum: "",
    };
  }

  addItem = (itemName, itemDepartment, storeName, aisleNum) => {
    firebase.database().ref("/items").push({
      name: itemName,
      department: itemDepartment,
      store: storeName,
      aisleNum: aisleNum
    });
  };

  handleRegister = () => {
    this.addItem(this.state.itemName,
      this.state.itemDepartment,
      this.state.storeName,
      this.state.aisleNum);
    Alert.alert("Item saved successfully");
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.whiteHeaderText}>Add Item:</Text>
        </View>

        <KeyboardAvoidingView
          style={styles.midContainer}
          keyboardVerticalOffset={keyboardVerticalOffset}
          behavior={keyboardAvoidingViewBehavior}>
          <View style={styles.rowSorter}>
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.whiteText}>Item Name: </Text>
            </View>

            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.textInput}
                placeholder="Item Name"
                onChangeText={(itemName) => this.setState({ itemName })}
                value={this.state.itemName}
              />
            </View>
          </View>

          <View style={styles.rowSorter}>
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.whiteText}>Item Department: </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Picker
                selectedValue={this.state.itemDepartment}
                style={styles.picker}
                onValueChange={(itemDepartment) => this.setState({itemDepartment})}>
                {Object.keys(departments).map((key) => {
                  return (<Picker.Item label={departments[key]["displayName"]} value={key} key={key}/>)
                })}
              </Picker>
            </View>
          </View>

          <View style={styles.rowSorter}>
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.whiteText}>Store Name: </Text>
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
              <Text style={globalStyles.whiteText}>Aisle Number: </Text>
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
            onPress={this.handleRegister}
          >
            <Text style={globalStyles.whiteText}>{"Register Item"}</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

export default AddItemPage;
