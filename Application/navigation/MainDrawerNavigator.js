import {
    createDrawerNavigator,
    createAppContainer,
    createStackNavigator
} from 'react-navigation';
import HomePage from '../pages/HomePage';
import YourLists from '../pages/YourLists';
import CurrentList from '../pages/CurrentList';
import MapCreatorPage from '../pages/MapCreatorPage';
import SideMenu from './SideMenu';
import RegisterItemPage from '../pages/RegisterItemPage';
import CrowdSourcePage from '../pages/CrowdSourcePage';
import AddItemLocationPage from '../pages/AddItemLocationPage';
import YourContacts from '../pages/YourContacts';
import NewContact from '../pages/NewContact';
import ExcelParserPage from '../pages/ExcelParserPage';
import AddItemPage from '../pages/AddItemPage';
import SelectStorePage from '../pages/SelectStorePage';
import FindRecipePage from '../pages/FindRecipePage';
import MapsPage from '../pages/MapsPage';
import RecipeDetailsPage from '../pages/RecipeDetailsPage';

const StackNavigator = createStackNavigator({
    Home: {
        screen: HomePage
    },
    AddItemLocationPage: {
        screen: AddItemLocationPage
    },
    MapCreatorPage: {
        screen: MapCreatorPage
    },
    YourListsPage: {
        screen: YourLists
    },
    CurrentListPage: {
        screen: CurrentList
    },
    CrowdSourcePage: {
        screen: CrowdSourcePage
    },
    RegisterItemPage: {
        screen: RegisterItemPage
    },
    YourContacts: {
        screen: YourContacts
    },
    NewContact: {
        screen: NewContact
    },
    ExcelParserPage: {
        screen: ExcelParserPage
    },
    AddItemPage: {
        screen: AddItemPage
    },
    SelectStorePage: {
        screen: SelectStorePage
    },
    FindRecipePage: {
        screen: FindRecipePage
    },
    MapsPage: {
        screen: MapsPage
    },
    RecipeDetailsPage: {
        screen: RecipeDetailsPage
    }
}, {
    initialRouteName: "Home",
    headerMode: "none"
});

const MainDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: StackNavigator,
        navigationOptions: {
            drawerLabel: "Home"
        }
    },
    AddItemLocationPage: {
        screen: StackNavigator,
        navigationOptions: {
            drawerLabel: "Add Item Location"
        }
    },
    MapCreatorPage: {
        screen: StackNavigator,
        navigationOptions: {
            drawerLabel: "Map a Store"
        }
    },
    YourListsPage: {
        screen: StackNavigator,
        navigationOptions: {
            drawerLabel: "Your Lists"
        }
    },
    CrowdSourcePage: {
        screen: StackNavigator,
        navigationOptions: {
            drawerLabel: () => null
        }
    },
    RegisterItemPage: {
        screen: StackNavigator,
        navigationOptions: {
            drawerLabel: "Register an Item"
        }
    },
    CurrentListPage: {
        screen: StackNavigator,
        navigationOptions: {
            drawerLabel: () => null
        }
    },
    YourContacts: {
        screen: StackNavigator,
        navigationOptions: {
            drawerLabel: "Contacts"
        }
    },
    NewContact: {
        screen: StackNavigator,
        navigationOptions: {
            drawerLabel: () => null
        }
    },
    ExcelParserPage: {
        screen: StackNavigator,
        navigationOptions: {
            drawerLabel: "Excel Parser"
        }
    },
    FindRecipePage: {
        screen: StackNavigator,
        navigationOptions: {
            drawerLabel: "Search for a Recipe"
        }
    },
    RecipeDetailsPage: {
        screen: StackNavigator,
        navigationOptions: {
            drawerLabel: () => null
        }
    },
}, {
    gesturesEnabled: false,
    contentComponent: SideMenu,
    drawerWidth: 250
});

const App = createAppContainer(MainDrawerNavigator);

export default App;