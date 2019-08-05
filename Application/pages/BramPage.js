import React, { Component } from "react";
import { FlatList,
         Text,
         View,
         TextInput,
         TouchableHighlight,
         Image,
         Alert
      } from "react-native";
import styles from "../pages/pageStyles/BramPageStyle";

class BramPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <View style={styles.inputContainer}>
            <Image
              style={styles.inputIcon}
              source={{
                uri: "https://png.icons8.com/message/ultraviolet/50/3498db"
                }}
            />
            <TextInput
              style={styles.inputs}
              placeholder="Store Name"
              keyboardType="default"
              underlineColorAndroid="transparent"
              onChangeText={(text) => this.setState({text})}
            />
            </View>
        </View>

        <View style={styles.mapContainer}>
          <Text style={styles.blackText}>"TEST"</Text>
        </View>

        <View style={styles.departmentListContainer}>
          <FlatList
            data = {[
              {key: "Bakery"},
              {key: "Beer"},
              {key: "Bulk"},
              {key: "Cheese"},
              {key: "Coffee and Tea"},
              {key: "Flowers and Floral Arrangements"},
              {key: "Grocery"},
              {key: "Meat and Poultry"},
              {key: "Prepared Foods"},
              {key: "Produce"},
              {key: "Seafood"},
              {key: "Wine"},
              {key: "Whole Body"},
              {key: "Pets"},
            ]}

            renderItem = {
              ({item}) => 
                <Text style = {styles.item}>
                  {item.key}
                </Text>
            }
          />
        </View>
      </View>
    );
  }
}

export default BramPage;
