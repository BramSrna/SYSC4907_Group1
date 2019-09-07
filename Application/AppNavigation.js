import {
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator
} from "react-navigation";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AddItemPage from "./pages/AddItemPage";
import JobinPage from "./pages/JobinPage";
import HaseebPage from "./pages/HaseebPage";
import RegisterPage from "./pages/RegisterPage";
import YourLists from "./pages/YourLists";
import CurrentList from "./pages/CurrentList";

const DrawerStack = createDrawerNavigator(
  {
    Homepage: { screen: HomePage },
    "Haseeb's Page": { screen: HaseebPage },
    "Add an Item": { screen: AddItemPage },
    "Jobin's Page": { screen: JobinPage },
    "Your Lists": { screen: YourLists },
    "Current List": {
      screen: CurrentList,
      navigationOptions: {
      drawerLabel: () => null
      }
    }
  },
  {
    gesturesEnabled: false
  }
);

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
    GoToLoginPage: { screen: LoginPage },
    GoToRegisterPage: { screen: RegisterPage }
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
    drawerStack: { screen: DrawerNavigation }
  },
  {
    headerMode: "none",
    title: "Main",
    initialRouteName: "loginStack"
  }
);

const Container = createAppContainer(PrimaryNav);
export default Container;
