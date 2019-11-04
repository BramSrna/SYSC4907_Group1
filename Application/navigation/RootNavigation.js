import {createStackNavigator, createAppContainer} from 'react-navigation';

import LoginPage from "../pages/LoginPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import VerificationPage from "../pages/VerificationPage";
import RegisterPage from "../pages/RegisterPage";
import MainDrawerNavigator from './MainDrawerNavigator';

const RootStackNavigator = createStackNavigator(
  {
    Login: {screen: LoginPage},
    ForgotPassword: {screen: ForgotPasswordPage},
    Registration: {screen:RegisterPage},
    Verification: {screen: VerificationPage},

    Main: { screen: MainDrawerNavigator, },
  },
  {
    headerMode: "none"
  }
);

const App = createAppContainer(RootStackNavigator);

export default App;