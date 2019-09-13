import React, { Component } from "react";
import { Text, Button, View, FlatList, Alert, BackHandler } from "react-native";
import styles from "./pageStyles/YourListsPageStyle";
import { db } from "../config";
import Swipeout from "react-native-swipeout";

class YourLists extends Component {
   constructor(props) {
      super(props);

      this.state = {
         listTitles: [],
         apiData: []
      };

      this.listSwipeOptions = [
         {
            text: "Button"
         }
      ];
   }

   componentDidMount() {
      var listIds = [];
      var that = this;
      var uid = /*db.auth().currentUser.uid*/ "Tbn0C7WvyRSoQZ9KQNjFPjIfmGJ2";
      db.database()
         .ref("/users/" + uid + "/lists")
         .on(/*ce*/ "value", function(snapshot) {
            var ssv = snapshot.val();
            if (ssv) {
               for (var createdKey in ssv.created) {
                  listIds.push(ssv.created[createdKey]);
               }
               for (var sharedWithKey in ssv.shared_with) {
                  listIds.push(ssv.shared_with[sharedWithKey]);
               }
               for (var idKey in listIds) {
                  var bool = false;
                  db.database()
                     .ref("/lists/" + listIds[idKey])
                     .on(/*ce*/ "value", function(snapshot) {
                        var ssv = snapshot.val();
                        if (ssv) {
                           var listItems = [];
                           for (var item in ssv.items) {
                              listItems.push(ssv.items[item]);
                           }
                           var curApiData = that.state.apiData;
                           curApiData.push({
                              name: ssv.name,
                              items: listItems
                           });
                           that.setState(
                              {
                                 apiData: curApiData
                              },
                              function() {
                                 that.GenerateListTitlesFromApiData();
                              }
                           );
                        } else {
                           console.log("ERROR: List does not exist.");
                           Alert.alert("ERROR: List does not exist.");
                           that.setState(
                              {
                                 apiData: []
                              },
                              function() {
                                 that.GenerateListTitlesFromApiData();
                              }
                           );
                           bool = true;
                        }
                     });
                  if (bool) break;
               }
            } else {
               that.setState(
                  {
                     apiData: []
                  },
                  function() {
                     that.GenerateListTitlesFromApiData();
                  }
               );
            }
         });

      BackHandler.addEventListener("hardwareBackPress", function() {
         // Return true if you want to go back, false if want to ignore. This is for Android only.
         // return true;
         return false;
      });
   }

   GenerateListTitlesFromApiData() {
      var data = this.state.apiData;
      var tempNames = [];
      for (var list in data) {
         tempNames.push(data[list].name);
      }
      this.setState({ listTitles: tempNames });
   }

   GenerateListItemsFromApiData(listName) {
      var data = this.state.apiData;
      var tempList = [];
      for (var list in data) {
         if (data[list].name == listName) {
            tempList = data[list].items;
         }
      }
      return tempList;
   }

   GoToList(item) {
      this.props.navigation.navigate("Current List", {
         name: item,
         list: this.GenerateListItemsFromApiData(item)
      });
   }

   FlatListItemSeparator = () => {
      return (
         <View
            style={{
               height: 1,
               width: "100%",
               backgroundColor: "#607D8B"
            }}
         />
      );
   };

   render() {
      return (
         <View style={styles.ListContainer}>
            <Text style={styles.pageTitle}>
               Your Lists: {this.state.listTitles.length}
            </Text>
            <Button
               style={styles.addButton}
               title=" + "
               onPress={() => Alert.alert("New list pressed")}
            />
            <FlatList
               style={styles.flatList}
               data={this.state.listTitles}
               width="100%"
               extraData={this.state.arrayHolder}
               keyExtractor={index => index.toString()}
               ItemSeparatorComponent={this.FlatListItemSeparator}
               renderItem={({ item }) => (
                  // <Text
                  //    style={styles.item}
                  //    onPress={this.GoToList.bind(this, item)}
                  // >
                  //    {item}
                  // </Text>
                  <Swipeout right={this.listSwipeOptions}>
                     <View>
                        <Text
                           style={styles.item}
                           onPress={this.GoToList.bind(this, item)}
                        >
                           {item}
                        </Text>
                     </View>
                  </Swipeout>
               )}
            />
         </View>
      );
   }
}

export default YourLists;
