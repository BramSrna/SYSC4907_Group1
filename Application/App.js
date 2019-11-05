import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import FirebaseConfig from './components/FirebaseConfig';
import * as firebase from 'firebase';
import RootNavigation from './navigation/RootNavigation';
import MainDrawerNavigator from './navigation/MainDrawerNavigator';
import { Asset } from 'expo-asset';
import { AppLoading } from 'expo';
import { YellowBox } from 'react-native';
import _ from 'lodash';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
      isAuthProcessReady: false,
      isAuthenticated: false
    };

    //Temprory Solution to remove Timer warning on android
    YellowBox.ignoreWarnings(['Setting a timer']);
    const _console = _.clone(console);
    console.warn = message => {
      if (message.indexOf('Setting a timer') <= -1) {
        _console.warn(message);
      }
    };

    if (!firebase.apps.length) { // Check to see if Firebase app is already initialized on Android
      app = firebase.initializeApp(FirebaseConfig.firebaseConfig);
    }
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged); // See if the user is authenticated
  }

  onAuthStateChanged = (user) => {
    this.setState({ isAuthProcessReady: true });
    this.setState({ isAuthenticated: !!user }); // (Bang Bang) !! returns the true value of the obj
  }

  render() {
    if ((!this.state.isLoadingComplete || !this.state.isAuthProcessReady) && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    }
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
        {(this.state.isAuthenticated) ? <MainDrawerNavigator /> : <RootNavigation />}
      </View>
    );
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        // Add all necessary assets here
        require('./assets/icon.png'),
        require('./assets/splash.png'),
      ]),
    ]);
  };

  _handleLoadingError = error => {
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});