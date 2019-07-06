import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert
} from 'react-native';
import styles from '../pages/pageStyles/LoginPageStyle';
const LOGIN = "Login";
const FORGOT_PASSWORD = "Forgot your password?";
const REGISTER = "Register";

export default class LoginPage extends Component {

  userAlreadyLoggedIn = false;

  buttonListener = (buttonId) => {
    if(buttonId === LOGIN) {
      this.props.navigation.navigate('HomePage');
    }
  }

  userIsCurrentlyLoggedIn() {
    return false;
    // return true;
  }

  componentWillMount() {
    this.userAlreadyLoggedIn = this.userIsCurrentlyLoggedIn();
    if(this.userAlreadyLoggedIn) {
       this.props.navigation.navigate('HomePage');
    }
  }

  render() {
    if(!this.userAlreadyLoggedIn) {
      return (
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/message/ultraviolet/50/3498db'}}/>
            <TextInput style={styles.inputs}
                placeholder="Email"
                keyboardType="email-address"
                underlineColorAndroid='transparent'
                onChangeText={(email) => this.setState({email})}/>
          </View>
          
          <View style={styles.inputContainer}>
            <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db'}}/>
            <TextInput style={styles.inputs}
                placeholder="Password"
                secureTextEntry={true}
                underlineColorAndroid='transparent'
                onChangeText={(password) => this.setState({password})}/>
          </View>

          <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.buttonListener(LOGIN)}>
            <Text style={styles.whiteText}>{LOGIN}</Text>
          </TouchableHighlight>

          <TouchableHighlight style={styles.buttonContainer} onPress={() => this.buttonListener(FORGOT_PASSWORD)}>
              <Text style={styles.whiteText}>{FORGOT_PASSWORD}</Text>
          </TouchableHighlight>

          <TouchableHighlight style={styles.buttonContainer} onPress={() => this.buttonListener(REGISTER)}>
              <Text style={styles.whiteText}>{REGISTER}</Text>
          </TouchableHighlight>
        </View>
      );
    }
    return null;
  }
}