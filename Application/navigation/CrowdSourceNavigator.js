import { createDrawerNavigator, createAppContainer} from 'react-navigation';
import RegisterItemPage from '../pages/RegisterItemPage'
import CrowdSourcePage from '../pages/CrowdSourcePage';
import AddItemLocationPage from '../pages/AddItemLocationPage';
import MapCreatorPage from '../pages/MapCreatorPage'

/**
 * This is the navigator used for accessing
 * the crowd sourcing components in the application.
 */
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