import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert,
  ActivityIndicator
} from "react-native";
import * as Firebase from "firebase";
import styles from "./pageStyles/RegisterPageStyle";
import FirebaseUser from "../components/FirebaseUser"

const REGISTER = "Register";
const LOGIN = "Already Registered/Login";

export default class RegisterPage extends Component {
  userAlreadyLoggedIn = false;
  state = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    registering: false
  }
  buttonListener = buttonId => {
    if (buttonId === REGISTER) {
      this.updateRegisterInfo();
    } else if (buttonId === LOGIN) {
      this.props.navigation.navigate("Login");
    }
  };

  async updateRegisterInfo() {
    if (this.checkInputs()) {
      this.setState({ registering: true });
      var displayName = this.state.firstname + " " + this.state.lastname;
      firebaseUser = new FirebaseUser();
      if (await firebaseUser.register(this.state.email, this.state.password, displayName)) {
        this.props.navigation.navigate("Verification");
        this.setState({ registering: false });
      }
    } else {
      Alert.alert("Invalid Inputs", "Please Confirm the inputs and try again.");
    }
  }

  checkInputs() {
    if (!this.state.email || !this.state.password
      || !this.state.firstname || !this.state.lastname) {
      return false;
    } else {
      if (this.state.password == this.state.confirmPassword) {
        return true;
      }
    }
  }

  userIsCurrentlyLoggedIn() {
    Firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        return true;
      }
    });
    return false;
  }

  componentWillMount() {
    this.setState({ firstname: "", lastname: "", email: "", password: "" });
    this.userAlreadyLoggedIn = this.userIsCurrentlyLoggedIn();
    if (this.userAlreadyLoggedIn) {
      this.props.navigation.navigate("HomePage");
    }
  }

  renderCurrentState() {
    if (this.state.registering) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (!this.userAlreadyLoggedIn) {
      return (
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Image
              style={styles.inputIcon}
              source={require("../assets/icons/icons8-name-64.png")}
            />
            <TextInput
              style={styles.inputs}
              placeholder="First Name"
              label="First Name"
              keyboardType="default"
              underlineColorAndroid="transparent"
              onChangeText={firstname => this.setState({ firstname })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Image
              style={styles.inputIcon}
              source={require("../assets/icons/icons8-last-name-64.png")}
            />
            <TextInput
              style={styles.inputs}
              placeholder="Last Name"
              label="Last Name"
              keyboardType="default"
              underlineColorAndroid="transparent"
              onChangeText={lastname => this.setState({ lastname })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Image
              style={styles.inputIcon}
              source={require("../assets/icons/icons8-mail-account-64.png")}
            />
            <TextInput
              style={styles.inputs}
              placeholder="Email"
              label="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              underlineColorAndroid="transparent"
              onChangeText={email => this.setState({ email })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Image
              style={styles.inputIcon}
              source={require("../assets/icons/icons8-key-64.png")}
            />
            <TextInput
              style={styles.inputs}
              placeholder="Password"
              label="Password"
              secureTextEntry={true}
              underlineColorAndroid="transparent"
              onChangeText={password => this.setState({ password })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Image
              style={styles.inputIcon}
              source={require("../assets/icons/icons8-re-key-64.png")}
            />
            <TextInput
              style={styles.inputs}
              placeholder="Confirm Password"
              label="Confirm Password"
              secureTextEntry={true}
              underlineColorAndroid="transparent"
              onChangeText={confirmPassword => this.setState({ confirmPassword })}
            />
          </View>

          <TouchableHighlight
            style={[styles.buttonContainer, styles.loginButton]}
            onPress={() => this.buttonListener(REGISTER)}
          >
            <Text style={styles.whiteText}>{REGISTER}</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.buttonContainer}
            onPress={() => this.buttonListener(LOGIN)}
          >
            <Text style={styles.whiteText}>{LOGIN}</Text>
          </TouchableHighlight>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderCurrentState()}
      </View>
    );
  }
}
