import {
    createDrawerNavigator,
    createAppContainer,
    createStackNavigator
} from 'react-navigation';
import HomePage from '../pages/HomePage';
import AddItemPage from '../pages/AddItemPage'
import YourLists from '../pages/YourLists'
import CurrentList from '../pages/CurrentList'
import MapCreatorPage from '../pages/MapCreatorPage'

const StackNavigator = createStackNavigator({
    Home: {
        screen: HomePage
    },
    AddItemPage: {
        screen: AddItemPage
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
}, {
    headerMode: "none"
});

const MainDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: StackNavigator,
        navigationOptions: {
            drawerLabel: "Home"
        }
    },
    AddItemPage: {
        screen: StackNavigator,
        navigationOptions: {
            drawerLabel: "Add Items"
        }
    },
    MapCreatorPage: {
        screen: StackNavigator,
        navigationOptions: {
            drawerLabel: "Map Creator"
        }
    },
    YourListsPage: {
        screen: StackNavigator,
        navigationOptions: {
            drawerLabel: "Your Lists"
        }
    },
    CurrentListPage: {
        screen: StackNavigator,
        navigationOptions: {
            drawerLabel: () => null
        }
    },

}, {
    gesturesEnabled: false,
    contentOptions: {
        activeBackgroundColor: 'white',
        activeTintColor: 'black'
    }
});

const App = createAppContainer(MainDrawerNavigator);

export default App;