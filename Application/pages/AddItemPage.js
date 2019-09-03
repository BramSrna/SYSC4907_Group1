import React, { Component } from "react";
import { Text, View, TextInput, Picker, Button, Image, TouchableHighlight } from "react-native";
import styles from "./pageStyles/AddItemPageStyle";

class AddItemPage extends Component {
  constructor(props) {
    super(props);

    this.state = {itemName: "Item Name",
                  itemDepartment: "Department",
                  storeName: "Store Name",
                  aisleNum: "Aisle Number",};
  }

  buttonListener = buttonId => {
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
                onChangeText={(text) => this.setState({text})}
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
                selectedValue={this.state.language}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({language: itemValue})
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
                onChangeText={(text) => this.setState({text})}
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
                keyboardType = "numeric"
                onChangeText={(text) => this.setState({text})}
                value={this.state.aisleNum}
              />
            </View>
          </View>
        </View>

        <View style={styles.botContainer}>
          <TouchableHighlight
            style={[styles.buttonContainer, styles.submitButton]}
            onPress={() => this.buttonListener()}
          >
            <Text style={styles.whiteText}>{"Register Item"}</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

export default AddItemPage;
