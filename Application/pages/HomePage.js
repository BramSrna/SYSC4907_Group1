import React, { Component } from "react";
import { Text,
         View,
         TouchableHighlight} from "react-native";
import styles from "../pages/pageStyles/HomePageStyle";

const BRAM_PAGE = "BramPage"

class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  buttonListener = buttonId => {
    if (buttonId == BRAM_PAGE) {
      this.props.navigation.navigate("GoToBramPage");
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.whiteText}>HomePage</Text>

        <TouchableHighlight
          style={[styles.buttonContainer, styles.bramPageButton]}
          onPress={() => this.buttonListener(BRAM_PAGE)}
        >
          <Text style={styles.whiteText}>{"Go to Bram's Page"}</Text>
        </TouchableHighlight>

      </View>
    );
  }
}

export default HomePage;
