import {
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator
} from "react-navigation";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import BramPage from "./pages/BramPage";
import JobinPage from "./pages/JobinPage";
import HaseebPage from "./pages/HaseebPage";
import RegisterPage from "./pages/RegisterPage";
import YourLists from "./pages/YourLists";
import CurrentList from "./pages/CurrentList";

const DrawerStack = createDrawerNavigator({
  Homepage: { screen: HomePage },
  "Haseeb's Page": { screen: HaseebPage },
  "Bram's Page": { screen: BramPage },
  "Jobin's Page": { screen: JobinPage },
  "Your Lists": { screen: YourLists },
  "Current List": {
    screen: CurrentList,
    navigationOptions: {
      drawerLabel: () => null
    }
  }
});

const DrawerNavigation = createStackNavigator(
  {
    DrawerStack: { screen: DrawerStack }
  },
  {
    headerMode: "none"
  }
);

// login stack
const LoginStack = createStackNavigator(
  {
    LoginPage: { screen: LoginPage },
    RegisterPage: { screen: RegisterPage }
  },
  {
    headerMode: "none",
    navigationOptions: {
      headerVisible: false
    }
  }
);

// Manifest of possible screens
const PrimaryNav = createStackNavigator(
  {
    loginStack: { screen: LoginStack },
    drawerStack: {
      screen: DrawerNavigation,
      navigationOptions: {
        // Do not let swiping back go to back page (Login Page)
        gesturesEnabled: false
      }
    }
  },
  {
    headerMode: "none",
    title: "Main",
    initialRouteName: "loginStack"
  }
);

const Container = createAppContainer(PrimaryNav);
export default Container;
