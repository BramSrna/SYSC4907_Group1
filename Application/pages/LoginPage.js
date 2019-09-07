import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Image,
  Alert
} from "react-native";
import styles from "../pages/pageStyles/LoginPageStyle";
import globalStyles from "../pages/pageStyles/GlobalStyle";
const LOGIN = "Login";
const FORGOT_PASSWORD = "Forgot your password?";
const REGISTER = "RegisterPage";
const HOMEPAGE = "HomePage";

export default class LoginPage extends Component {
  userAlreadyLoggedIn = false;

  buttonListener = buttonId => {
    if (buttonId == LOGIN) {
      this.props.navigation.navigate("Homepage");
    } else if (buttonId == REGISTER) {
      this.props.navigation.navigate("GoToRegisterPage");
    } else if (buttonId == FORGOT_PASSWORD) {
      Alert.alert("ERROR", "IN DEVELOPMENT");
    }
  };

  userIsCurrentlyLoggedIn() {
    return false;
    // return true;
  }

  componentWillMount() {
    this.userAlreadyLoggedIn = this.userIsCurrentlyLoggedIn();
    if (this.userAlreadyLoggedIn) {
      this.props.navigation.navigate(HOMEPAGE);
    }
  }

  render() {
    if (!this.userAlreadyLoggedIn) {
      return (
        <View style={globalStyles.defaultContainer}>
          <View style={styles.inputContainer}>
            <Image
              style={styles.inputIcon}
              source={{
                uri: "https://png.icons8.com/message/ultraviolet/50/3498db"
              }}
            />
            <TextInput
              style={styles.inputs}
              placeholder="Email"
              keyboardType="email-address"
              underlineColorAndroid="transparent"
              onChangeText={email => this.setState({ email })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Image
              style={styles.inputIcon}
              source={{
                uri: "https://png.icons8.com/key-2/ultraviolet/50/3498db"
              }}
            />
            <TextInput
              style={styles.inputs}
              placeholder="Password"
              secureTextEntry={true}
              underlineColorAndroid="transparent"
              onChangeText={password => this.setState({ password })}
            />
          </View>

          <TouchableHighlight
            style={[globalStyles.defaultButtonContainer, globalStyles.defaultButton]}
            onPress={() => this.buttonListener(LOGIN)}
          >
            <Text style={globalStyles.whiteText}>{LOGIN}</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={globalStyles.defaultButtonContainer}
            onPress={() => this.buttonListener(FORGOT_PASSWORD)}
          >
            <Text style={globalStyles.whiteText}>{FORGOT_PASSWORD}</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={globalStyles.defaultButtonContainer}
            onPress={() => this.buttonListener(REGISTER)}
          >
            <Text style={globalStyles.whiteText}>Register</Text>
          </TouchableHighlight>
        </View>
      );
    }
    return null;
  }
}
