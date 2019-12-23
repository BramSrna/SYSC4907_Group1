import React, { Component } from "react";
import { Alert, StyleSheet, KeyboardAvoidingView } from "react-native";
import { Layout, Button, Input, Icon } from 'react-native-ui-kitten';
import * as firebase from "firebase";
import globalStyles from "../pages/pageStyles/GlobalStyle";

const RESETPASS = "Reset Password";

class ForgotPasswordPage extends Component {
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
        this.props.navigation.navigate(LOGINPAGE);
    }

    render() {
        return (
            <Layout style={globalStyles.defaultContainer}>
                <KeyboardAvoidingView behavior="padding">
                    <Layout style={styles.columnContainer}>
                        <Layout style={styles.rowContainer}>
                            <Input
                                style={styles.input}
                                placeholder="Enter your email..."
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCompleteType="email"
                                onChangeText={email => this.setState({ email })}
                                value={this.state.email} />
                        </Layout>
                        <Layout style={styles.rowContainer}>
                            <Button
                                style={styles.button}
                                onPress={this.resetPassword}>
                                {RESETPASS}
                            </Button>
                        </Layout>
                    </Layout>
                </KeyboardAvoidingView>
            </Layout>
        );
    }
}

const styles = StyleSheet.create({
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

export default ForgotPasswordPage;
