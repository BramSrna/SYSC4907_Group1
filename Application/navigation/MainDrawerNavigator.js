import {
    createDrawerNavigator,
    createAppContainer
} from 'react-navigation';
import HomePage from '../pages/HomePage';
import YourLists from '../pages/YourLists'
import CurrentList from '../pages/CurrentList'

import CrowdSourcePage from '../pages/CrowdSourcePage'
import CrowdSourceNavigator from './CrowdSourceNavigator';

const MainDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: HomePage
    },
    CrowdSourceOptionPage: {
        screen: CrowdSourcePage,
        navigationOptions:{
            drawerLabel: "Crowd Source Options"
        }
    },
    CrowdSource: {
        screen: CrowdSourceNavigator
    },
    YourListsPage: {
        screen: YourLists,
        navigationOptions: {
            drawerLabel: "Your Lists"
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