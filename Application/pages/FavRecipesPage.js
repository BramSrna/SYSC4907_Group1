import React, { Component } from "react";
import {
   SectionList,
   StyleSheet,
   Alert,
   Button
} from "react-native";
import cf from "./Functions/ContactFunctions";
import { Layout, Text, TopNavigation, TopNavigationAction, } from 'react-native-ui-kitten';
import { MenuOutline, AddIcon } from "../assets/icons/icons.js";
import ListItemContainer from '../components/ListItemContainer.js';
import NotificationPopup from 'react-native-push-notification-popup';
import nm from '../pages/Functions/NotificationManager.js';

class FavRecipesPage extends Component {
   constructor(props) {
      super(props);
   }


   componentWillMount() {
      this.focusListener = this.props.navigation.addListener(
         "willFocus",
         () => {
            nm.setThat(this);
            this._isMounted = true;
         }
      );

   }
   componentWillUnmount() {
      this.focusListener.remove()
      this._isMounted = false;
   }


   render() {

   }



}
const styles = StyleSheet.create({

});
export default FavRecipesPage;