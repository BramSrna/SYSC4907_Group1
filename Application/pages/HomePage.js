import React, { Component } from "react";
import { Text, View, TouchableHighlight } from "react-native";
import globalStyles from "../pages/pageStyles/GlobalStyle";
import firebase from 'firebase';
import Menu from "./Menu"
import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'


const YOUR_LISTS = "Go To Your Lists Page"
const CROWD_SOURCE = "Go To Crowd Source Page"
const SIGN_OUT = "Sign Out"

const YOUR_LISTS_PAGE = "YourListsPage";
const CROWD_SOURCE_PAGE = "CrowdSourcePage";



class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    // Make sure user information added to the database
    var currentUser = firebase.auth().currentUser;
    var emailId = currentUser.email.toString();
    emailId = emailId.replace(/\./g, ",");
    firebase
      .database()
      .ref("/userInfo/" + emailId)
      .once("value", function (snapshot) {
        if (!snapshot.val()) {
          firebase.database().ref('/userInfo/' + emailId).set({ uid: currentUser.uid }).then(function (snapshot) {
            // console.log(snapshot);
          });
        }
      });
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();

    try {
      firebase.database().ref('/userInfo/' + emailId + '/notificationToken').set(token)

    } catch (error) {
      console.log(error)
    }

  }


  buttonListener = buttonId => {
    if (buttonId == CROWD_SOURCE) {
      this.props.navigation.navigate(CROWD_SOURCE_PAGE);
    } else if (buttonId == SIGN_OUT) {
      firebase.auth().signOut();
    } else if (buttonId == YOUR_LISTS) {
      this.props.navigation.navigate(YOUR_LISTS_PAGE);
    }
  };

  render() {
    return (
      <React.Fragment>
        <Menu toggleAction={() => this.props.navigation.toggleDrawer()} />
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

          <TouchableHighlight
            style={[globalStyles.defaultButtonContainer, globalStyles.defaultButton]}
            onPress={() => this.buttonListener(SIGN_OUT)}
          >
            <Text style={globalStyles.whiteText}>{SIGN_OUT}</Text>
          </TouchableHighlight>

        </View>
      </React.Fragment>
    );
  }
}

export default HomePage;
