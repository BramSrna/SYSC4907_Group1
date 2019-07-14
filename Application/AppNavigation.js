import React, { Component } from 'react';
import { createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import BramPage from './pages/BramPage';
import { Text, Animated, Easing } from 'react-native'

// drawer stack
const DrawerStack = createDrawerNavigator({
  HomePage: { screen: HomePage },
  BramPage: { screen: BramPage },
  JobinPage: {screen: JobinPage}
}, {
  gesturesEnabled: false
})

const DrawerNavigation = createStackNavigator({
  DrawerStack: { screen: DrawerStack }
}, {
  headerMode: 'float',
  navigationOptions: ({navigation}) => ({
    headerStyle: {backgroundColor: 'green'},
    title: 'Logged In to your app!',
    gesturesEnabled: false,
    headerLeft: <Text onPress={() => {
      // Coming soon: navigation.navigate('DrawerToggle')
      // https://github.com/react-community/react-navigation/pull/2492
      if (navigation.state.index === 0) {
        navigation.navigate('DrawerOpen')
      } else {
        navigation.navigate('DrawerClose')
      }
    }}>Menu</Text>
  })
})

// login stack
const LoginStack = createStackNavigator({
  LoginPage: { screen: LoginPage },
  // signupScreen: { screen: SignupScreen },
  // forgottenPasswordScreen: { screen: ForgottenPasswordScreen, navigationOptions: { title: 'Forgot Password' } }
}, {
  headerMode: 'float',
  navigationOptions: {
    headerStyle: {backgroundColor: 'red'},
    title: 'You are not logged in'
  }
})

// Manifest of possible screens
const PrimaryNav = createStackNavigator({
  loginStack: { screen: LoginStack },
  drawerStack: { screen: DrawerNavigation }
}, {
  // Default config for all screens
  headerMode: 'none',
  title: 'Main',
  initialRouteName: 'loginStack',
  // transitionConfig: noTransitionConfig
})

const Container = createAppContainer(PrimaryNav);
export default Container;