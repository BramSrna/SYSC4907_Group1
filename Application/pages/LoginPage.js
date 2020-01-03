import React, { Component } from "react";
import { KeyboardAvoidingView, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { Layout, Button, Input, Icon } from 'react-native-ui-kitten';
import { ScrollView } from "react-native-gesture-handler";
import Firebase from "firebase";
import globalStyles from "../pages/pageStyles/GlobalStyle";
import FirebaseUser from "../components/FirebaseUser";

const LOGIN = "Login";
const REGISTER = "Register";
const FORGOT_PASSWORD = "Forgot your password?";
const HOMEPAGE = "Home";
const REGISTERPAGE = "Registration";
const FORGOTPASSWORDPAGE = "ForgotPassword";
const VERIFICATIONPAGE = "Verification";

class LoginPage extends Component {
  userAlreadyLoggedIn = false;
  state = {
    email: "",
    password: "",
    secureTextEntry: true,
    authenticating: false
  }

  buttonListener = buttonId => {
    if (buttonId == LOGIN) {
      this.onPressLoginIn();
    } else if (buttonId == REGISTER) {
      this.props.navigation.navigate(REGISTERPAGE);
    } else if (buttonId == FORGOT_PASSWORD) {
      this.props.navigation.navigate(FORGOTPASSWORDPAGE);
    }
  };

  onPressLoginIn() {
    if (!this.state.email || !this.state.password) {
      Alert.alert("Invalid Email/Password", "Please enter a valid email/password.");
      return console.log("Email and password required!");
    }
    this.setState({ authenticating: true });

    if (this.authenticateUser(this.state.email, this.state.password)) {
      user = new FirebaseUser();
      if (user != null && user.email == this.state.email) {
        if (!user.emailVerified) {
          this.props.navigation.navigate(VERIFICATIONPAGE);
        }
        else {
          this.props.navigation.navigate(HOMEPAGE);
        }
      }
    }
    this.setState({ authenticating: false });

  }

  authenticateUser = (email, password) => {
    Firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      return true;
    }, (error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      Alert.alert("Invalid Email/Password", "Please enter a valid email/password.");
      console.log(errorCode + " " + errorMessage);
      return false;
    });
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

  renderPasswordEyeIcon = (style) => {
    const iconName = this.state.secureTextEntry ? 'eye-off' : 'eye';
    return (
      <Icon {...style} name={iconName} />
    );
  };

  onPasswordEyeIconPress = () => {
    const secureTextEntry = !this.state.secureTextEntry;
    this.setState({ secureTextEntry });
  };

  renderCurrentState() {
    if (this.state.authenticating) {
      return (
        <Layout style={styles.columnContainer}>
          <ActivityIndicator size="large" />
        </Layout>
      )
    }

    if (!this.userAlreadyLoggedIn) {
      return (
        <Layout style={styles.columnContainer}>
          <Layout style={styles.rowContainer}>
            <Input
              style={styles.input}
              placeholder="Enter your email..."
              ref="email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCompleteType="email"
              returnKeyType='next'
              onChangeText={email => this.setState({ email })}
              onSubmitEditing={() => this.refs.password.focus()}
              blurOnSubmit={false}
              value={this.state.email} />
          </Layout>
          <Layout style={styles.rowContainer}>
            <Input
              style={styles.input}
              placeholder="Enter your password..."
              ref="password"
              autoCapitalize="none"
              autoCompleteType="password"
              icon={this.renderPasswordEyeIcon}
              secureTextEntry={this.state.secureTextEntry}
              onIconPress={this.onPasswordEyeIconPress}
              onChangeText={password => this.setState({ password })}
              onSubmitEditing={() => this.refs.login.scrollTo}
              value={this.state.password} />
          </Layout>
          <Layout style={styles.rowContainer}>
            <Button
              style={styles.button}
              ref="login"
              onPress={() => this.buttonListener(LOGIN)}>
              {LOGIN}
            </Button>
          </Layout>
          <Layout style={styles.rowContainer}>
            <Button
              style={styles.button}
              appearance='ghost'
              onPress={() => this.buttonListener(FORGOT_PASSWORD)}>
              {FORGOT_PASSWORD}
            </Button>
          </Layout>
          <Layout style={styles.rowContainer}>
            <Button
              style={styles.button}
              appearance='ghost'
              onPress={() => this.buttonListener(REGISTER)}>
              {REGISTER}
            </Button>
          </Layout>
        </Layout>
      );
    }
  }

  render() {
    return (
      <Layout style={globalStyles.defaultContainer}>
        <KeyboardAvoidingView behavior="padding">
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {this.renderCurrentState()}
          </ScrollView>
        </KeyboardAvoidingView>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  columnContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  button: {
    marginVertical: 4,
    marginHorizontal: 4,
    borderRadius: 30,
    width: 250,
  },
  input: {
    flexDirection: 'row',
    borderRadius: 30,
    width: 250,
  },
});

export default LoginPage;
