import React, { Component } from 'react';
import NotificationPopup from 'react-native-push-notification-popup';
import nm from './Functions/NotificationManager.js';
import rf from "./Functions/RecipeFunctions";
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { TopNavigation, TopNavigationAction, Layout, RangeDatepicker } from 'react-native-ui-kitten';
import { MenuOutline, HeartIcon, ListIcon } from "../assets/icons/icons.js";

export default class RecipeDetailsPage extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.focusListener = this.props.navigation.addListener(
      "willFocus",
      () => {
        nm.setThat(this)
        this._isMounted = true;

      }
    );
  }

  componentWillUnmount() {
    this.focusListener.remove()
    this._isMounted = false;
  }

  render() {
    const url = this.props.navigation.getParam("url", "http://www.google.ca");
    const AddAction = (props) => (
      <Layout style={{ flexDirection: "row" }}>
        <TopNavigationAction {...props} icon={ListIcon} onPress={() => this.props.navigation.navigate("YourListsPage", {
          ingredients: this.props.navigation.getParam("ingredients", false)
        })} />
        <TopNavigationAction {...props} icon={HeartIcon} onPress={() => rf.AddFavouriteRecipe(this.props.navigation.getParam("name", "error"))} />
      </Layout>
    );

    const renderRightControls = () => [
      <AddAction />
    ];

    const renderMenuAction = () => (
      <TopNavigationAction icon={MenuOutline} onPress={() => this.props.navigation.toggleDrawer()} />
    );
    return (
      <React.Fragment>
        <TopNavigation
          title="Recipe Details"
          alignment='center'
          leftControl={renderMenuAction()}
          rightControls={renderRightControls()}
        />
        <WebView
          source={{ uri: url }}
          style={{ marginTop: 20 }}
        />
        <NotificationPopup ref={ref => this.popup = ref} />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({

});
