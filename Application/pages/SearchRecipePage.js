import * as firebase from "firebase";
import React, { Component } from 'react';
import { Button } from 'react-native-ui-kitten';
import NotificationPopup from 'react-native-push-notification-popup';
import nm from '../pages/Functions/NotificationManager.js';
const API_KEY = "5c39c2c2fa5e4183a1f9a3f799e49baa"; // 50/1.01 calls/day allowed

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

  getRecipe = () => {
    // let url = "https://api.spoonacular.com/recipes/random?number=1&apiKey=" + API_KEY;
    // fetch(url, {
    //   method: "GET",
    // }).then(function (response) {
    //   if (response.status === 200) {

    //     response.json().then(function (json) {
    //       const title = json.recipes[0].title
    //       const data = json.recipes[0];
    //       firebase.database().ref('/recipes/' + title).set(data).then(function (snapshot) {
    //         // console.log(snapshot);
    //       });
    //     });

    //   } else {
    //     console.log("API did not respond well.")
    //   }
    // }, function (error) {
    //   console.log(error.message)
    // })
    console.log("getRecipe is commented out to save API calls")
  }


  render() {
    return (
      <React.Fragment>
        <Button disabled={false} onPress={this.getRecipe}>GET A RECIPE</Button>

        <NotificationPopup ref={ref => this.popup = ref} />
      </React.Fragment>
    );
  }
}
