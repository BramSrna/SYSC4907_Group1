import * as firebase from "firebase";

/**
 * This class contains all the functions that the UI uses to manipulate the database.
 */
class ListFunctions {
   constructor() {

   }

   /**
    * This function is used to set state for live updates
    * @param {*} that: this of caller
    * @param {*} state: state to update
    */
   SetState(that, state) {
      that.setState(state);
   }


   /**
    * Get all the items in the current list
    * @param {*} that: this for calling function
    * @param {*} listId: id of the list we are currently viewing
    */
   GetItemsInAList(that, listId) {
      firebase
         .database()
         .ref("/lists/" + listId)
         .on("value", function (snapshot) {
            var items = [];
            var ssv = snapshot.val();
            if (ssv.items) {
               for (var item in ssv.items) {
                  items.push(ssv.items[item]);
               }
            }
            this.SetState(that, {
               listItems: items
            });
         });
   }

   /**
    * Delete the list from the user created/shared section. If nobody selse has the list then the list will be removed from the list table.
    * @param {*} listId: id of the list being removed
    */
   DeleteList(listId) {
      var uid = firebase.auth().currentUser.uid;
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

               // Remove from the user shared section if exists
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

   /**
    * Create a new list
    * @param {*} listName: name of the list 
    */
   CreateNewList(listName) {
      // Add the list to the lists table
      var push = firebase
         .database()
         .ref("/lists")
         .push({
            name: listName,
            items: {},
            user_count: 1
         });

      // Add the list to the user table
      var key = push.key;
      var uid = firebase.auth().currentUser.uid;
      firebase.database().ref("/users/" + uid + "/lists/created").child(key).set(0).then((data) => {}).catch((error) => {
         console.log("Failed to create list: " + error);
      })
   }

   /**
    * Get the list keys and names to populate the YourLists.js page
    * @param {*} that: this for caller
    */
   GetListsKeyAndName(that) {
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
               var listTitles = [];
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
                           listTitles.push(ssv.name);
                           if (counter == listIdLength) {
                              this.SetState(that, {
                                 apiData: curApiData,
                                 listTitles: listTitles
                              });
                           }
                           counter++;
                        } else {
                           console.log("ERROR: List does not exist.");

                           this.SetState(that, {
                              apiData: curApiData,
                              listTitles: listTitles

                           });
                        }
                     });
               }
            } else {
               console.log("No API data...")
               this.SetState(that, {
                  apiData: [],
                  listTitles: []

               });
            }
         });
   }


}

const lf = new ListFunctions();
export default lf;