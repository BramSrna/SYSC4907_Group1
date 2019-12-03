import * as firebase from "firebase";

/**
 * This class contains all the functions that the UI uses to manipulate the database.
 */
class ListFunctions {
   constructor() { }

   sendNotification = (token, title, body, data) => {
      let response = fetch('https://exp.host/--/api/v2/push/send', {
         method: 'POST',
         headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            to: token,
            sound: 'default',
            title: title,
            body: body,
            data: data
         })
      });
   }

   sendNotificationToSharedUsers(listID, listName, message) {
      var uids = [];
      var tokens = [];
      var that = this
      firebase
         .database()
         .ref("/users/")
         .once("value", function (snapshot) {

            if (snapshot.val()) {
               for (var user in snapshot.val()) {
                  if (snapshot.val()[user].lists.shared) {
                     var lists = snapshot.val()[user].lists.shared
                     for (var shared in lists) {
                        if (shared == listID) {
                           uids.push(user);
                        }
                     }
                  }

               }
            } else {
               console.log("Something went wrong!")
            }
         }).then(
            firebase
               .database()
               .ref("/userInfo/")
               .once("value", function (snapshot) {
                  if (snapshot.val()) {
                     for (user in snapshot.val()) {
                        if (uids.includes(snapshot.val()[user].uid)) {
                           if (snapshot.val()[user].notificationToken) {
                              tokens.push(snapshot.val()[user].notificationToken)
                           } else {
                              console.log("User did not give notification access " + snapshot.val()[user])
                           }
                        } else {
                           console.log("User did not log in correctly")
                        }
                     }
                  } else {
                     console.log("Users not configured properly!")
                  }
               })
         ).finally(that.tokensToNotifications(uids, tokens, listID, listName, message))
   }

   tokensToNotifications(uids, tokens, listID, listName, message) {
      var that = this;
      firebase
         .database()
         .ref("/contacts/")
         .once("value", function (snapshot) {
            for (var pos in tokens) {
               var name = firebase.auth().currentUser.email;
               if (snapshot.val()) {
                  if (snapshot.val()[uids[pos]]) {
                     for (contact in snapshot.val()[uids[pos]]) {
                        if (snapshot.val()[uids[pos]][contact].email == name) {
                           name = snapshot.val()[uids[pos]][contact].name
                           break
                        }
                     }
                     that.sendNotification(tokens[pos], name + ' to ' + listName, message, {
                        "page": "CurrentListPage",
                        "name": listName,
                        "listID": listID
                     });
                  } else {
                     console.log("There are no contacts for that person")
                  }
               } else {
                  console.log("tokensToNotifications messed up")
               }
            }
         })

   }

   /**
    * This function is used to add items to a list.
    * @param {*} listId: id of the list we are adding items to
    * @param {*} name: name of the item
    * @param {*} quantity: quantity of the item
    * @param {*} size: size of the item
    * @param {*} notes: additional notes regarding the item
    */
   AddItemToList(listId, name, quantity, size, notes) {
      firebase
         .database()
         .ref("/lists/" + listId + "/items/")
         .push({
            name: name,
            purchased: false,
            quantity: quantity,
            size: size,
            notes: notes
         });
   }

   /**
    * This function is used to remove an item from a list
    * @param {*} listId: id of the list the item is in
    * @param {*} itemId: id of the item of the list
    */
   DeleteItemInList(listId, itemId) {
      firebase
         .database()
         .ref("/lists/" + listId + "/items/")
         .child(itemId)
         .remove();
   }

   /**
    * This function is used to change the purchased boolean in the database
    * @param {*} listId: id of the list the item is in
    * @param {*} itemId: id of the item in the list
    */
   UpdatePurchasedBoolOfAnItemInAList(listId, itemId) {
      firebase
         .database()
         .ref("/lists/" + listId + "/items/" + itemId)
         .once("value", function (snapshot) {
            var currentBool = snapshot.val().purchased;
            firebase
               .database()
               .ref("/lists/" + listId + "/items/" + itemId)
               .update({
                  purchased: !currentBool
               });
         });
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
            var ids = [];
            var ssv = snapshot.val();
            if (ssv && ssv.items) {
               for (var item in ssv.items) {
                  items.push(ssv.items[item]);
                  ids.push(item);
               }
            }
            that.setState({
               listItems: items,
               listItemIds: ids
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
                  if (cList === listId) {
                     firebase
                        .database()
                        .ref("/users/" + uid + "/lists/created/")
                        .child(cList)
                        .remove();
                     firebase
                        .database()
                        .ref("/lists/" + cList)
                        .once("value", function (snapshot) {
                           if (snapshot.val()) {
                              if (snapshot.val().user_count == 1) {
                                 firebase
                                    .database()
                                    .ref("/lists/")
                                    .child(cList)
                                    .remove();
                              } else {
                                 var newCount = snapshot.val().user_count - 1;
                                 firebase
                                    .database()
                                    .ref("/lists/" + cList)
                                    .update({
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
                  if (sList === listId) {
                     firebase
                        .database()
                        .ref("/users/" + uid + "/lists/shared/")
                        .child(sList)
                        .remove();
                     firebase
                        .database()
                        .ref("/lists/" + sList)
                        .once("value", function (snapshot) {
                           if (snapshot.val()) {
                              if (snapshot.val().user_count == 1) {
                                 firebase
                                    .database()
                                    .ref("/lists/")
                                    .child(sList)
                                    .remove();
                              } else {
                                 var newCount = snapshot.val().user_count - 1;
                                 firebase
                                    .database()
                                    .ref("/lists/" + cList)
                                    .update({
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
      firebase
         .database()
         .ref("/users/" + uid + "/lists/created")
         .child(key)
         .set(0)
         .then(data => { })
         .catch(error => {
            console.log("Failed to create list: " + error);
         });
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
               var bool = true;
               for (var idKey in listIds) {
                  bool = false;
                  var currentListId = listIds[idKey];
                  firebase
                     .database()
                     .ref("/lists/" + currentListId)
                     .once("value", function (snapshot) {
                        var ssv = snapshot.val();
                        if (ssv) {
                           curApiData.push({
                              key: snapshot.key,
                              name: ssv.name
                           });
                           listTitles.push(ssv.name);
                           listTitles.sort((a, b) => a.localeCompare(b))
                           if (counter == listIdLength) {
                              that.setState({
                                 apiData: curApiData,
                                 listTitles: listTitles
                              });
                           }
                           counter++;
                        } else {
                           console.log("ERROR: List does not exist.");

                           that.setState({
                              apiData: curApiData,
                              listTitles: listTitles
                           });
                        }
                     });
               }
               if (bool) {
                  that.setState({
                     apiData: [],
                     listTitles: []
                  });
               }
            } else {
               console.log("No API data...");
               that.setState({
                  apiData: [],
                  listTitles: []
               });
            }
         });
   }

   /**
    * Get the current theme of the user
    * @param {*} that: this for caller
    */
   GetTheme(that) {
      var uid = firebase.auth().currentUser.uid;
      if (uid) {
         firebase
            .database()
            .ref("/users/" + uid + "/preferences/theme")
            .on("value", function (snapshot) {
               var ssv = snapshot.val();
               that.setState({
                  theme: ssv == 'light' ? 'light' : 'dark',
               });
            });
      }
   }

   /**
    * Toggle the current theme of the user
    * @param {*} that: this for caller
    */
   ToggleTheme() {
      var uid = firebase.auth().currentUser.uid;
      var ssv;
      if (uid) {
         firebase
            .database()
            .ref("/users/" + uid + "/preferences/theme")
            .once("value", function (snapshot) {
               ssv = snapshot.val();
            });
         return firebase.database().ref("/users/" + uid + "/preferences/theme").set(ssv == 'light' ? 'dark' : 'light');
      } else null;
   }
}

const lf = new ListFunctions();
export default lf;