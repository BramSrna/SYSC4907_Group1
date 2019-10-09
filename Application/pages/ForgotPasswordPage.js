import React, { Component } from "react";
import { Text, View, TextInput, TouchableHighlight, Image, Alert } from "react-native";
import styles from "./pageStyles/GlobalStyle"
import * as firebase from "firebase";

export default class ForgotPasswordPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ""
        };
    }

    resetPassword = () => {
        firebase.auth().sendPasswordResetEmail(this.state.email).then(() => {
            Alert.alert("Password Reset Link Sent", "Please check your email for the password reset link.");
        }, (error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            Alert.alert(errorCode, errorMessage);
            console.log(errorCode + " " + errorMessage);
        });
    }

    onBackToLoginPress = () => {
        this.props.navigation.navigate("Login");
    }

    render() {
        return (
            <View style={styles.defaultContainer}>
                <View style={styles.defaultInputContainer}>
                    <Image
                        style={styles.defaultInputIcon}
                        source={require("../assets/icons/icons8-mail-account-64.png")}
                    />
                    <TextInput
                        style={styles.defaultInputs}
                        placeholder="Enter your email..."
                        label="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        underlineColorAndroid="transparent"
                        onChangeText={email => this.setState({ email })}
                        value={this.state.email}
                    />
                </View>
                <TouchableHighlight
                    style={[styles.defaultButtonContainer, styles.defaultButton]}
                    onPress={this.resetPassword}
                >
                    <Text style={styles.whiteText}>{"Reset Password"}</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.defaultButtonContainer}
                    onPress={this.onBackToLoginPress}
                >
                    <Text style={styles.whiteText}>{"Back to Login"}</Text>
                </TouchableHighlight>
            </View>
        );
    }
}
