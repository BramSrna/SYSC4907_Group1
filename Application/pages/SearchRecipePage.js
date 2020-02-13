import React, { Component } from 'react';
import NotificationPopup from 'react-native-push-notification-popup';
import nm from '../pages/Functions/NotificationManager.js';

export default class SearchRecipePage extends Component {

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
    return (
      <React.Fragment>

        <NotificationPopup ref={ref => this.popup = ref} />
      </React.Fragment>
    );
  }
}
