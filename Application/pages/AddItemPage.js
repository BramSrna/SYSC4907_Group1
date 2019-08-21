import React, { Component } from "react";
import { Text, View, TextInput, Picker, Button, Image } from "react-native";
import ImagePicker from "react-native-image-picker";
import styles from "./pageStyles/AddItemPageStyle";

class AddItemPage extends Component {
  constructor(props) {
    super(props);

    this.state = {itemName: "Item Name",
                  itemDepartment: "Department",
                  storeName: "Store Name",
                  aisleNum: "Aisle Number",
                  filePath: {},};
  }

  chooseFile = () => {
    var options = {
      title: "Select Image",
      customButtons: [
        {name: "customOptionKey",
         title: "Choose Photo from Custom Option"},
      ],
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };

    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
        alert(response.customButton);
      } else {
        let source = response;
        // You can also display the image using data:
        // let source = { uri: "data:image/jpeg;base64," + response.data};
        this.setState({
          filePath: source,
        });
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.blackText}>Add Item:</Text>

        <View style={{flexDirection: "row"}}>
          <View style = {{flex: 1}}>
            <Text style={styles.blackText}>Item Name: </Text>
          </View>

          <View style = {{flex: 1}}>
            <TextInput
              style={{height: 40, 
                      borderColor: "gray", 
                      borderWidth: 1,
                      justifyContent: "flex-end"}}
              onChangeText={(text) => this.setState({text})}
              value={this.state.itemName}
            />
          </View>
        </View>

        <View style = {{flex: 1}}>
          {/*<Image
          source={{ uri: this.state.filePath.path}}
          style={{width: 100, height: 100}} />*/}
          <Image
            source={{
              uri: "data:image/jpeg;base64," + this.state.filePath.data,
            }}
            style={{ width: 100, height: 100}}
          />
          <Image
            source={{ uri: this.state.filePath.uri }}
            style={{ width: 250, height: 250 }}
          />
          <Text style={{ alignItems: "center" }}>
            {this.state.filePath.uri}
          </Text>
          <Button title="Choose File" onPress={this.chooseFile.bind(this)} />
        </View>

        <View style={{flexDirection: "row"}}>
          <View style = {{flex: 1}}>
            <Text style={styles.blackText}>Item Department: </Text>
          </View>
          
          <View style = {{flex: 1}}>
            <Picker
              selectedValue={this.state.language}
              style={{height:  40,
                      borderColor: "gray",
                      borderWidth: 1,
                      justifyContent: "flex-end"}}
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

        <View style={{flexDirection: "row"}}>
          <View style = {{flex: 1}}>
            <Text style={styles.blackText}>Store Name: </Text>
          </View>

          <View style = {{flex: 1}}>
            <TextInput
              style={{height: 40, 
                      borderColor: "gray", 
                      borderWidth: 1,
                      justifyContent: "flex-end"}}
              onChangeText={(text) => this.setState({text})}
              value={this.state.storeName}
            />
          </View>
        </View>

        <View style={{flexDirection: "row"}}>
          <View style = {{flex: 1}}>
            <Text style={styles.blackText}>Aisle Number: </Text>
          </View>

          <View style = {{flex: 1}}>
            <TextInput
              style={{height: 40, 
                      borderColor: "gray", 
                      borderWidth: 1,
                      justifyContent: "flex-end"}}
              keyboardType = "numeric"
              onChangeText={(text) => this.setState({text})}
              value={this.state.aisleNum}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default AddItemPage;
