import React, { Component } from "react";
import { Alert, StyleSheet } from "react-native";
import { Text, Layout, Button, ButtonGroup } from 'react-native-ui-kitten';
import globalStyles from "./pageStyles/GlobalStyle";
import FirebaseUser from "../components/FirebaseUser";

const VERIFY = "Verify";
const RESEND = "Resend confirmation link";
const HOMEPAGE = "Home";

class VerificationPage extends Component {
  constructor(props) {
    super(props);
  }

  buttonListener = buttonId => {
    var firebaseUser = new FirebaseUser();
    if (buttonId === VERIFY) {
      setTimeout(function () {
        firebaseUser.reloadUserInfo();
      }, 1000);
      firebaseUser.getIdToken();
      if (firebaseUser.isUserEmailVerified()) {
        console.log('VerificationPage: navigate to HomePage');
      } else {
        Alert.alert("Email Not Verified", "Check email for verification link.");
        console.log("VerificationPage: Email Verification Check Failed!");
      }
    } else if (buttonId === RESEND) {
      firebaseUser.requestVerificationEmail();
    }
  };

  render() {
    return (
      <Layout style={globalStyles.defaultContainer}>
        <Text style={styles.textPadding}>Please confirm your email address by clicking the verification link that was send to the email address that was provided during registration.</Text>
        <Text style={styles.textPadding}>Check your junk folder if you cannot find the email or you can request a new confirmation email.</Text>
        <ButtonGroup appearance='outline' status='primary'>
          <Button onPress={() => this.buttonListener(VERIFY)} >{VERIFY}</Button>
          <Button onPress={() => this.buttonListener(RESEND)} >{RESEND}</Button>
        </ButtonGroup>
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
  textPadding: {
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center'
  },
});

export default VerificationPage;