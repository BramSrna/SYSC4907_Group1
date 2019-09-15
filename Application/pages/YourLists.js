import React, { Component } from "react";
import {
   TouchableOpacity,
   Text,
   Button,
   View,
   FlatList,
   Alert,
   BackHandler,
   Image
} from "react-native";
import styles from "./pageStyles/YourListsPageStyle";
import { db } from "../config";
import Swipeout from "react-native-swipeout";
import Dialog from "react-native-dialog";

class YourLists extends Component {
   constructor(props) {
      super(props);

      this.state = {
         listTitles: [],
         apiData: [],
         isDialogVisible: false
      };

      this.listSwipeOptions = [
         {
            component: (
               <View
                  style={{
                     flex: 1,
                     alignItems: "center",
                     justifyContent: "center",
                     flexDirection: "column"
                  }}
               >
                  <Image source={require("../images/delete_list_button.png")} />
               </View>
            ),
            backgroundColor: "red",
            onPress: () => {
               Alert.alert("Delete list button was clicked");
            }
         }
      ];
   }

   componentDidMount() {
      // Instead of constantly making api data calls just use this hardcoded data for development purposes
      this.setState(
         {
            apiData: [
               {
                  items: [
                     {
                        name: "Gum",
                        purchased: true
                     },
                     {
                        name: "Candy",
                        purchased: true
                     },
                     {
                        name: "Bread",
                        purchased: true
                     },
                     {
                        name: "Pop",
                        purchased: false
                     },
                     {
                        name: "Eggs",
                        purchased: true
                     }
                  ],
                  name: "Walmart List"
               },
               {
                  items: [
                     {
                        name: "Milk",
                        purchased: false
                     },
                     {
                        name: "Cereal",
                        purchased: true
                     }
                  ],
                  name: "Shoppa Drugggz M4rt"
               }
            ]
         },
         function() {
            this.GenerateListTitlesFromApiData();
         }
      );
      // var listIds = [];
      // var that = this;
      // var uid = /*db.auth().currentUser.uid*/ "Tbn0C7WvyRSoQZ9KQNjFPjIfmGJ2";
      // db.database()
      //    .ref("/users/" + uid + "/lists")
      //    .on(/*ce*/ "value", function(snapshot) {
      //       var ssv = snapshot.val();
      //       if (ssv) {
      //          for (var createdKey in ssv.created) {
      //             listIds.push(ssv.created[createdKey]);
      //          }
      //          for (var sharedWithKey in ssv.shared_with) {
      //             listIds.push(ssv.shared_with[sharedWithKey]);
      //          }
      //          for (var idKey in listIds) {
      //             var bool = false;
      //             db.database()
      //                .ref("/lists/" + listIds[idKey])
      //                .on(/*ce*/ "value", function(snapshot) {
      //                   var ssv = snapshot.val();
      //                   if (ssv) {
      //                      var listItems = [];
      //                      for (var item in ssv.items) {
      //                         listItems.push(ssv.items[item]);
      //                      }
      //                      var curApiData = that.state.apiData;
      //                      curApiData.push({
      //                         name: ssv.name,
      //                         items: listItems
      //                      });
      //                      that.setState(
      //                         {
      //                            apiData: curApiData
      //                         },
      //                         function() {
      //                            that.GenerateListTitlesFromApiData();
      //                         }
      //                      );
      //                   } else {
      //                      console.log("ERROR: List does not exist.");
      //                      Alert.alert("ERROR: List does not exist.");
      //                      that.setState(
      //                         {
      //                            apiData: []
      //                         },
      //                         function() {
      //                            that.GenerateListTitlesFromApiData();
      //                         }
      //                      );
      //                      bool = true;
      //                   }
      //                });
      //             if (bool) break;
      //          }
      //       } else {
      //          that.setState(
      //             {
      //                apiData: []
      //             },
      //             function() {
      //                that.GenerateListTitlesFromApiData();
      //             }
      //          );
      //       }
      //    });

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

   handleCancel = () => {
      this.setState({ isDialogVisible: false });
   };

   handleDelete = () => {
      // The user has pressed the "Delete" button, so here you can do your own logic.
      // ...Your logic
      this.setState({ isDialogVisible: false });
   };

   render() {
      return (
         <View style={styles.ListContainer}>
            <Dialog.Container visible={this.state.isDialogVisible} style={{}}>
               <Dialog.Title>New List</Dialog.Title>
               <Dialog.Description>
                  Enter the name of the new list you would like to create:
               </Dialog.Description>
               <Dialog.Input></Dialog.Input>
               <Dialog.Button label="Cancel" onPress={this.handleCancel} />
               <Dialog.Button label="Delete" onPress={this.handleDelete} />
            </Dialog.Container>
            <Text style={styles.pageTitle}>
               Your Lists: {this.state.listTitles.length}
            </Text>
            <TouchableOpacity
               onPress={() => this.setState({ isDialogVisible: true })}
            >
               <Image source={require("../images/new_list_button.png")} />
            </TouchableOpacity>
            <FlatList
               style={styles.flatList}
               data={this.state.listTitles}
               width="100%"
               extraData={this.state.arrayHolder}
               keyExtractor={index => index.toString()}
               ItemSeparatorComponent={this.FlatListItemSeparator}
               renderItem={({ item }) => (
                  <Swipeout
                     right={this.listSwipeOptions}
                     backgroundColor="#000000"
                     underlayColor="white"
                  >
                     <TouchableOpacity onPress={this.GoToList.bind(this, item)}>
                        <Text style={styles.item}>{item}</Text>
                     </TouchableOpacity>
                  </Swipeout>
               )}
            />
         </View>
      );
   }
}

export default YourLists;
