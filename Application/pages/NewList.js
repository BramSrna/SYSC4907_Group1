import React, { Component } from "react";
import { Text, Button, View, FlatList, Alert, BackHandler } from "react-native";
import styles from "./pageStyles/NewListPageStyle";
import { db } from "../config";
import Swipeout from "react-native-swipeout";

class NewList extends Component {
   constructor(props) {
      super(props);
   }

   render() {
      return (
         <View style={styles.ListContainer}>
            <Text style={styles.pageTitle}>Create a New List</Text>
            <Button
               style={styles.addButton}
               title=" Save "
               onPress={() => Alert.alert("Save pressed")}
            />
         </View>
      );
   }
}

export default YourLists;
