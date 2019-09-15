import React, { Component } from "react";
import {Text, View, TextInput, TouchableHighlight, Image} from "react-native";
import styles from "./pageStyles/GlobalStyle"
import * as Firebase from "firebase";

export default class ForgotPasswordPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ""
        };
    }

    resetPassword = () => {

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
                        source={{
                            uri: "https://png.icons8.com/message/ultraviolet/50/3498db"
                        }}
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
