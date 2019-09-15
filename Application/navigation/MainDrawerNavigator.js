import HomePage from '../pages/HomePage';

export default TabNavigator(
  {
    Main: {
      screen: HomePage,
    },
  },
  {
    animationEnabled: false,
    swipeEnabled: false,
  }
);