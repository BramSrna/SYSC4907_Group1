import { createDrawerNavigator, createAppContainer} from 'react-navigation';
import HomePage from '../pages/HomePage';
import AddItemPage from '../pages/AddItemPage'
import HaseebPage from '../pages/HaseebPage'
import YourLists from '../pages/YourLists'
import MapCreatorPage from '../pages/MapCreatorPage'

const MainDrawerNavigator = createDrawerNavigator(
    {
        Home: { screen: HomePage },
        YourLists: { screen: YourLists, navigationOptions:{drawerLabel: "Your Lists"}},
        HaseebPage: { screen: HaseebPage, navigationOptions:{drawerLabel: "Haseeb's Page"}},
        AddItemPage: {screen: AddItemPage, navigationOptions:{drawerLabel: "Add Items"}},
        MapCreatorPage: {screen: MapCreatorPage, navigationOptions:{drawerLabel: "Map Creator"}},
    },
    {
        gesturesEnabled: false
    }
);

const App = createAppContainer(MainDrawerNavigator);

export default App;