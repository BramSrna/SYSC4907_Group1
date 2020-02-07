import React, { Component } from 'react';
import { Button } from 'react-native-ui-kitten';
import { WebView } from 'react-native-webview';
import NotificationPopup from 'react-native-push-notification-popup';
import nm from '../pages/Functions/NotificationManager.js';
export default class SearchRecipePage extends Component {

  constructor(props) {
    super(props);
    this.WEBVIEW_REF = React.createRef();
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

  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack
    });
  }

  handleBackButton = () => {
    this.WEBVIEW_REF.current.goBack();
    return true;
  }

  render() {
    return (
      <React.Fragment>
        <Button disabled={false} onPress={this.handleBackButton}>Go Back</Button>
        <WebView
          ref={this.WEBVIEW_REF}
          source={{ uri: 'https://www.google.ca' }}
          style={{ marginTop: 20 }}
          onNavigationStateChange={this.onNavigationStateChange.bind(this)}
        />
        <NotificationPopup ref={ref => this.popup = ref} />
      </React.Fragment>
    );
  }
}