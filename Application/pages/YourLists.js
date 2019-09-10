import React, { Component } from "react";
import { Text, View, FlatList, Alert, BackHandler } from "react-native";
import styles from "./pageStyles/YourListsPageStyle";
import { db } from "../config";

class YourLists extends Component {
   constructor(props) {
      super(props);

      this.state = {
         listTitles: [],
         apiData: []
      };
   }

   componentDidMount() {
      var listIds = [];
      var uid = /*db.auth().currentUser.uid*/ "Tbn0C7WvyRSoQZ9KQNjFPjIfmGJ2";
      db.database()
         .ref("/users/" + uid + "/lists")
         .once("value")
         .then(function(snapshot) {
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
                     .once("value")
                     .then(function(snapshot) {
                        var ssv = snapshot.val();
                        if (ssv) {
                           var listItems = [];
                           for (var item in ssv.items) {
                              listItems.push(ssv.items[item]);
                           }
                           var curApiData = this.state.apiData;
                           curApiData.push({
                              name: ssv.name,
                              items: listItems
                           });
                           this.setState(
                              {
                                 apiData: curApiData
                              },
                              function() {
                                 this.GenerateListTitlesFromApiData();
                              }
                           );
                        } else {
                           console.log("ERROR: List does not exist.");
                           Alert.alert("ERROR: List does not exist.");
                           this.setState(
                              {
                                 apiData: []
                              },
                              function() {
                                 this.GenerateListTitlesFromApiData();
                              }
                           );
                           bool = true;
                        }
                     });
                  if (bool) break;
               }
            } else {
               this.setState(
                  {
                     apiData: []
                  },
                  function() {
                     this.GenerateListTitlesFromApiData();
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

   /**
   * TODO
   Should we pass in all the API data, so that way if they return to the page we don't have to make another API call.
   Pro: Less API call --> Faster? Save data?
   Con: Passing in a lot of useless info to another page --> Slower?
   */
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
            <FlatList
               style={styles.flatList}
               data={this.state.listTitles}
               width="100%"
               extraData={this.state.arrayHolder}
               keyExtractor={index => index.toString()}
               ItemSeparatorComponent={this.FlatListItemSeparator}
               renderItem={({ item }) => (
                  <Text
                     style={styles.item}
                     onPress={this.GoToList.bind(this, item)}
                  >
                     {item}
                  </Text>
               )}
            />
         </View>
      );
   }
}

export default YourLists;
