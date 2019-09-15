import {
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator
} from "react-navigation";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AddItemPage from "./pages/AddItemPage";
import VerificationPage from "./pages/VerificationPage";
import HaseebPage from "./pages/HaseebPage";
import RegisterPage from "./pages/RegisterPage";
import YourLists from "./pages/YourLists";

const LoginStack = createStackNavigator(
  {
    Login: {screen: LoginPage},
    Registration: {screen:RegisterPage},
    Verification: {screen: VerificationPage},
  },
  {
    headerMode: "none"
  }
);

const DrawerStack = createDrawerNavigator(
  {
    GoToVerificationPage: { screen: VerificationPage },
    GoToHomePage: { screen: HomePage },
    GoToHaseebPage: { screen: HaseebPage },
    GoToAddItemPage: { screen: AddItemPage },    
    GoToListPage: { screen: YourLists }
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
