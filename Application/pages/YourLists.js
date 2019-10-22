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
            items: {},
            user_count: 1
         });
      var key = push.key;
      var uid = firebase.auth().currentUser.uid;
      firebase.database().ref("/users/" + uid + "/lists/created").child(key).set(0).then((data) => {
      }).catch((error) => {
         alert("Failed to create list: " + error);
      })

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
               var listId = this.state.apiData[this.state.activeRow].key;
               firebase
                  .database()
                  .ref("/users/" + uid + "/lists")
                  .once("value", function (snapshot) {
                     if (snapshot.val()) {
                        // Remove from the user created section if exists
                        var createdLists = snapshot.val().created;
                        for (var cList in createdLists) {
                           if (
                              cList ===
                              listId
                           ) {
                              firebase.database().ref("/users/" + uid + "/lists/created/").child(cList).remove();
                              firebase
                                 .database()
                                 .ref("/lists/" + cList)
                                 .once("value", function (snapshot) {
                                    if (snapshot.val()) {
                                       if (snapshot.val().user_count == 1) {
                                          firebase.database().ref("/lists/").child(cList).remove();
                                       } else {
                                          var newCount = snapshot.val().user_count - 1;
                                          firebase.database().ref("/lists/" + cList).update({
                                             user_count: newCount
                                          });
                                       }
                                    }
                                 });
                              break;
                           }
                        }

                        // Remove from the user shared section if exists, but only if not removed earlier
                        var sharedLists = snapshot.val().shared;
                        for (sList in sharedLists) {
                           if (
                              sList ===
                              listId
                           ) {
                              firebase.database().ref("/users/" + uid + "/lists/shared/").child(sList).remove();
                              firebase
                                 .database()
                                 .ref("/lists/" + sList)
                                 .once("value", function (snapshot) {
                                    if (snapshot.val()) {
                                       if (snapshot.val().user_count == 1) {

                                          firebase.database().ref("/lists/").child(sList).remove();
                                       } else {
                                          var newCount = snapshot.val().user_count - 1;
                                          firebase.database().ref("/lists/" + cList).update({
                                             user_count: newCount
                                          });
                                       }
                                    }
                                 });
                              break;
                           }

                        }
                     }

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
