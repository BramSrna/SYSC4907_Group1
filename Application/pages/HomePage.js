import React, { Component } from "react";
import { StyleSheet } from 'react-native';
import { Layout, TopNavigation, TopNavigationAction, OverflowMenu } from 'react-native-ui-kitten';
import { MenuOutline, Moon, MoonOutline, MenuIcon } from "../assets/icons/icons.js";
import { ScrollView } from "react-native-gesture-handler";
import HomeSquareContainer from "../components/HomeSquareContainer.js";

const PAGE_TITLE = "Home";

const YOUR_LISTS = "Go To Your Lists Page";
const CROWD_SOURCE = "Go To Crowd Source Page";

const YOUR_LISTS_PAGE = "YourListsPage";
const CROWD_SOURCE_PAGE = "CrowdSourcePage";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuVisible: false,
    };
  }

  menuData = [
    { title: 'Dark Mode', icon: MoonOutline },
  ];

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
    if (index = 1) {
      // do stuff
    }

    this.setState({ menuVisible: false });
  };

  render() {
    return (
      <React.Fragment>
        <TopNavigation
          title={PAGE_TITLE}
          alignment='center'
          leftControl={this.renderLeftMenuAction()}
          rightControls={this.renderRightMenuAction()}
        />
        <ScrollView style={styles.scrollContainer}>
          <Layout style={styles.container}>
            <HomeSquareContainer name='Your Lists' icon='list-outline' onPress={() => this.props.navigation.navigate(YOUR_LISTS_PAGE)}/>
            <HomeSquareContainer name='Your Contacts' icon='people-outline'/>
            <HomeSquareContainer name='Find Stores' icon='map-outline'/>
            <HomeSquareContainer name='Search Recipes' icon='search-outline'/>
            <HomeSquareContainer name='Your Recommendations' icon='bulb-outline' sizeVal={2} />
            <HomeSquareContainer name='Shared With You' icon='share-outline' />
            <HomeSquareContainer name='Crowd-Source' icon='loader-outline' onPress={() => this.props.navigation.navigate(CROWD_SOURCE_PAGE)}/>
          </Layout>
        </ScrollView>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    height: '100%',
    flexDirection:'row',
    flexWrap:'wrap',
  },
  scrollContainer: {
    flex:1,
  },
});

export default HomePage;
