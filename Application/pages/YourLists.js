import React, { Component } from "react";
import {
   TouchableOpacity,
   Text,
   View,
   FlatList,
   Alert,
   Image
} from "react-native";
import styles from "./pageStyles/YourListsPageStyle";
import * as firebase from "firebase";
import Swipeout from "react-native-swipeout";
import Dialog from "react-native-dialog";

class YourLists extends Component {
   constructor(props) {
      super(props);
      this.newListName = "";
      this.state = {
         listTitles: [],
         apiData: [],
         isDialogVisible: false
      };
   }

   GenerateNeededData() {
      // Get all data
      var listIds = [];
      var that = this;
      var uid = firebase.auth().currentUser.uid;
      firebase
         .database()
         .ref("/users/" + uid + "/lists")
         .on("value", function (snapshot) {
            listIds = [];
            var ssv = snapshot.val();
            if (ssv) {
               for (var created in ssv.created) {
                  listIds.push(created);
               }
               for (var shared in ssv.shared) {
                  listIds.push(shared);
               }

               var curApiData = [];
               var listIdLength = listIds.length;
               var counter = 1;
               for (var idKey in listIds) {
                  var currentListId = listIds[idKey];
                  firebase
                     .database()
                     .ref("/lists/" + currentListId)
                     .once("value", function (snapshot) {
                        var ssv = snapshot.val();
                        if (ssv) {
                           curApiData.push({
                              key: snapshot.key,
                              name: ssv.name,
                           });
                           if (counter == listIdLength) {
                              that.setState(
                                 {
                                    apiData: curApiData
                                 },
                                 function () {
                                    that.GenerateListTitlesFromApiData();
                                 }
                              );
                           }
                           counter++;
                        } else {
                           that.setState(
                              {
                                 apiData: curApiData
                              },
                              function () {
                                 that.GenerateListTitlesFromApiData();
                              }
                           );
                           console.log("ERROR: List does not exist.");
                           Alert.alert("ERROR: List does not exist.");
                        }
                     });
               }
            } else {
               that.setState(
                  {
                     apiData: []
                  },
                  function () {
                     that.GenerateListTitlesFromApiData();
                  }
               );
            }
         });
   }

   componentDidMount() {
      this.GenerateNeededData();
   }

   GenerateListTitlesFromApiData() {
      var data = this.state.apiData;
      var tempNames = [];
      for (var list in data) {
         tempNames.push(data[list].name);
      }
      this.setState({ listTitles: tempNames });
   }

   GetListID(listName) {
      var data = this.state.apiData;
      for (var list in data) {
         if (data[list].name == listName) {
            return data[list].key;
         }
      }
   }

   GoToList(listName) {
      this.props.navigation.navigate("CurrentListPage", {
         name: listName,
         listID: this.GetListID(listName)
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
      this.newListName = "";
      this.setState({ isDialogVisible: false });
   };

   handleCreate = () => {
      // Add the list to the lists table
      var push = firebase
         .database()
         .ref("/lists")
         .push({
            name: this.newListName,
            items: []
         });
      var key = push.key;
      var uid = firebase.auth().currentUser.uid;
      firebase
         .database()
         .ref("/users/" + uid + "/lists")
         .once("value", function (snapshot) {
            if (snapshot.val()) {
               // Add the new list to the users created section
               var createdLists = snapshot.val().created;
               createdLists.push(key);
               snapshot.ref.update({ created: createdLists });
            }
         });

      this.newListName = "";
      this.setState({ isDialogVisible: false });
   };

   handleSwipeOpen(rowId, direction) {
      if (typeof direction !== "undefined") {
         this.setState({ activeRow: rowId });
      }
   }

   setNewListName(name) {
      this.newListName = name;
   }

   render() {
      const swipeButtons = [
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
               var uid = firebase.auth().currentUser.uid;
               firebase
                  .database()
                  .ref("/users/" + uid + "/lists")
                  .once("value", function (snapshot) {
                     if (snapshot.val()) {
                        // Remove from the user created section if exists
                        var createdLists = snapshot.val().created;
                        var indexPosition = 0;
                        for (var list in createdLists) {
                           if (
                              list ===
                              this.state.apiData[this.state.activeRow].key
                           ) {
                              createdLists.splice(indexPosition, 1);
                              break;
                           }
                           indexPosition++;
                        }
                        snapshot.ref.update({ created: createdLists });

                        // Remove from the user shared section if exists
                        var sharedLists = snapshot.val().shared;
                        indexPosition = 0;
                        for (list in sharedLists) {
                           if (
                              list ===
                              this.state.apiData[this.state.activeRow].key
                           ) {
                              sharedLists.splice(indexPosition, 1);
                              break;
                           }
                           indexPosition++;
                        }
                        snapshot.ref.update({ shared: sharedLists });
                     }

                     // Remove from the lists table if it is in no users created or shared section
                     firebase
                        .database()
                        .ref("/users/")
                        .once("value", function (snapshot) {
                           var listStillExists = false;
                           if (snapshot.val()) {
                              for (var uid in snapshot.val()) {
                                 var sharedWithLists = snapshot.val().uid
                                    .lists.shared;
                                 for (
                                    var list in sharedWithLists
                                 ) {
                                    if (
                                       list ===
                                       this.state.apiData[
                                          this.state.activeRow
                                       ].key
                                    ) {
                                       listStillExists = true;
                                       break;
                                    }
                                 }

                                 if (!listStillExists) {
                                    var createdLists = snapshot.val().uid
                                       .lists.shared;
                                    for (
                                       list in createdLists
                                    ) {
                                       if (
                                          list ===
                                          this.state.apiData[
                                             this.state.activeRow
                                          ].key
                                       ) {
                                          listStillExists = true;
                                          break;
                                       }
                                    }
                                 }

                                 if (!listStillExists) {
                                    firebase
                                       .database()
                                       .ref("/lists/" + this.state.apiData[this.state.activeRow].key)
                                       .remove();
                                 }
                              }
                           }
                        });
                  });

            }
         }
      ];
      return (
         <View style={styles.ListContainer}>
            <Dialog.Container visible={this.state.isDialogVisible} style={{}}>
               <Dialog.Title>New List</Dialog.Title>
               <Dialog.Description>
                  Enter the name of the new list you would like to create:
               </Dialog.Description>
               <Dialog.Input
                  onChangeText={name => this.setNewListName(name)}
               ></Dialog.Input>
               <Dialog.Button label="Cancel" onPress={this.handleCancel} />
               <Dialog.Button label="Create" onPress={this.handleCreate} />
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
               extraData={this.state.activeRow}
               keyExtractor={index => index.toString()}
               ItemSeparatorComponent={this.FlatListItemSeparator}
               renderItem={({ item, index }) => (
                  <Swipeout
                     right={swipeButtons}
                     backgroundColor="#000000"
                     underlayColor="white"
                     rowID={index}
                     sectionId={1}
                     autoClose={true}
                     onOpen={(secId, rowId, direction) =>
                        this.handleSwipeOpen(rowId, direction)
                     }
                     close={this.state.activeRow !== index}
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
