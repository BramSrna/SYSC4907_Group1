import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Image,
  Alert,
  ActivityIndicator
} from "react-native";
import Firebase from "firebase";
import styles from "../pages/pageStyles/LoginPageStyle";
import globalStyles from "../pages/pageStyles/GlobalStyle";
import FirebaseUser from "../components/FirebaseUser";
const LOGIN = "Login";
const FORGOT_PASSWORD = "Forgot your password?";
const REGISTER = "RegisterPage";
const HOMEPAGE = "HomePage";

export default class LoginPage extends Component {
  userAlreadyLoggedIn = false;
  state = {
    email: "",
    password: "",
    authenticating: false
  }

  buttonListener = buttonId => {
    if (buttonId == LOGIN) {
      this.onPressLoginIn();
    } else if (buttonId == REGISTER) {
      this.props.navigation.navigate("GoToRegisterPage");
    } else if (buttonId == FORGOT_PASSWORD) {
      Alert.alert("ERROR", "IN DEVELOPMENT");
    }
  };

  onPressLoginIn() {
    if(!this.state.email || !this.state.password){
      Alert.alert("Invalid Email/Password", "Please enter a valid email/password.");
      return console.log("Email and password required!");
    }
    this.setState({ authenticating: true });

    if (this.authenticateUser(this.state.email, this.state.password)) {
      user = new FirebaseUser();
      if (user != null && user.email == this.state.email) {
        if (!user.emailVerified) {
          this.props.navigation.navigate("GoToVerificationPage");
        }
        else {
          this.props.navigation.navigate("GoToHomePage");
        }
      }
    }
  }

  authenticateUser(email, password) {
    Firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      Alert.alert("Invalid Email/Password", "Please enter a valid email/password.");
      console.log(errorCode + " " + errorMessage);
      return false;
    });
    return true;
  }

  signUserOutIfLoggedIn() {
    if (Firebase.auth().onAuthStateChanged(async function (user) {
      if (user) {
        await Firebase.auth().signOut().then(function () {
          return true;
        });
      }
    }));
    return false;
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
    this.userAlreadyLoggedIn = this.userIsCurrentlyLoggedIn();
    if (this.userAlreadyLoggedIn) {
      this.props.navigation.navigate(HOMEPAGE);
    }
  }

  renderCurrentState() {
    if (this.state.authenticating) {
      return (
        <View>
          <ActivityIndicator size="large" />
        </View>
      )
    }

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
              placeholder="Enter your email..."
              label="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              underlineColorAndroid="transparent"
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
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
              placeholder="Enter your password..."
              label="Password"
              secureTextEntry={true}
              underlineColorAndroid="transparent"
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
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
  }

  render() {
    return (
      <View style={globalStyles.defaultContainer}>
        {this.renderCurrentState()}
      </View>
    );
  }
}
