import React, { Component } from 'react';
import { Button } from 'react-native-ui-kitten';
import { WebView } from 'react-native-webview';
import NotificationPopup from 'react-native-push-notification-popup';
import nm from '../pages/Functions/NotificationManager.js';
const HTMLParser = require('fast-html-parser');

export default class SearchRecipePage extends Component {

  constructor(props) {
    super(props);
    this.WEBVIEW_REF = React.createRef();
    this.state = {
      canGoBack: false,
      url: ''
    };
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
      canGoBack: navState.canGoBack,
      url: navState.url
    });
  }

  handleBackButton = () => {
    this.WEBVIEW_REF.current.goBack();
    return true;
  }

  scanForIngredients = async () => {
    const url = this.state.url;
    const response = await fetch(url);
    const html = await response.text();
    const root = HTMLParser.parse(html);
    this.findIngredients(root.querySelectorAll('li.checkList__line'))
  }

  findIngredients = (qs) => {
    console.log(qs.length)
    for (var a = 0; a < qs.length - 3; a++)
      console.log(a + qs[a].childNodes[1].childNodes[3].childNodes[0].rawText)
  }

  render() {
    return (
      <React.Fragment>
        <Button disabled={false} onPress={this.handleBackButton}>Go Back</Button>
        <Button disabled={false} onPress={this.scanForIngredients}>READ</Button>
        <WebView
          ref={this.WEBVIEW_REF}
          source={{ uri: 'https://www.allrecipes.com/recipe/21513/country-sausage-gravy/?internalSource=rotd&referringId=78&referringContentType=Recipe%20Hub' }}
          style={{ marginTop: 20 }}
          onNavigationStateChange={this.onNavigationStateChange.bind(this)}
        />
        <NotificationPopup ref={ref => this.popup = ref} />
      </React.Fragment>
    );
  }
}
