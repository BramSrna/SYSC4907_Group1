import React, { Component } from 'react';
import NotificationPopup from 'react-native-push-notification-popup';
import nm from './Functions/NotificationManager.js';
import rf from "./Functions/RecipeFunctions";
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

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
    return (
      <React.Fragment>
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
