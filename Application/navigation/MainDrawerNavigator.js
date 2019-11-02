import {
    createDrawerNavigator,
    createAppContainer
} from 'react-navigation';
import HomePage from '../pages/HomePage';
import AddItemPage from '../pages/AddItemPage'
import YourLists from '../pages/YourLists'
import CurrentList from '../pages/CurrentList'
import MapCreatorPage from '../pages/MapCreatorPage'

const MainDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: HomePage
    },
    AddItemPage: {
        screen: AddItemPage,
        navigationOptions: {
            drawerLabel: "Add Items"
        }
    },
    YourListsPage: {
        screen: YourLists,
        navigationOptions: {
            drawerLabel: "Your Lists"
        }
    },
    MapCreatorPage: {
        screen: MapCreatorPage,
        navigationOptions: {
            drawerLabel: "Map Creator"
        }
    },
    CurrentListPage: {
        screen: CurrentList,
        navigationOptions: {
            drawerLabel: () => null
        }
    }


}, {
    gesturesEnabled: false
});

const App = createAppContainer(MainDrawerNavigator);

export default App;