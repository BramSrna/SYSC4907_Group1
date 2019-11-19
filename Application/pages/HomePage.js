import React, { Component } from "react";
import { Text, View, TouchableHighlight } from "react-native";
import { Layout, TopNavigation, TopNavigationAction, OverflowMenu } from 'react-native-ui-kitten';
import globalStyles from "../pages/pageStyles/GlobalStyle";
import { MenuOutline, Moon, MoonOutline } from "../assets/icons/icons.js";

const PAGE_TITLE = "Home";

const YOUR_LISTS = "Go To Your Lists Page";
const CROWD_SOURCE = "Go To Crowd Source Page";

const YOUR_LISTS_PAGE = "YourListsPage";
const CROWD_SOURCE_PAGE = "CrowdSourcePage";

class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  menuData = [
    { title: 'Dark Mode', icon: InfoIcon },
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

  onMenuItemSelect = (index) => {
    if(index = 1){
      
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
        <Layout style={globalStyles.defaultContainer}>
          <View style={globalStyles.defaultContainer}>
            <Text style={globalStyles.whiteText}>HomePage</Text>

            <TouchableHighlight
              style={[globalStyles.defaultButtonContainer, globalStyles.defaultButton]}
              onPress={() => this.buttonListener(CROWD_SOURCE)}
            >
              <Text style={globalStyles.whiteText}>{CROWD_SOURCE}</Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={[globalStyles.defaultButtonContainer, globalStyles.defaultButton]}
              onPress={() => this.buttonListener(YOUR_LISTS)}
            >
              <Text style={globalStyles.whiteText}>{YOUR_LISTS}</Text>
            </TouchableHighlight>
          </View>
        </Layout>
      </React.Fragment>

    );
  }
}

export default HomePage;
