import React, { Component } from "react";
import { Text,
         View,
         TouchableHighlight} from "react-native";
import styles from "../pages/pageStyles/HomePageStyle";
import globalStyles from "../pages/pageStyles/GlobalStyle";

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
      <View style={globalStyles.defaultContainer}>
        <Text style={globalStyles.whiteText}>HomePage</Text>

        <TouchableHighlight
          style={[globalStyles.defaultButtonContainer, globalStyles.defaultButton]}
          onPress={() => this.buttonListener(ADD_ITEM_PAGE)}
        >
          <Text style={globalStyles.whiteText}>{"Go To Add Item Page"}</Text>
        </TouchableHighlight>

      </View>
    );
  }
}

export default HomePage;
