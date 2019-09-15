import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import FirebaseConfig from './components/FirebaseConfig';
import * as firebase from 'firebase';
import RootNavigation from './navigation/RootNavigation';
import MainDrawerNavigator from './navigation/MainDrawerNavigator';

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoadingComplete: false,
      isAuthenticationComplete: false,
      isAuthenticated: false
    };

    if(!firebase.apps.length){ // Check to see if Firebase app is already initialized on Android
      firebase.initializeApp(FirebaseConfig.firebaseConfig);
    }
  }

  componentWillMount(){
  }

  render() {
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