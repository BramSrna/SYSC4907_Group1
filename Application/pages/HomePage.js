import React, { Component } from "react";
import { StyleSheet, Dimensions } from 'react-native';
import { Layout, TopNavigation, TopNavigationAction, OverflowMenu, } from 'react-native-ui-kitten';
import { MenuOutline, Moon, MoonOutline, MenuIcon } from "../assets/icons/icons.js";
import { dark, light } from '../assets/Themes.js';
import { ScrollView } from "react-native-gesture-handler";
import HomeSquareContainer from "../components/HomeSquareContainer.js";

const PAGE_TITLE = "Home";

const YOUR_LISTS = "Go To Your Lists Page";
const CROWD_SOURCE = "Go To Crowd Source Page";

const YOUR_LISTS_PAGE = "YourListsPage";
const CROWD_SOURCE_PAGE = "CrowdSourcePage";

const MARGIN_RATIO = 30;

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
    { title: 'Dark Mode', icon: MoonOutline },
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

  buttonListener = buttonId => {
    if (buttonId == CROWD_SOURCE) {
      this.props.navigation.navigate(CROWD_SOURCE_PAGE);
    } else if (buttonId == YOUR_LISTS) {
      this.props.navigation.navigate(YOUR_LISTS_PAGE);
    }
  };

  renderLeftMenuAction = () => (
    <TopNavigationAction icon={MenuOutline} onPress={() => this.props.navigation.toggleDrawer()} />
  );

  renderRightMenuAction = () => (
    <OverflowMenu
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
    const menuVisible = !this.state.menuVisible;
    this.setState({ menuVisible });
  };

  onMenuItemSelect = (index) => {
    if (index = 0) {
      global.theme = global.theme == light ? dark : light;
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
        <ScrollView style={styles.scrollContainer}>
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
    backgroundColor: global.theme == light ? light["background-basic-color-1"] : dark["background-basic-color-1"]
  },
});

export default HomePage;
