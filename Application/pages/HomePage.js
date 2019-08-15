import React, { Component } from "react";
import { Text,
         View,
         TouchableHighlight} from "react-native";
import styles from "../pages/pageStyles/HomePageStyle";

const ADD_ITEM_PAGE = "AddItemPage"

class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  buttonListener = buttonId => {
    if (buttonId == ADD_ITEM_PAGE) {
      this.props.navigation.navigate("GoToAddItemPage");
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.whiteText}>HomePage</Text>

        <TouchableHighlight
          style={[styles.buttonContainer, styles.addItemPageButton]}
          onPress={() => this.buttonListener(ADD_ITEM_PAGE)}
        >
          <Text style={styles.whiteText}>{"Go To Add Item Page"}</Text>
        </TouchableHighlight>

      </View>
    );
  }
}

export default HomePage;
