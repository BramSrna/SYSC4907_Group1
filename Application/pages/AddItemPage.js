import React, { Component } from "react";
import { Text,
         View,
         TextInput,
         Picker,
         Button,
         Image,
         TouchableHighlight,
         Alert } from "react-native";
import styles from "./pageStyles/AddItemPageStyle";
import {db} from "../config";

let addItem = (itemName, itemDepartment, storeName, aisleNum) => {
  db.ref("/items").push({
    name: itemName,
    department: itemDepartment,
    store: storeName,
    aisleNum: aisleNum
  });
};

class AddItemPage extends Component {
  constructor(props) {
    super(props);

    this.state = {itemName: "",
                  itemDepartment: "BAKERY",
                  storeName: "",
                  aisleNum: "",};
  }

  handleRegister = () => {
    addItem(this.state.itemName,
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

        <View style={styles.midContainer}>
          <View style={styles.rowSorter}>
            <View style = {{flex: 1}}>
              <Text style={styles.whiteText}>Item Name: </Text>
            </View>

            <View style = {{flex: 1}}>
              <TextInput
                style={styles.textInput}
                placeholder="Item Name"
                onChangeText={(itemName) => this.setState({itemName})}
                value={this.state.itemName}
              />
            </View>
          </View>

          <View style={styles.rowSorter}>
            <View style = {{flex: 1}}>
              <Text style={styles.whiteText}>Item Department: </Text>
            </View>
            
            <View style = {{flex: 1}}>
              <Picker
                selectedValue={this.state.itemDepartment}
                style={styles.picker}
                onValueChange={(itemDepartment) => this.setState({itemDepartment})
                }>
                <Picker.Item label="Bakery" value="BAKERY" />
                <Picker.Item label="Beer" value="BEER" />
                <Picker.Item label="Bulk" value="BULK" />
                <Picker.Item label="Cheese" value="CHEESE" />
                <Picker.Item label="Coffee And Tea" value="COFFEE_AND_TEA" />
                <Picker.Item label="Flowers and Floral Arrangements" value="FLOWERS_AND_FLORAL_ARRANGEMENTS" />
                <Picker.Item label="Grocery" value="GROCERY" />
                <Picker.Item label="Meat and Poultry" value="MEAT_AND_POULTRY" />
                <Picker.Item label="Prepared Foods" value="PREPARED_FOODS" />
                <Picker.Item label="Produce" value="PRODUCE" />
                <Picker.Item label="Seafood" value="SEAFOOD" />
                <Picker.Item label="Wine" value="WINE" />
                <Picker.Item label="Whole Body" value="WHOLE_BODY" />
                <Picker.Item label="Pets" value="PETS" />
              </Picker>
            </View>
          </View>

          <View style={styles.rowSorter}>
            <View style = {{flex: 1}}>
              <Text style={styles.whiteText}>Store Name: </Text>
            </View>

            <View style = {{flex: 1}}>
              <TextInput
                style={styles.textInput}
                placeholder="Store Name"
                onChangeText={(storeName) => this.setState({storeName})}
                value={this.state.storeName}
              />
            </View>
          </View>

          <View style={styles.rowSorter}>
            <View style = {{flex: 1}}>
              <Text style={styles.whiteText}>Aisle Number: </Text>
            </View>

            <View style = {{flex: 1}}>
              <TextInput
                style={styles.textInput}                
                placeholder="Aisle Number"
                keyboardType = "numeric"
                onChangeText={(aisleNum) => this.setState({aisleNum})}
                value={this.state.aisleNum}
              />
            </View>
          </View>
        </View>

        <View style={styles.botContainer}>
          <TouchableHighlight
            style={[styles.buttonContainer, styles.submitButton]}
            onPress={this.handleRegister}
          >
            <Text style={styles.whiteText}>{"Register Item"}</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

export default AddItemPage;
