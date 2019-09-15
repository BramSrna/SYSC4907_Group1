import React from 'react';
import { StackNavigator } from 'react-navigation';
import MainDrawerNavigator from './MainDrawerNavigator';

import LoginPage from "./pages/LoginPage";
import VerificationPage from "./pages/VerificationPage";
import RegisterPage from "./pages/RegisterPage";

const RootStackNavigator = StackNavigator(
  {
    Login: {screen: LoginPage},
    Registration: {screen:RegisterPage},
    Verification: {screen: VerificationPage},

    Main: { screen: MainDrawerNavigator, },
  },
  {
    headerMode: "none"
  }
);

export default class RootNavigation extends React.Component {
  render() {
    return <RootStackNavigator />;
  }
}