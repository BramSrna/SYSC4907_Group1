import { createDrawerNavigator, createAppContainer} from 'react-navigation';
import HomePage from '../pages/HomePage';
import RegisterItemPage from '../pages/RegisterItemPage'
import YourLists from '../pages/YourLists'
import CrowdSourcePage from '../pages/CrowdSourcePage';
import AddItemLocationPage from '../pages/AddItemLocationPage';
import MapCreatorPage from '../pages/MapCreatorPage'

const CrowdSourceNavigator = createDrawerNavigator(
    {
        MainCrowdSourcePage: {
            screen: CrowdSourcePage
        },
        RegisterItemPage: {
            screen: RegisterItemPage,
            navigationOptions:{
                drawerLabel: "Register Items"
            }
        },
        AddItemLocationPage: {
            screen: AddItemLocationPage, 
            navigationOptions:{
                drawerLabel: "Add Item Locations"
            }
        },
        MapCreatorPage: {
            screen: MapCreatorPage,
            navigationOptions: {
                drawerLabel: "Map Creator"
            }
        },
    },
    {
        gesturesEnabled: false
    }
);

const App = createAppContainer(CrowdSourceNavigator);

export default App; 