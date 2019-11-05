import React, { Component } from 'react';
import { Image, Platform, StatusBar, StyleSheet, View } from 'react-native';
import FirebaseConfig from './components/FirebaseConfig';
import * as firebase from 'firebase';
import RootNavigation from './navigation/RootNavigation';
import MainDrawerNavigator from './navigation/MainDrawerNavigator';
import { Asset } from 'expo-asset';
import { SplashScreen } from 'expo';
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

  componentDidMount() {
    SplashScreen.preventAutoHide();
  }

  render() {
    if ((!this.state.isLoadingComplete || !this.state.isAuthProcessReady) && !this.props.skipLoadingScreen) {
      return (
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Image style={{
            height: '100%',
            aspectRatio: .5,
          }}
            source={require('./assets/splash.gif')}
            onLoad={this._loadResourcesAsync}
          />
        </View>
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
    await Promise.all([
      Asset.loadAsync([
        // Add all necessary assets here
      ]),
    ]);
    SplashScreen.hide();
    this.setState({ isLoadingComplete: true });
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