import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import FirebaseConfig from './components/FirebaseConfig';
import * as firebase from 'firebase';
import RootNavigation from './navigation/RootNavigation';
import MainDrawerNavigator from './navigation/MainDrawerNavigator';
import { AppLoading } from 'expo';

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoadingComplete: false,
      isAuthProcessReady: false,
      isAuthenticated: false
    };

    if(!firebase.apps.length){ // Check to see if Firebase app is already initialized on Android
       app = firebase.initializeApp(FirebaseConfig.firebaseConfig);
    }
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged); // See if the user is authenticated
  }

  onAuthStateChanged = (user) => {
    this.setState({isAuthProcessReady: true});
    this.setState({isAuthenticated: !!user}); // (Bang Bang) !! returns the true value of the obj
  }

  componentWillMount(){
  }

  render() {
    if((!this.state.isLoadingComplete || !this.state.isAuthProcessReady) && !this.props.skipLoadingScreen){
      return(
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