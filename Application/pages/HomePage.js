import React, { Component } from "react";
import { StyleSheet, Dimensions } from 'react-native';
import { Layout, TopNavigation, TopNavigationAction, OverflowMenu, } from 'react-native-ui-kitten';
import { MenuOutline, SunIcon, MenuIcon } from "../assets/icons/icons.js";
import { dark, light } from '../assets/Themes.js';
import { ScrollView } from "react-native-gesture-handler";
import HomeSquareContainer from "../components/HomeSquareContainer.js";
import lf from '../pages/ListFunctions.js';

const PAGE_TITLE = "Home";
const YOUR_LISTS_PAGE = "YourListsPage";
const CROWD_SOURCE_PAGE = "CrowdSourcePage";
const MARGIN_RATIO = 30; // higher number = smaller margin

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
      menuVisible: false,
    };
    this.onLayout = this.onLayout.bind(this);
  }

  onLayout(e) {
    this.setState({
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    });
  }

  menuData = [
    { title: 'Toggle Theme', icon: SunIcon },
  ];

  calcMarginValue = (deviceWidth, tpr) => {
    marginValue = deviceWidth / (tpr * MARGIN_RATIO);
    return marginValue;
  };

  calcSizeValue = (deviceWidth, tpr) => {
    marginValue = deviceWidth / (tpr * MARGIN_RATIO);
    sizeValue = (deviceWidth - marginValue * (tpr * 2)) / tpr;
    return sizeValue;
  };

  renderLeftMenuAction = () => (
    <TopNavigationAction icon={MenuOutline} onPress={() => this.props.navigation.toggleDrawer()} />
  );

  renderRightMenuAction = () => (
    <OverflowMenu
      style={styles.overflowMenu}
      visible={this.state.menuVisible}
      data={this.menuData}
      placement='bottom end'
      onSelect={this.onMenuItemSelect}
      onBackdropPress={this.onMenuActionPress}>
      <TopNavigationAction
        icon={MenuIcon}
        onPress={this.onMenuActionPress}
      />
    </OverflowMenu>
  );

  onMenuActionPress = () => {
    this.setState({ menuVisible: !this.state.menuVisible });
  };

  onMenuItemSelect = (index) => {
    if (index = 1) {
      lf.ToggleTheme();
    }
    this.setState({ menuVisible: false });
  };

  render() {
    aspectRatio = this.state.height / this.state.width;
    gridShape = aspectRatio > 1.6 ? 2 : 4;
    marginValue = this.calcMarginValue(this.state.width, gridShape);
    sizeValue = this.calcSizeValue(this.state.width, gridShape);
    return (
      <React.Fragment >
        <TopNavigation
          title={PAGE_TITLE}
          alignment='center'
          leftControl={this.renderLeftMenuAction()}
          rightControls={this.renderRightMenuAction()}
        />
        <ScrollView style={[styles.scrollContainer, { backgroundColor: global.theme == light ? light["background-basic-color-1"] : dark["background-basic-color-1"] }]}>
          <Layout style={styles.container} onLayout={this.onLayout} >
            <HomeSquareContainer sizeValue={sizeValue} marginValue={marginValue} name='Your Lists' icon='list-outline' onPress={() => this.props.navigation.navigate(YOUR_LISTS_PAGE)} />
            <HomeSquareContainer sizeValue={sizeValue} marginValue={marginValue} name='Your Contacts' icon='people-outline' />
            <HomeSquareContainer sizeValue={sizeValue} marginValue={marginValue} name='Find Stores' icon='map-outline' />
            <HomeSquareContainer sizeValue={sizeValue} marginValue={marginValue} name='Search Recipes' icon='search-outline' />
            <HomeSquareContainer sizeValue={sizeValue} marginValue={marginValue} name='Your Recommendations' icon='bulb-outline' shape={2} />
            <HomeSquareContainer sizeValue={sizeValue} marginValue={marginValue} name='Shared With You' icon='share-outline' />
            <HomeSquareContainer sizeValue={sizeValue} marginValue={marginValue} name='Crowd-Source' icon='loader-outline' onPress={() => this.props.navigation.navigate(CROWD_SOURCE_PAGE)} />
          </Layout>
        </ScrollView>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  scrollContainer: {
    flex: 1,
  },
  overflowMenu: {
    padding: 4,
    shadowColor: 'black',
    shadowOpacity: .5,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
});

export default HomePage;
