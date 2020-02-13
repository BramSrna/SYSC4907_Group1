import React, { Component } from 'react';
import NotificationPopup from 'react-native-push-notification-popup';
import nm from '../pages/Functions/NotificationManager.js';
import rf from "./Functions/RecipeFunctions";
import { ScrollView, StyleSheet } from 'react-native';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';

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
        <ScrollView style={styles.card}>
          <Card>
            <CardImage
              source={{ uri: 'http://bit.ly/2GfzooV' }}
            // title="Top 10 South African beaches"
            />
            <CardTitle
              subtitle="Number 6"
            />
            <CardContent text="Clifton, Western Cape" />
            <CardAction
              separator={true}
              inColumn={false}>
              <CardButton
                onPress={() => { rf.AddRecipesToDatabase() }}
                title="Share"
                color="#FEB557"
              />
              <CardButton
                onPress={() => { }}
                title="Explore"
                color="#FEB557"
              />
            </CardAction>
          </Card>
          <Card>
            <CardImage
              source={{ uri: 'http://bit.ly/2GfzooV' }}
            // title="Top 10 South African beaches"
            />
            <CardTitle
              subtitle="Number 6"
            />
            <CardContent text="Clifton, Western Cape" />
            <CardAction
              separator={true}
              inColumn={false}>
              <CardButton
                onPress={() => { }}
                title="Share"
                color="#FEB557"
              />
              <CardButton
                onPress={() => { }}
                title="Explore"
                color="#FEB557"
              />
            </CardAction>
          </Card>
          <Card>
            <CardImage
              source={{ uri: 'http://bit.ly/2GfzooV' }}
            // title="Top 10 South African beaches"
            />
            <CardTitle
              subtitle="Number 6"
            />
            <CardContent text="Clifton, Western Cape" />
            <CardAction
              separator={true}
              inColumn={false}>
              <CardButton
                onPress={() => { }}
                title="Share"
                color="#FEB557"
              />
              <CardButton
                onPress={() => { }}
                title="Explore"
                color="#FEB557"
              />
            </CardAction>
          </Card>
        </ScrollView>
        <NotificationPopup ref={ref => this.popup = ref} />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'black'
  }
});
