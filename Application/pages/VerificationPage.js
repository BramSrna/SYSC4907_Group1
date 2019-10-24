import React, { Component } from "react";
import {
  Text,
  View,
  Alert,
  TouchableHighlight
} from "react-native";
import styles from "./pageStyles/VerificationPageStyle";
import globalStyles from "./pageStyles/GlobalStyle";
import FirebaseUser from "../components/FirebaseUser";

const VERIFY = "Verify";
const RESEND = "Resend confirmation link";

const HOMEPAGE = "Home";

export default class VerificationPage extends Component {
  constructor(props) {
    super(props);
  }

  buttonListener = buttonId => {
    if (buttonId === VERIFY) {
      if(this.checkEmailVerification()){
        this.props.navigation.navigate(HOMEPAGE);
      } else{
        Alert.alert("Email Not Verified", "Check email for verification link.");
        console.log("Email Verification Check Failed!");
      }
    } else if (buttonId === RESEND){
      firebaseUser = new FirebaseUser();
      firebaseUser.requestVerificationEmail();
    }
  };

  checkEmailVerification(){
    firebaseUser = new FirebaseUser();
    return firebaseUser.isUserEmailVerified();
  }

  render() {
    return (
      <View style={globalStyles.defaultContainer}>
        <Text style={globalStyles.whiteTextPadding}>Please confirm your email address by clicking the verification link that was send to the email address that was provided during registration.</Text>
        <Text style={globalStyles.whiteTextPadding}>Check your junk folder if you cannot find the email or you can request a new confirmation email.</Text>
        <TouchableHighlight
            style={[styles.buttonContainer, styles.loginButton]}
            onPress={() => this.buttonListener(VERIFY)}
          >
            <Text style={styles.whiteText}>{VERIFY}</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.buttonContainer}
            onPress={() => this.buttonListener(RESEND)}
          >
            <Text style={styles.whiteText}>{RESEND}</Text>
          </TouchableHighlight>
      </View>
    );
  }
}
